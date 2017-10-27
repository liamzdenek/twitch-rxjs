import { Observable } from 'rxjs';

function consumerEpic(action$) {
	return channelJoin(action$, process.env.TWITCH_CHANNEL, () => {
		//return Observable.never();
		return Observable.of(channelMsg("hi"));
	})
}

import isObservable from 'is-observable';
import { ircMessage } from './irc'
function channelJoin(action$, channel, fn) { 
	let err;
	const inner$ = fn();
	if(!isObservable(inner$)) {
		throw new Error("inner$ function did not return an observable");
	}
	return Observable.concat(
		// register to the channel
		Observable.of(channelsRegister(channel)),
	
		// wait for the JOIN response
		action$
			.takeWhile((a) => !(a.type === "@twitch/IN" && a.command === "JOIN" && a.params[0] === channel))
			.ignoreElements(),
		Observable.of(1).do((a)=> console.log("Running main fn")).ignoreElements(),

		// run the consumer's logic and make sure errors don't prevent us from unregistering
		fn()
			.map((a) => {
				if(a.type === "@channel/MESSAGE") {
					return ircMessage(channel, a.message);
				}
				return a;
			})
			.catch((_err) => {
				err = _err; return Observable.of()
			}),

		// unregister
		Observable.of(channelsUnregister(channel)),
		
		// re-emit the error
		Observable.defer(() => {
			if(err) { throw err; }
			return Observable.of();
		})
	);
}

import { ircJoin, ircPart } from './irc'
import { onLogin, onDisconnect } from './connection';
function channelsRegister(channel) { return { type: "@channels/REGISTER", channel }; }
function channelsUnregister(channel) { return { type: "@channels/UNREGISTER", channel }; }
function channelMsg(message) { return { type: "@channel/MESSAGE", message }; }
// on connect
function channelsEpic(action$){
	const onLogin$ = action$.let(onLogin);
	const onDisconnect$ = action$.let(onDisconnect);

	const onRegister$ = action$.ofType("@channels/REGISTER");
	const onUnregister$ = action$.ofType("@channels/UNREGISTER");

	let join_queue = {};
	let join_refcount = {};

	return Observable.merge(
		onLogin$.flatMap(() => {
			const joins = Object.keys(join_refcount).map((r) => ircJoin(r));
			return Observable.of(...joins);
		}),
		onRegister$.flatMap((a) => {
			let retval = [];
			if(!(a.channel in join_refcount)) {
				join_refcount[a.channel] = 0;
				retval.push(ircJoin(a.channel));
			}
			join_refcount[a.channel] += 1;
			return Observable.of(...retval);
		}),
		onUnregister$.flatMap((a) => {
			const cur_count = join_refcount[a.channel];
			if(cur_count <= 1) {
				delete join_refcount[a.channel];
				return Observable.of(ircPart(a.channel));
			}
			return Observable.of();
		})
	)
		
}

export const epics = { channelsEpic, consumerEpic }

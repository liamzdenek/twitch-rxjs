import WebSocket from 'ws';
import { Observable } from 'rxjs';
import { QueueingSubject } from 'queueing-subject'
import websocketConnect from 'rxjs-websockets'
import { parse } from 'irc-message'
import ActionsObservable from './ActionsObservable';
import combineEpics from './combineEpics';
import * as defaultEpics from './defaultEpics';

export default function createTwitch(options, rootEpic) {
	const {
		path,
		noDefaultEpics = false,
	} = options;
	return Observable.defer(() => {
		console.log("Connecting");
		const outgoingBuffer$ = new QueueingSubject();
		const cycle$ = new QueueingSubject();
		
		const { messages: incoming$, connectionStatus: connectionStatus$ } = websocketConnect(
			options.path,
			outgoingBuffer$,
			undefined,
			(url, protocols) => new WebSocket(url, protocols)
		);

		const consumerCopy$ = Observable.merge(
			incoming$.let(transformMessage),
			cycle$,
			connectionStatus$.let(transformStatus),
		).share();

		const outgoing$ = new ActionsObservable(consumerCopy$).let(
			combineEpics(
				outputEpic(outgoingBuffer$), // even if you dont want the other ones, you probably want this one
				...(noDefaultEpics ? [] : Object.values(defaultEpics)),
				rootEpic,
			)
		);

		return Observable.merge(
			consumerCopy$, // this one should be first so that events are emitted in the order they're created
			outgoing$
				.do((message) => {
					//console.log("Cycling: ", message);
					cycle$.next(message)
				})
				.ignoreElements(),
		);
	})
	.retryWhen((error$) => {
		// retry every 10 seconds according to twitch api docs
		return error$
			.do((error) => console.log("Error:", error))
			.delayWhen( v => Observable.interval(10 * 1000));
	});
}

export function outputEpic(outgoingBuffer$) {
	return (action$) => {
		return action$.ofType("@twitch/OUT")
			.do((action) => {
				console.log("Outgoing: ", action);	
				outgoingBuffer$.next(action.message);	
			})
			.ignoreElements();
	}
}

function transformStatus(status$) {
	return status$
		// .skip(1) // emits a DISCONNECTED first. I think this is because this is a Behavior. This feels unnatural for an event stream, so discard it.
		.map((status) => {
			return {
				type: "STATUS",
				status: status === 1 ? "CONNECTED" : "DISCONNECTED"
			}
		})
}

// converts message string into an object with these keys:
// {
//	raw: "unchagned text",
//	tags: {},
//	prefix: "",
//	command: "",
//	params: [ "" ],
// }
function transformMessage(incoming$) {
	return incoming$
		.flatMap((messages) => Observable.of(...messages.split("\r\n")))
		.filter((message) => message.length !== 0)
		.map(parse)
		.map((obj) => {
			const obj_clone = { ...obj };
			delete obj_clone.raw;
			return {
				...obj_clone,
				type: "@twitch/IN",
				params: obj.params.length === 0 ? [] : [
					...obj.params.slice(0, -1),
					obj.params[obj.params.length-1].trim("\r\n")
				]
			}
		})
}

import { Observable } from 'rxjs';

/*
function consumer(action$) {
	action$
		.let(joinChannel("#polemict", (action$) => {
			
		}))

}
*/

function channelEpic(channelName) {
	return (action$) => {
		/*Observable.merge(
			Observable.of(
			action.ofType(
			
		)*/
	}
}

import { ircJoin } from './irc'
import { onLogin, onDisconnect } from './connection';
// on connect
function channelsEpic(action$){
	const onLogin$ = action$.let(onLogin);
	const onDisconnect$ = action$.let(onDisconnect);

	const onRegister$ = action$.ofType("@channels/REGISTER");
	const onUnregister$ = action$.ofType("@channels/UNREGISTER");

	let refcount = {};

	return Observable.merge(
		onLogin$.flatMap(() => {
			const joins = Object.keys(refcount).map((r) => ircJoin(r));
			return Observable.of(...joins);
		})
	)
		
}

export const epics = { channelsEpic }

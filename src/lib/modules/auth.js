import { actions as ircActions } from './irc';
const { ircPass, ircNick } = ircActions; 

function authEpic(client_id, client_secret) {
	return (action$) => {
		return action$.ofType("STATUS")
			.filter((action) => action.status === "CONNECTED")
			.mergeMap((action) => {
				return Observable.of(
					ircPass(client_secret), // password must be sent first
					ircNick(client_id),
				);
			})
	}
}

export const epics = { authEpic };

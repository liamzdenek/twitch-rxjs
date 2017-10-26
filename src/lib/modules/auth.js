import { actions as ircActions } from './irc';
const { ircPass, ircNick } = ircActions; 

function authEpic(client_nick, client_pass) {
	return (action$) => {
		return action$.ofType("STATUS")
			.filter((action) => action.status === "CONNECTED")
			.mergeMap((action) => {
				return Observable.of(
					ircPass(client_pass), // password must be sent first
					ircNick(client_nick),
				);
			})
	}
}

export const epics = { authEpic };

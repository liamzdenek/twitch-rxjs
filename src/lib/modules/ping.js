import { actions as ircActions} from './irc';
const { ircPong } = ircActions;

function pingEpic(action$) {
	return action$.ofType("@twitch/IN")
		.filter((action) => action.command === 'PING')
		.map((action) => ircPong(action.params.join(' ')))
}

export const epics = { pingEpic };

import { actions as ircActions} from './irc';
const { ircPing } = ircActions;

function pingEpic(action$) {
	return action$.ofType("STATUS")
		.filter((action) => action.status === 'CONNECTED')
		.map((action) => ircPing())
}

export const epics = { pingEpic };

import { actions as loggingActions, epics as loggingEpics } from './logging';
import { actions as pingActions, epics as pingEpics } from './ping';
import { actions as authActions, epics as authEpics } from './auth';
import { irc as ircActions } from './irc';
import { epics as channelEpics } from './channel'
import { lets as connectionLets } from './connection'

export const actions = {
	...loggingActions,
	...pingActions,
	...authActions,
	...ircActions,
}

export const epics = {
	...loggingEpics,
	...pingEpics,
	...authEpics,
	...channelEpics,
}

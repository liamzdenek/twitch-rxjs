import { actions as loggingActions, epics as loggingEpics } from './logging';
import { actions as pingActions, epics as pingEpics } from './ping';

export const actions = {
	...loggingActions,
	...pingActions,
}

export const epics = {
	...loggingEpics,
	...pingEpics,
}

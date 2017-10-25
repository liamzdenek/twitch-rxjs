import chalk from 'chalk'

function loggingEpic(action$) {
	return action$
		.do((action) => console.log("Action Stream: >>>>>", chalk.green(action.type), "<<<<<", JSON.stringify(action)))
		.ignoreElements();
}

export const epics = { loggingEpic };

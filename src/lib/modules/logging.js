import chalk from 'chalk'

const sensitiveFinders = [
	// (action) => action.type === '@twitch/OUT' && action.message.startsWith('PASS') && "PASS [[REDACTED]]"
];

function loggingEpic(action$) {
	return action$
		.do((action) => {
			const finder = sensitiveFinders.find((f) => f(action));
			console.log("Action Stream:",
				">>>>>", chalk.green(action.type), "<<<<<",
				finder ? finder(action) : JSON.stringify(action)
			)
		})
		.ignoreElements();
}

export const epics = { loggingEpic };

import chalk from 'chalk'

const defaultTransformers = [
	(action) => {
		if(action.type === '@twitch/OUT' && action.message.startsWith('PASS')) {
			action.message = "PASS [[REDACTED]]";
		}
		return action
	}
];

function loggingEpic(transformers) {
	if(!transformers) { transformers = defaultTransformers; }
	return (action$) => {
		return action$
			.do((_action) => {
				let action = { ..._action }; 
				transformers.forEach((fn) => action = fn(action));
				console.log("Action Stream:",
					">>>>>", chalk.green(action.type), "<<<<<",
					JSON.stringify(action)
				)
			})
			.ignoreElements();
	}
}

export const epics = { loggingEpic };

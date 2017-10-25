export function ping() { return { type: "@twitch/OUT", message: "PING" } }

export function pingEpic(action$) {
	return action$.ofType("STATUS")
		.filter((action) => action.status === 'CONNECTED')
		.map((action) => ping())
}

export const actions = { ping };
export const epics = { pingEpic };

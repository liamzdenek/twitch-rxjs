export function onLogin(action$) {
	return action$.ofType("@twitch/IN")
		.filter((a) => a.command === "001");
}

export function onConnect(action$) {
	return action$.ofType("STATUS")
		.filter((a) => a.status === "CONNECTED");
}

export function onDisconnect(action$) {
	return action$.ofType("STATUS")
		.filter((a) => a.status === "DISCONNECTED");
}

export const lets = {
	onLogin,
	onConnect,
	onDisconnect
}

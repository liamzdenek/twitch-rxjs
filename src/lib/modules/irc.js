export function ircOut(message) { return { type: "@twitch/OUT", message }; }
export function ircPing() { return ircOut("PING") }
export function ircNick(nick) { return ircOut("NICK " + nick) }
export function ircPass(pass) { return ircOut("PASS " + pass) }
export function ircJoin(channel) { return ircOut("JOIN " + channel); }

export const actions = {
	ircOut,
	ircPing,
	ircNick,
	ircPass,
	ircJoin
}

function ircOut(message) { return { type: "@twitch/OUT", message }; }
function ircPing() { return ircOut("PING") }
function ircNick(nick) { return ircOut("NICK " + nick) }
function ircPass(pass) { return ircOut("PASS " + pass) }

export const actions = {
	ircOut,
	ircPing,
	ircNick,
	ircPass
}

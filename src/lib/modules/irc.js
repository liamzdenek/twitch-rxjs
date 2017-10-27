export function ircOut(message) { return { type: "@twitch/OUT", message }; }
export function ircPing() { return ircOut("PING") }
export function ircPong(m) { return ircOut("PONG :"+m) }
export function ircNick(nick) { return ircOut("NICK " + nick) }
export function ircPass(pass) { return ircOut("PASS " + pass) }
export function ircJoin(channel) { return ircOut("JOIN " + channel); }
export function ircPart(channel) { return ircOut("PART " + channel); }
export function ircMessage(channel, message) { return ircOut(`PRIVMSG ${channel} :${message}`); }

export const actions = {
	ircOut,
	ircPing,
	ircNick,
	ircPass,
	ircJoin,
	ircPart,
	ircPong
}

import { Observable } from 'rxjs';
import { utils, actions } from './lib'
export function channelMonitor(action$) {
	if(!process.env.TWITCH_CHANNEL) {
		throw "TWITCH_CHANNEL env undefined";
	}
	return utils.channelJoin(action$, process.env.TWITCH_CHANNEL, (message$) => {
		return message$
			.do((a) => console.log("Message:", a))
			.filter((a) => a.message[0] === "!tinggoes")
			.map((a) => actions.channelMsg("and te ting goes SKKKKKKRAT"))
			.startWith(actions.channelMsg("hi"));
	})
}

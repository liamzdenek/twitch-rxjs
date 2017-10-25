import { createTwitch, combineEpics, epics } from './lib';

const options = {
	path: "wss://irc-ws.chat.twitch.tv:443/irc",
};

const statusLoggerEpic = (action$) => {
	return action$.ofType("STATUS")
		.do((a) => console.log(a.status))
		.ignoreElements();
};

const rootEpic = combineEpics(
	statusLoggerEpic,
	epics.loggingEpic,
);

const twitch$ = createTwitch(options, rootEpic);

twitch$.subscribe((e) => {});

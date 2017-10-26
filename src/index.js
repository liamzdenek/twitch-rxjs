import { createTwitch, combineEpics, epics } from './lib';

const options = {
	path: "wss://irc-ws.chat.twitch.tv:443/irc",
};

const statusLoggerEpic = (action$) => {
	return action$.ofType("STATUS")
		.do((a) => console.log(a.status))
		.ignoreElements();
};

console.log("Epics: ", epics);
//console.log("ENV: ", process.env);

const rootEpic = combineEpics(
	statusLoggerEpic,
	epics.authEpic(process.env.TWITCH_USER_NAME, process.env.TWITCH_USER_OAUTH),
	epics.loggingEpic(),
);

const twitch$ = createTwitch(options, rootEpic);

twitch$.subscribe((e) => {});

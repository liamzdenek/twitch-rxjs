import { ActionsObservable as Base } from 'redux-observable';
import { filter } from 'rxjs/operator/filter';

export default class ActionsObservable extends Base {
	ofTwitchType(...keys) {
		const len = keys.length;
		return this.ofType("@twitch/IN")::filter(({ command }) => {
			if(len === 1) {
				return command === keys[0];
			} else {
				for (let i = 0; i < len; i++) {
					if (keys[i] === command) {
						return true;
					}
				}
			}
		})
	}
}

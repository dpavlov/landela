export const LOAD_CONFIG = 'config/load';
export const CONFIG_LOADED = 'config/loaded';

export function loadConfig() {
	return {
		type: LOAD_CONFIG
	};
}

export function configLoaded(config) {
	return {
		type: CONFIG_LOADED,
		payload: config
	};
}

export const reducer = (state = {}, action) => {
	switch(action.type) {
		case CONFIG_LOADED:
			return { ... state, state: 'Done', config: action.payload };
		break;
		default:
			return state;
		break;
	}
};

export const LOAD_ICONS = 'icons/load';
export const ICONS_LOADED = 'icons/loaded';

export function loadIcons(iconTypes) {
	return {
		type: LOAD_ICONS,
		payload: iconTypes
	};
}

export function iconsLoaded(icons) {
	return {
		type: ICONS_LOADED,
		payload: icons
	};
}

export const reducer = (state = {}, action) => {
	console.log(action);
	switch(action.type) {
		case ICONS_LOADED:
			return { ... state, state: 'Done', icons: action.payload };
		break;
		default:
			return state;
		break;
	}
};

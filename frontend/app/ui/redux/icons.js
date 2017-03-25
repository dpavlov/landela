export const LOAD_ICONS = 'icons/load';
export const ICONS_LOADED = 'icons/loaded';

export function loadIcons(nodeTypes) {
	return {
		type: LOAD_ICONS,
		payload: nodeTypes
	};
}

export function iconsLoaded(icons) {
	return {
		type: ICONS_LOADED,
		payload: icons
	};
}

export const reducer = (state = {}, action) => {
	switch(action.type) {
		case ICONS_LOADED:
			return { ... state, state: 'Done', icons: action.payload };
		break;
		default:
			return state;
		break;
	}
};

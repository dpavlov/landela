export const MAP_UPDATED = 'map/updated';

export function updateMap(event) {
	return {
    payload: event,
		type: MAP_UPDATED
	};
}

let initState = { };

export const reducer = (state = initState, action) => {
	switch(action.type) {
		case MAP_UPDATED:
			return { ... state, events: [...(state.events || []), action.payload] };
		break;
		default:
			return state;
		break;
	}
};

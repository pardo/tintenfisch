const initialState = {
    //'1': { id: 1, color: 'yellow', land: 2 },
}


function units (state = initialState, action) {
    switch (action.type) {
        case "ADD_UNIT":
            let nUnit = {};
            nUnit[action.id] = {
                id: action.id,
                color: action.color,
                land: action.land
            }
            return Object.assign({}, state, nUnit)
        default:
            return state
    }
}

export default units
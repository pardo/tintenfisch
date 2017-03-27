var Map = require('immutable').Map

const initialState = Map()
// '1': { id: 1, color: 'yellow', land: 2 },

function units (state = initialState, action) {
  switch (action.type) {
    case 'ADD_UNIT':
      return state.set(action.id, Map({
        'id': action.id,
        'color': action.color,
        'land': action.land
      }))
    case 'MOVE_UNIT':
      console.log(action)
      return state.setIn([action.id, 'land'], action.land)
    default:
      return state
  }
}

module.exports = units

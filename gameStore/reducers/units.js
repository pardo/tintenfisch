var Map = require('immutable').Map

const initialState = Map()
// '1': { id: 1, color: 'yellow', land: 2 },

function units (state = initialState, action) {
  switch (action.type) {
    case 'ADD_UNIT':
      return state.set(action.id, Map({
        'id': action.id,
        'color': action.color,
        'land': action.land,
        'life': 100
      }))
    case 'MOVE_UNIT':
      return state.setIn([action.id, 'land'], action.land)
    case 'ATTACK_UNIT':
      return state.setIn([action.toUnit, 'life'], life => life - action.power)
    default:
      return state
  }
}

module.exports = units

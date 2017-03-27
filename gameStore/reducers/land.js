var Map = require('immutable').Map

const initialStateLand = Map()
//    '1': { id: '1', color: 'red', position: { x: 0, y: 1 }, links: [ '2', '1'] }

function land (state = initialStateLand, action) {
  switch (action.type) {
    case 'ADD_LAND':
      return state.set(action.id, Map({
        'id': action.id,
        'color': action.color,
        'position': Map({
          'x': action.position.x,
          'y': action.position.y
        }),
        'landType': action.landType,
        'links': Map(action.links)
      }))
    case 'ADD_LINK':
      return state.updateIn([action.id1, 'links'], links => {
        return links.add(action.id2)
      })
    case 'CHANGE_COLOR_LAND':
      return state.setIn([action.id, 'color'], action.color)
    default:
      return state
  }
}

module.exports = land

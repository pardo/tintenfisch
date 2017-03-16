import { combineReducers } from 'redux'
import { List } from 'immutable'

const initialStateLand = {
//    '1': { id: 1, color: 'red', position: { x: 10, y: 10 } },
}
const initialStateLinks = List()
//    [1,2],

function land(state = initialStateLand, action) {
    switch (action.type) {
        case "ADD_LAND":
            let nLand = {}
            nLand[action.id] = {
                id: action.id,
                color: action.color,
                position: {
                    x: action.position.x,
                    y: action.position.y
                }
            }
            return Object.assign({}, state, nLand)
        default:
            return state
    }
}


function links(state = initialStateLinks, action) {
    switch (action.type) {
        case "ADD_LINK":
            return state.push([action.id1, action.id2])
        default:
            return state
    }
}


const landReducer = combineReducers({
  "land": land,
  "links": links
})

export default landReducer;
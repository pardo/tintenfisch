import { createStore } from 'redux'
import reducer from './reducers'
import { addLand } from './actions/land'
import { addUnit, moveUnit } from './actions/units'
// import { render } from './d3Render'
import * as _ from 'lodash'
import render from './babylonRender'

let store = createStore(reducer)

store.subscribe(_.debounce(function () {
//  render(store, store.getState())
  render(store, store.getState())
}, 200))

var size = 3 * 6
for (var y = 0; y < size; y++) {
  for (var x = 0; x < size / 3; x++) {
    let links = y % 2 === 0 ? {
      '0': x + '#' + (y + 2),
      '1': x + '#' + (y + 1),
      '2': x + '#' + (y - 1),
      '3': x + '#' + (y - 2),
      '4': (x - 1) + '#' + (y - 1),
      '5': (x - 1) + '#' + (y + 1)
    } : {
      '0': x + '#' + (y + 2),
      '1': (x + 1) + '#' + (y + 1),
      '2': (x + 1) + '#' + (y - 1),
      '3': x + '#' + (y - 2),
      '4': x + '#' + (y - 1),
      '5': x + '#' + (y + 1)
    }

    let ltype, color
    if (Math.random() > 0.5) {
      ltype = 'tree'
      color = '#008000'
    } else {
      ltype = 'dirt'
      color = '#615428'
    }

    store.dispatch(addLand(
            x + '#' + y,
            color,
            { 'x': x, 'y': y },
            ltype,
            links
        ))
  }
}

setTimeout(() => store.dispatch(addUnit(2, 'yellow', '1#1')), 500 * 3)
setTimeout(() => store.dispatch(addUnit(1, 'cyan', '2#3')), 500 * 4)
setTimeout(() => store.dispatch(moveUnit(2, '2#6')), 500 * 5)
setTimeout(() => store.dispatch(moveUnit(2, '2#4')), 500 * 6)

// store.getState().map.get("0#0")

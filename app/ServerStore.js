import io from 'socket.io-client'
import { createStore, applyMiddleware } from 'redux'
import reducer from '../gameStore/reducers'
import { fromJS } from 'immutable'
var socket = io.connect(window.location.href)

var actionCount = 0
var syncing = false
var actionCache = []

requestSync()

function mainReducer (state = {}, action) {
  if (action.type === 'store.sync') {
    actionCount = action.actionCount
    return {
      map: fromJS(action.store.map),
      units: fromJS(action.store.units)
    }
  } else {
    return reducer(state, action)
  }
}

const store = createStore(mainReducer)

socket.on('store.dispatch', function (data) {
  // console.log('Received Action', action)
  // {
    // action: action,
    // actionCount: actionCount
  // }
  if (syncing) { return }
  if (actionCount !== data.actionCount) {
    // out of sync with server
    requestSync()
  } else {
    store.dispatch(data.action)
    actionCount += 1
  }
})

function requestSync () {
  syncing = true
  socket.emit('store.sync')
}

socket.on('store.sync', function (action) {
  // console.log('Received Action', action syncing)
  store.dispatch(action)
  syncing = false
})

store.dispatchClient = function (action) {
  socket.emit('store.dispatch', action)
}

window.reset = function () {
  socket.emit('store.reset')
}
export { store, socket }

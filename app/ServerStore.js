import io from 'socket.io-client'

var socket = io.connect(window.location.href)

import { createStore } from 'redux'
import reducer from '../gameStore/reducers'

let store = createStore(
  reducer
)

socket.on('store.dispatch', function (action) {
  console.log('Received Action', action)
  store.dispatch(action)
})

store.dispatchClient = function (action) {
  socket.emit('store.dispatch', action)
}

export { store, socket }

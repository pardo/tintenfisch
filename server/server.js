var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var path = require('path')
var redux = require('redux')
var applyMiddleware = redux.applyMiddleware
var createStore = redux.createStore
var reducer = require('../gameStore/reducers')
var landActions = require('../gameStore/actions/land')
var unitsActions = require('../gameStore/actions/units')
var seedrandom = require('seedrandom')
server.listen(8000)


var actionCount = 0
const logger = function (store) {
  return next => action => {
    console.info('dispatching', action.type, actionCount)
    actionCount += 1
    let result = next(action)
    return result
  }
}

var store = createStore(
  reducer,
  applyMiddleware(logger)
)
startBuild()

app.use(express.static(path.join(__dirname, '..', 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

io.on('connection', function (socket) {
  socket.on('store.dispatch', function (action) {
    // should validate somehow
    storeDispatch(action)
  })
  socket.on('store.sync', function () {
    socket.emit('store.sync', {
      actionCount: actionCount,
      type: 'store.sync',
      store: store.getState()
    })
  })
  socket.on('store.reset', function () {
    store = createStore(
      reducer,
      applyMiddleware(logger)
    )
    startBuild()
  })
})


function storeDispatch (action) {
  io.emit('store.dispatch', {
    action: action,
    actionCount: actionCount
  })
  store.dispatch(action)
}

function getIdForPosition (x, y) {
  if (y === undefined) {
    y = x.y
    x = x.x
  }
  return x + '#' + y
}

function startBuild () {
  var rng = seedrandom('map-seed')
  var size = 3 * 6
  for (var y = 0; y < size; y++) {
    for (var x = 0; x < size / 3; x++) {
      let links = y % 2 === 0 ? {
        '0': getIdForPosition(x, y + 2),
        '1': getIdForPosition(x, y + 1),
        '2': getIdForPosition(x, y - 1),
        '3': getIdForPosition(x, y - 2),
        '4': getIdForPosition(x - 1, y - 1),
        '5': getIdForPosition(x - 1, y + 1)
      } : {
        '0': getIdForPosition(x, (y + 2)),
        '1': getIdForPosition((x + 1), (y + 1)),
        '2': getIdForPosition((x + 1), (y - 1)),
        '3': getIdForPosition(x, (y - 2)),
        '4': getIdForPosition(x, (y - 1)),
        '5': getIdForPosition(x, (y + 1))
      }

      let ltype, color
      if (rng() > 0.6) {
        ltype = 'tree'
        color = '#008000'
      } else {
        ltype = 'dirt'
        color = '#615428'
      }

      storeDispatch(
        landActions.addLand(
          getIdForPosition(x, y),
          color,
          { 'x': x, 'y': y },
          ltype,
          links
        )
      )
    }
  }

  setTimeout(() => storeDispatch(unitsActions.addUnit('2', '#ffff00', '1#1')), 500 * 3)
  setTimeout(() => storeDispatch(unitsActions.addUnit('1', '#00ffff', '1#8')), 500 * 4)
  setTimeout(() => storeDispatch(unitsActions.moveUnit('2', '2#6')), 500 * 5)
  setTimeout(() => storeDispatch(unitsActions.moveUnit('2', '2#4')), 500 * 6)
}

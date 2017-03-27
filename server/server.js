var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var path = require('path')
var redux = require('redux')
var createStore = redux.createStore
var reducer = require('../gameStore/reducers')
var landActions = require('../gameStore/actions/land')
var unitsActions = require('../gameStore/actions/units')

server.listen(8000)

var store = createStore(
  reducer
)

app.use(express.static(path.join(__dirname, '..', 'build')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'))
})

io.on('connection', function (socket) {
  socket.on('store.dispatch', function (action) {
    // should validate somehow
    storeDispatch(action)
  })
  store = createStore(reducer)
  startBuild()
})


function storeDispatch (action) {
  io.emit('store.dispatch', action)
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
      if (Math.random() > 0.5) {
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

  setTimeout(() => storeDispatch(unitsActions.addUnit(2, '#ffff00', '1#1')), 500 * 3)
  setTimeout(() => storeDispatch(unitsActions.addUnit(1, '#00ffff', '2#3')), 500 * 4)
  setTimeout(() => storeDispatch(unitsActions.moveUnit(2, '2#6')), 500 * 5)
  setTimeout(() => storeDispatch(unitsActions.moveUnit(2, '2#4')), 500 * 6)
}

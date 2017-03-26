import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import { addLand } from './actions/land'
import { addUnit, moveUnit } from './actions/units'
import { Set } from 'immutable'
// import { render } from './d3Render'
import * as _ from 'lodash'
import $ from 'jquery'
import FlatCore from './flatten/core'
import BABYLON from 'babylonjs/babylon.max'
import { HexGround, HexMarker, TreeGround, UnitBase } from './flatten/entities'
import ClientCore from './ClientCore'

let store = createStore(
  reducer
)

store.subscribe(_.debounce(function () {
//  render(store, store.getState())
  render(store, store.getState())
}, 200))

function getIdForPosition (x, y) {
  if (y === undefined) {
    y = x.y
    x = x.x
  }
  return x + '#' + y
}

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

    store.dispatch(
      addLand(
        getIdForPosition(x, y),
        color,
        { 'x': x, 'y': y },
        ltype,
        links
      )
    )
  }
}

setTimeout(() => store.dispatch(addUnit(2, '#ffff00', '1#1')), 500 * 3)
setTimeout(() => store.dispatch(addUnit(1, '#00ffff', '2#3')), 500 * 4)
setTimeout(() => store.dispatch(moveUnit(2, '2#6')), 500 * 5)
setTimeout(() => store.dispatch(moveUnit(2, '2#4')), 500 * 6)

// store.getState().map.get("0#0")



var $output = $('#output')
var core = new FlatCore($output)
var clientCore = new ClientCore(store)
var renderedLand = {}
var renderedUnits = {}
var renderedMarkers = {}
var positionMarkersSet = Set()

function convertPosition (position) {
  return {
    x: position.y % 2 === 0 ? position.x * 1.35 : (position.x * 1.35) + 0.675,
    y: position.y * 0.389711
  }
}

function render (store, state, clientState) {
  state.map.forEach(function (land) {
    land = land.toJS()
    if (renderedLand[land.id]) { return }
    let position = convertPosition(land.position)
    var hg = new HexGround(
      core.scene,
      new BABYLON.Vector3(
        position.x, 0, position.y
      )
    )
    hg.init()
    hg.metadata = land
    hg.color = land.color

    renderedLand[land.id] = hg

    var marker = new HexMarker(
      core.scene,
      new BABYLON.Vector3(
        position.x, 0, position.y
      )
    )
    marker.init()
    marker.color = '#ff0000'
    marker.metadata = land
    marker.hide()
    renderedMarkers[land.id] = marker
    positionMarkersSet = positionMarkersSet.add(land.id)
  })

  state.units.forEach(function (unit) {
    unit = unit.toJS()
    let position = convertPosition(
      state.map.getIn([unit.land, 'position']).toJS()
    )
    var unit3d = renderedUnits[unit.id]
    if (!unit3d) {
      unit3d = new UnitBase(
        core.scene,
        new BABYLON.Vector3(
          position.x, 0, position.y
        )
      )
      unit3d.init()
      unit3d.color = unit.color
    }
    unit3d.position = new BABYLON.Vector3(
      position.x, 0, position.y
    )
    renderedUnits[unit.id] = unit3d
  })
}

$output.on('click', function () {
  let pickResult = core.scene.pick(
    core.scene.pointerX,
    core.scene.pointerY
  )
  if (pickResult.hit) {
    let pickedPoint = pickResult.pickedPoint.clone()
    let mesh = pickResult.pickedMesh
    console.log(pickedPoint)
    while (mesh.parent) {
      mesh = mesh.parent
    }
    if (mesh.metadata) {
      // let position = convertPosition(mesh.metadata.position)
      // let land = store.getState().map.get(
        // getIdForPosition(mesh.metadata.position)
      // )
      clientCore.clickPosition(getIdForPosition(mesh.metadata.position))
      updateClientRender()
    }
  }
})

function updateClientRender () {
  if (clientCore.availableToMoveTo.length > 0) {
    var hidePositions = positionMarkersSet.subtract(
      Set(clientCore.availableToMoveTo)
    )
    hidePositions.forEach(function (landID) {
      renderedMarkers[landID].hide()
    })
    clientCore.availableToMoveTo.forEach(function (landID) {
      renderedMarkers[landID].show()
    })
  } else {
    positionMarkersSet.forEach(function (landID) {
      renderedMarkers[landID].hide()
    })
  }
}

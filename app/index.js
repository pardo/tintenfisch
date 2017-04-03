import { Set } from 'immutable'
// import { render } from './d3Render'
import * as _ from 'lodash'
import $ from 'jquery'
import FlatCore from './flatten/core'
import BABYLON from 'babylonjs/babylon.max'
import { HexGround, HexMarker, TreeGround, UnitBase } from './flatten/entities'
import ClientCore from './ClientCore'
import { store } from './ServerStore'
import dat from 'dat.gui/build/dat.gui'

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
    var hg = renderedLand[land.id]
    let position = convertPosition(land.position)
    if (!hg) {
      hg = new HexGround(
        core.scene,
        new BABYLON.Vector3(
          position.x, 0, position.y
        )
      )
      hg.init()
      hg.metadata = land
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
    }
    hg.color = land.color
    renderedLand[land.id] = hg
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


var gui = new dat.GUI()
var lightFolder = gui.addFolder('Light Direction')
lightFolder.add(core.light.direction, 'x', null, { min: -10, max: 10, step: 0.1 })
lightFolder.add(core.light.direction, 'y', { min: -10, max: 10, step: 0.1 })
lightFolder.add(core.light.direction, 'z', { min: -10, max: 10, step: 0.1 })


var cameraFolder = gui.addFolder('Camera')
cameraFolder.add(core.camera.camera.position, 'x', -100, 100).listen()
cameraFolder.add(core.camera.camera.position, 'y', -100, 100).listen()
cameraFolder.add(core.camera.camera.position, 'z', -100, 100).listen()
cameraFolder.add(core.camera.camera.position, 'z', -100, 100).listen()
cameraFolder.add(core.camera, 'distance', -100, 100).listen()

import $ from 'jquery'
import FlatCore from './flatten/core'
import BABYLON from 'babylonjs/babylon.max'
import { HexGround, HexMarker } from './flatten/entities'

var $output = $('#output')
var core = new FlatCore($output)

var rendered = {}

function convertPosition (position) {
  return {
    x: position.y % 2 === 0 ? position.x * 1.35 : (position.x * 1.35) + 0.675,
    y: position.y * 0.389711
  }
}

var position = {x: 2, y: 3}
position = convertPosition(position)
var hexMarker = new HexMarker(core.scene, new BABYLON.Vector3(position.x, 0, position.y))
hexMarker.init()
hexMarker.color = '#ff0000'

function render (store, state) {
  state.map.forEach(function (land) {
    land = land.toJS()
    if (rendered[land.id]) { return }
    rendered[land.id] = true
    let position = convertPosition(land.position)
    var hg = new HexGround(core.scene, new BABYLON.Vector3(position.x, 0, position.y))
    hg.init()
    hg.metadata = land
    hg.color = land.color
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
    position = convertPosition(mesh.metadata.position)
    hexMarker.position.x = position.x
    hexMarker.position.z = position.y
  }
})

export default render

import BABYLON from 'babylonjs/babylon.max'
import { MeshGroup } from './objects'

class LoaderEntity extends MeshGroup {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
    this.folder = 'should/be/a/valid/path/'
    this.file = 'filename.obj'
  }

  callback (meshes) {
    this.addMeshes(meshes)
    meshes.map(function (d) {
      d.receiveShadows = true
      this.scene.addToShadows(d)
    })
  }

  init () {
    super.init.call(this)
    BABYLON.SceneLoader.ImportMesh(null, this.folder, this.file, this.scene, this.callback.bind(this))
  }
}

class TreeGround extends LoaderEntity {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
    this.folder = 'assets/trees/'
    this.file = 'trees.obj'
  }
}

class HexGround extends MeshGroup {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
  }

  // find a way to avoid load multiple times
  static loadMesh (scene, callback) {
    BABYLON.SceneLoader.ImportMesh(null, 'assets/ground/', 'ground.obj', scene, callback)
  }

  init () {
    super.init.call(this)
    var hg = this
    this.castShadows = false
    this.material = new BABYLON.StandardMaterial(null, this.scene)
    HexGround.loadMesh(this.scene, function (meshes) {
      hg.addMeshes(meshes)
      meshes.map(function (d) {
        d.material = hg.material
        d.receiveShadows = true
        // hg.scene.addToShadows(d)
      })
    })
  }

  set color (hexColor) {
    this.material.diffuseColor = BABYLON.Color3.FromHexString(hexColor)
  }

  get color () {
    return this.material.diffuseColor.toHexString()
  }
}

class HexMarker extends MeshGroup {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
  }

  // find a way to avoid load multiple times
  static loadMesh (scene, callback) {
    BABYLON.SceneLoader.ImportMesh(null, 'assets/marker/', 'marker.obj', scene, callback)
  }

  init () {
    super.init.call(this)
    var hg = this
    this.material = new BABYLON.StandardMaterial(null, this.scene)
    HexMarker.loadMesh(this.scene, function (meshes) {
      hg.addMeshes(meshes)
      meshes.map(function (d) {
        d.material = hg.material
        d.receiveShadows = true
        hg.scene.addToShadows(d)
      })
    })
  }

  set color (hexColor) {
    this.material.diffuseColor = BABYLON.Color3.FromHexString(hexColor)
  }

  get color () {
    return this.material.diffuseColor.toHexString()
  }
}

export { HexGround, HexMarker, TreeGround }

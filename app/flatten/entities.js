import BABYLON from 'babylonjs/babylon.max'
import { MeshGroup } from './objects'


var loaderCache = {}
function loadMesh (folder, file, scene) {
  if (!loaderCache[ folder + file ]) {
    loaderCache[ folder + file ] = new Promise(function (resolve, reject) {
      BABYLON.SceneLoader.ImportMesh(null, folder, file, scene, function (meshes) {
        meshes.map(m => m.setEnabled(0))
        resolve(meshes)
      })
    })
  }
  return loaderCache[ folder + file ]
}


class LoaderEntity extends MeshGroup {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
    this.folder = 'should/be/a/valid/path/'
    this.file = 'filename.obj'
  }

  addToShadows (mesh) {
    mesh.receiveShadows = true
    this.scene.addToShadows(mesh)
    mesh.getChildMeshes().map(mesh => { this.addToShadows(mesh) })
  }

  callback (meshes) {
    this.addMeshes(meshes)
    meshes.map(function (mesh) {
      this.addToShadows(mesh)
    }.bind(this))
  }

  init () {
    super.init.call(this)
    var callback = this.callback.bind(this)
    loadMesh(this.folder, this.file, this.scene).then(function (meshes) {
      callback(meshes.map(m => m.clone()))
    })
  }
}

class TreeGround extends LoaderEntity {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
    this.folder = 'assets/trees/'
    this.file = 'trees.obj'
  }
}

class UnitBase extends LoaderEntity {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
    this.folder = 'assets/unit/'
    this.file = 'unit.obj'
  }

  init () {
    this.material = new BABYLON.StandardMaterial(null, this.scene)
    super.init.call(this)
  }

  callback (meshes) {
    this.addMeshes(meshes)
    meshes.map(function (mesh) {
      mesh.material = this.material
      this.addToShadows(mesh)
    }.bind(this))
  }

  set color (hexColor) {
    this.material.diffuseColor = BABYLON.Color3.FromHexString(hexColor)
  }

  get color () {
    return this.material.diffuseColor.toHexString()
  }
}

class HexGround extends MeshGroup {
  constructor (scene, position) {
    super(scene, position, BABYLON.Vector3.Zero())
  }

  init () {
    super.init.call(this)
    var hg = this
    this.castShadows = false
    this.material = new BABYLON.StandardMaterial(null, this.scene)
    loadMesh('assets/ground/', 'ground.obj', this.scene).then(function (meshes) {
      meshes = meshes.map(m => m.clone())
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

  init () {
    super.init.call(this)
    var hg = this
    this.material = new BABYLON.StandardMaterial(null, this.scene)
    loadMesh('assets/marker/', 'marker.obj', this.scene).then(function (meshes) {
      meshes = meshes.map(m => m.clone())
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

export { HexGround, HexMarker, TreeGround, UnitBase }

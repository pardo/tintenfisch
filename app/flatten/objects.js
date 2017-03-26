import BABYLON from 'babylonjs/babylon.max'

class Object3d {
  constructor (scene, position, rotation) {
    this.scene = scene
    this._position = position
    this._rotation = rotation
  }

  init () {
  }

  removeFromScene () {
    this._removeFromScene(this.mesh)
  }

  _removeFromScene (mesh) {
    this.scene.removeMesh(mesh)
    this.scene.removeFromShadows(mesh)
    let meshes = mesh.getChildMeshes()
    for (let i = 0; i < meshes.length; i++) {
      this._removeFromScene(meshes[i])
    }
  }

  set castShadows (value) {
    if (value) {
      this.scene.addToShadows(this.mesh)
    } else {
      this.scene.removeFromShadows(this.mesh)
    }
  }

  get castShadows () {
    return this.scene.castShadows(this.mesh)
  }

  set receiveShadows (value) {
    this.mesh.receiveShadows = value
  }

  get metadata () {
    return this.mesh.metadata
  }

  set metadata (value) {
    this.mesh.metadata = value
  }

  get receiveShadows () {
    return this.mesh.receiveShadows
  }

  set position (val) {
    this.mesh.position = val
  }
  get position () {
    return this.mesh.position
  }
  set rotation (val) {
    this.mesh.rotation = val
  }
  get rotation () {
    return this.mesh.rotation
  }
  set scaling (val) {
    this.mesh.scaling = val
  }
  get scaling () {
    return this.mesh.scaling
  }
  hide () {
    this.mesh.setEnabled(0)
  }
  show () {
    this.mesh.setEnabled(1)
  }
  set name (val) {
    this.mesh.name = val
  }
  get name () {
    return this.mesh.name
  }
}

class ObjectHolder extends Object3d {
  constructor (scene, mesh) {
    super(scene, mesh.position, mesh.rotation)
    this.mesh = mesh
  }
}

class MeshGroup extends Object3d {
  constructor (scene, position, rotation) {
    super(scene, position, rotation)
    this.objects = []
  }

  init () {
    this.mesh = new BABYLON.Mesh('', this.scene)
    this.mesh.position = this._position
    this.mesh.rotation = this._rotation
  }

  addMeshes (objs) {
    for (let i = 0; i < objs.length; i++) {
      this.addMesh(objs[i])
    }
  }

  addMesh (obj) {
    this.objects.push(obj)
    obj.parent = this.mesh
  }
}

class ObjectsGroup extends Object3d {
  constructor (scene, position, rotation) {
    super(scene, position, rotation)
    this.objects = []
  }

  init () {
    this.mesh = new BABYLON.Mesh('', this.scene)
    this.mesh.position = this._position
    this.mesh.rotation = this._rotation
  }

  addObjects (objs) {
    for (let i = 0; i < objs.length; i++) {
      this.addObject(objs[i])
    }
  }

  addObject (obj) {
    this.objects.push(obj)
    obj.mesh.parent = this.mesh
  }
}

class Points2d extends Object3d {
  constructor (scene, position, rotation, points) {
    super(scene, position, rotation)
        // points Vector2d
    this._points = points
  }

  init () {
    this.mesh = new BABYLON.Mesh.CreateLines(null, this.getPoints(), this.scene)
    this.mesh.position = this._position
    this.mesh.rotation = this._rotation
  }

  getPoints () {
    return this._points.map(function (point) {
      return new BABYLON.Vector3(point.x, point.y, 0)
    })
  }

  set color (value) {
    this.mesh.color = value
  }

  get color () {
    return this.mesh.color
  }
}

export { Object3d, Points2d, ObjectsGroup, ObjectHolder, MeshGroup }

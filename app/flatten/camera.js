import BABYLON from 'babylonjs/babylon.max'
import keyboardJS from 'keyboardjs'

class Camera {
  constructor (scene, engine) {
    this.camera = null
    this.scene = null
    this.orthoDist = null
    this.positionTargetOffset = new BABYLON.Vector3(-10, 8, -10)
    this.engine = null

    this.scene = scene
    this.engine = engine
    this.camera = new BABYLON.TargetCamera('camera1', new BABYLON.Vector3(-10, 8, -10), scene)
    this.camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA
        // this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(-10, 10,-10), scene);

    this.distance = 5
    this.cameraSpeed = 0.5

        // target the camera to scene origin
    this.camera.setTarget(BABYLON.Vector3.Zero())

    window.addEventListener('resize', function () {
      this.engine.resize()
      this.resize()
    }.bind(this))

    keyboardJS.bind(',', function (e) {
      this.distance = this.distance + (this.distance * 0.05)
    }.bind(this))

    keyboardJS.bind('.', function (e) {
      this.distance = this.distance - (this.distance * 0.05)
    }.bind(this))

    keyboardJS.bind('left', function (e) {
      this.camera.position.x -= this.cameraSpeed
    }.bind(this))

    keyboardJS.bind('right', function (e) {
      this.camera.position.x += this.cameraSpeed
    }.bind(this))

    keyboardJS.bind('up', function (e) {
      this.camera.position.z += this.cameraSpeed
    }.bind(this))

    keyboardJS.bind('down', function (e) {
      this.camera.position.z -= this.cameraSpeed
    }.bind(this))
  }

  get distance () {
    return this.orthoDist
  }

  set distance (distance) {
    this.orthoDist = distance
    this.resize()
  }

  resize () {
    // return
    let width = this.engine.getRenderWidth()
    let height = this.engine.getRenderHeight()
    // var factor = camera.orthoDist/Math.max(width, height);
    let factor = this.orthoDist / height
    this.camera.orthoTop = height * factor
    this.camera.orthoBottom = -height * factor
    this.camera.orthoLeft = -width * factor
    this.camera.orthoRight = width * factor
  }

  setTarget (position) {
    position.y = 0
    let positionTargetOffset = this.positionTargetOffset.add(position)
    positionTargetOffset.y = this.positionTargetOffset.y
    this.camera.position = positionTargetOffset
    this.camera.setTarget(position)
  }
}

export default Camera

import BABYLON from 'babylonjs/babylon.max'
import Camera from './camera'
import './babylon.objFileLoader.js'

class FlatCore {
  constructor ($container) {
    this.$container = null
    this.$canvas = null
    this.engine = null

    this.shadowGenerator = null
    this.scene = null
    this.state = null

    this.$container = $container
    this.initEngine()
    this.createScene()
    this.bindDomActions()
    this.engine.runRenderLoop(this.renderLoop.bind(this))
  }

  initEngine () {
    this.$canvas = this.$container.find('#renderCanvas')
    this.engine = new BABYLON.Engine(this.$canvas[0], true)
  }

  bindDomActions () {
  }

  createScene () {
        // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine)

    this.loader = new BABYLON.AssetsManager(this.scene)

    let light = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(1, -1, -0.5), this.scene)
        // let light = new BABYLON.PointLight("dir01", new BABYLON.Vector3(0, 3, 0), this.scene);
        // let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(1, -4, -0.5), scene);

    this.shadowGenerator = new BABYLON.ShadowGenerator(2048, light)
    this.shadowGenerator.bias = 0.000001
    this.scene.shadowGenerator = this.shadowGenerator

    this.scene.castShadows = function (mesh) {
      let meshes = this.shadowGenerator.getShadowMap().renderList
      let index = meshes.indexOf(mesh)
      return index !== -1
    }

    this.scene.addToShadows = function (mesh) {
      if (!this.castShadows(mesh)) {
        this.shadowGenerator.getShadowMap().renderList.push(mesh)
      }
    }

    this.scene.removeFromShadows = function (toRemove) {
      let meshes = this.shadowGenerator.getShadowMap().renderList
      let index = meshes.indexOf(toRemove)
      if (index !== -1) { meshes.splice(index, 1) }
    }

    this.camera = new Camera(this.scene, this.engine)

    let ambientLight = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(1, -4, -0.5),
        this.scene
    )

    ambientLight.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5)

    // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
    // this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 8, 0.5, this.scene);

    // return the created scene
    // var ssao = new BABYLON.SSAORenderingPipeline("ssao", scene, 0.5);
    // scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camera);
  }

  renderLoop () {
    // if (direction.x != 0 || direction.y != 0 || direction.z != 0 ) {
    //    character.animate();
    // }

    // var pickResult = this.scene.pick(
    //    this.mousePosition.x,
    //    this.mousePosition.y,
    //    function (mesh) {
    //        return mesh.name== "ground";
    //    }
    // );
    // if ( pickResult.hit ) {
    //     this.mousePosition.pickedPoint = pickResult.pickedPoint.clone();
    //     this.sphere.position = pickResult.pickedPoint;
    // }
    // character.rotation.g = Math.PI/2 + H.angleBetweenTwoPoints(
    //        character.position.x,
    //        -character.position.z,
    //        this.mousePosition.pickedPoint.x,
    //        -this.mousePosition.pickedPoint.z
    //    );
    // }
    this.preRender()
    this.scene.render()
    this.postRender()
  }
  preRender () {
  }
  postRender () {
  }
}

export default FlatCore

import * as _ from 'lodash';
import './style.scss'
import { Color3, Quaternion, Vector3, ArcRotateCamera, Engine, SceneLoader, MeshBuilder, StandardMaterial, CubeTexture, Texture, Mesh, AbstractMesh } from 'babylonjs'

const canvas : HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

let theInputSource;
let triggerComponent;
let squeezeComponent;
const theModels : any[] = [];
const theMotionControllers : any[] = []

// here the doc for Load function: //doc.babylonjs.com/api/classes/babylon.sceneloader#load
SceneLoader.Load("", "3D_model/export/scene.babylon", engine, async (scene) => {
  // scene.debugLayer.show();

  // as this .babylon example hasn't camera in it, we have to create one
  const camera = new ArcRotateCamera("Camera", 1, 1, 4, Vector3.Zero(), scene);
  camera.attachControl(canvas, false);

  // skybox
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture("3D_model/textures/cubemap/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  const torusKnot = MeshBuilder.CreateTorusKnot("tk", {}, scene);
  const scaleFactor = 0.04;
  torusKnot.scaling = new Vector3(scaleFactor, scaleFactor, scaleFactor);
  const myMaterial = new StandardMaterial("myMaterial", scene);

  myMaterial.diffuseColor = new Color3(1, 0, 1);
  torusKnot.material = myMaterial;


  // scene.clearColor = new BABYLON.Color3(1, 1, 1);
  // scene.ambientColor = new BABYLON.Color3.White;
  scene.createDefaultEnvironment();

  const ground : any = scene.getMeshByName("Ground");
  const xRParameters = ground ? { floorMeshes : [ground] } : {};
  const xrHelper = await scene.createDefaultXRExperienceAsync(xRParameters);

  if (!xrHelper.baseExperience) {
    // tslint:disable-next-line: no-console
    console.log(":(")
  } else {
    // all good, ready to go
    console.log(":)")
    // Managing controllers buttons
    xrHelper.input.onControllerAddedObservable.add((inputSource) => {
      console.log(inputSource)
      theInputSource = inputSource;
      inputSource.onMotionControllerInitObservable.add((motionController) => {
        theMotionControllers.push(motionController)
        motionController.onModelLoadedObservable.add((model) => {
          theModels.push(model);
          const ids = motionController.getComponentIds();
          console.log(ids)

          triggerComponent = motionController.getComponent("xr-standard-trigger");
          if (triggerComponent) {
            // found, do something with it.
            console.log("found trigger :)")
          }

          squeezeComponent = motionController.getComponent("xr-standard-squeeze");
          if (squeezeComponent) {
            // found, do something with it.
            console.log("found squeeze :)")
          }
        });
      });
    });
  }

  let counter = 0;
  let handMesh;
  let triggerPressed = false;
  engine.runRenderLoop(() => {
    scene.render();
    counter++;

    // if (counter % 10 === 0) {
    // console.log("trigger : " + triggerComponent.value)
    // console.log("squeeze : " + squeezeComponent.value)
    // console.log(theModels)
    // console.log(theMotionControllers)
    if (theInputSource && theInputSource.motionController) {
      handMesh = theInputSource.motionController.rootMesh;
      if (triggerComponent) {

        if (triggerComponent.value > 0.5 && triggerPressed === false) {
          triggerPressed = true;
        } else if (triggerComponent.value < 0.5 && triggerPressed === true) {
          triggerPressed = false;
        }

        if (handMesh && torusKnot.intersectsMesh(handMesh) && torusKnot.material) {
          torusKnot.material.diffuseColor = new Color3(0, 1, 0)
          if (triggerPressed) // trigger click
          {
            // console.log(triggerComponent.value)
            // console.log(theInputSource._tmpQuaternion)
            // console.log(theInputSource._tmpVector)
            console.log("trigger intrersect")
            // torus_knot.rotationQuaternion = theInputSource._tmpQuaternion
            torusKnot.parent = handMesh
            torusKnot.position = Vector3.Zero()
          }
          else {
            const newPos = new Vector3(torusKnot.absolutePosition.x, torusKnot.absolutePosition.y, torusKnot.absolutePosition.z);
            const newRot = new Quaternion()
            newRot.copyFrom(torusKnot.absoluteRotationQuaternion);
            console.log("nexPos")
            console.log(newPos)
            console.log("newRot")
            console.log(newRot)
            torusKnot.parent = null;
            torusKnot.setAbsolutePosition(newPos);
            torusKnot.absoluteRotationQuaternion.copyFrom(newRot);
          }
          // console.log("torus position")
          // console.log(torus_knot.position)
          // console.log("torus rotation")
          // console.log(torus_knot.absoluteRotationQuaternion)

        } else if(torusKnot.material) {
          torusKnot.material.diffuseColor = new Color3(0, 0, 1)
        }


      }
      // console.log("ray : ")
      // console.log(theInputSource.inputSource.targetRaySpace)
      // console.log("grip :")
      // console.log(theInputSource.inputSource.gripSpace)
      // const resultRay = new Ray();

      // get the pointer direction
      // theInputSource.getWorldPointerRayToRef(resultRay);
      // // get the grip direction, if available. If not, the pointer:
      // // theInputSource.getWorldPointerRayToRef(resultRay, true);
      // console.log(resultRay)
      // console.log("le ray")
    }
    //  }

  });

  // window.addEventListener("resize", () => {
  //   engine.resize();
  // });
});
import * as _ from 'lodash';
import './style.scss'
import { Color3, Quaternion, Vector3, ArcRotateCamera, Engine, SceneLoader, MeshBuilder, StandardMaterial, CubeTexture, Texture, Mesh, AbstractMesh } from 'babylonjs'
import { PlayerManager } from './player-manager/player-manager';
import { subscribeToTriggerSqueezeEvent } from './player-manager/input-event-bus';
import { makeGrabbable } from './interactions/grabbable';

const canvas : HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

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

  scene.createDefaultEnvironment();
  const ground : any = scene.getMeshByName("Ground");
  const xRParameters = ground ? { floorMeshes : [ground] } : {};
  const xrHelper = await scene.createDefaultXRExperienceAsync(xRParameters);

  let playerManager : PlayerManager;

  // Trying to set playerManager
  if (!xrHelper.baseExperience) {
    // tslint:disable-next-line: no-console
    console.log(":(")
  } else {
    // all good, ready to go
    playerManager  = PlayerManager.getInstance();
    playerManager.init(xrHelper,scene)

    subscribeToTriggerSqueezeEvent(
      (event) => {
        console.log("trigger :)")
      }
    )
  }

  let counter = 0;
  engine.runRenderLoop(() => {
    scene.render();
    counter++;

    if (xrHelper.baseExperience) {
        // playerManager.update()
        makeGrabbable(torusKnot, scene)
    }
  });

  // window.addEventListener("resize", () => {
  //   engine.resize();
  // });
});
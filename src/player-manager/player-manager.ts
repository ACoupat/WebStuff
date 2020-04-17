import { Scene, WebXRDefaultExperience, AnimatedInputBlockTypes, WebXRInputSource, ActionManager, ExecuteCodeAction } from "babylonjs";
import { broadcastTriggerSqueezeEvent } from "./input-event-bus";
import { get } from "lodash";
import { Subject } from "rxjs";

export const $handMeshesEventBus : Subject<any> = new Subject();

export class PlayerManager {

    private static instance: PlayerManager;

    private xrHelper: WebXRDefaultExperience = null as any;

    private rightHand: WebXRInputSource = null as any;
    private leftHand: WebXRInputSource = null as any;

    public init(xrHelper: WebXRDefaultExperience, scene: Scene){
        this.xrHelper = xrHelper;

        xrHelper.input.onControllerRemovedObservable.add((inputSource) => {
            if (inputSource.inputSource.handedness === "left") {
                this.leftHand = null as any;
            }

            if (inputSource.inputSource.handedness === "right") {
                this.rightHand = null as any;
            }
        })

        xrHelper.input.onControllerAddedObservable.add((inputSource) => {

            console.log(inputSource)
            if (inputSource.inputSource.handedness === "left") {
                this.leftHand = inputSource;
                console.log("left hand ok")
            }

            if (inputSource.inputSource.handedness === "right") {
                this.rightHand = inputSource;
                console.log("right hand ok")
            }

            inputSource.onMotionControllerInitObservable.add((motionController) => {
                console.log(motionController)

                const componentsIds: string[] = motionController.getComponentIds();
                componentsIds.map(componentId => {

                    const component = motionController.getComponent(componentId);

                    component.onButtonStateChangedObservable.add((componentEvent) => {
                        if (componentId === "xr-standard-trigger" || componentId === "xr-standard-squeeze") {
                            broadcastTriggerSqueezeEvent(componentEvent)
                        }
                    });

                    component.onAxisValueChangedObservable.add((values) => {
                        // console.log(values.x, values.y);
                    })
                })

                motionController.onModelLoadedObservable.add(
                    eventData => {
                        if (eventData.rootMesh) {
                            $handMeshesEventBus.next(eventData.rootMesh)
                        }
                    }
                )

            })
        });
    }

    public subscribeToHandMeshes(callback){
        $handMeshesEventBus.subscribe(callback)
    }

    public static getInstance() {
        return this.instance || new PlayerManager();
    }

    public get rightHandMesh() {
        return get(this.rightHand, 'motionController.rootMesh')
    }
    public get leftHandMesh() {
        return get(this.leftHand, 'motionController.rootMesh')
    }

    public update() {

        // Reduce log quantity
        let counter = 0;
        if (counter % 100 === 0) {
            // console.log((this.leftHand ? "L - " : "") + (this.rightHand ? "R" : ""))
        }


    }

}
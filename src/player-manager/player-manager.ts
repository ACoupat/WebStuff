import { Scene, WebXRDefaultExperience, AnimatedInputBlockTypes, WebXRInputSource } from "babylonjs";

export class PlayerManager {

    private static instance: PlayerManager;

    private xrHelper: WebXRDefaultExperience = null as any;

    private rightHand: WebXRInputSource = null as any;
    private leftHand: WebXRInputSource = null as any;

    private constructor(xrHelper: WebXRDefaultExperience) {
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

                const componentsIds : string[] = motionController.getComponentIds();
                componentsIds.map(componentId => {

                    const component = motionController.getComponent(componentId);

                    component.onButtonStateChangedObservable.add((componentEvent) => {
                        // something changed, check the changes object
                        console.log(componentEvent)
                    });

                    component.onAxisValueChangedObservable.add((values) => {
                        console.log(values.x, values.y);
                    })
                })

            })

            // inputSource.onMotionControllerInitObservable.add((motionController) => {
            //     motionController.onModelLoadedObservable.add((model) => {
            //         //     theModels.push(model);
            //         //     const ids = motionController.getComponentIds();
            //         //     console.log(ids)

            //         //     triggerComponent = motionController.getComponent("xr-standard-trigger");
            //         //     if (triggerComponent) {
            //         //       // found, do something with it.
            //         //       console.log("found trigger :)")
            //         //     }

            //         //     squeezeComponent = motionController.getComponent("xr-standard-squeeze");
            //         //     if (squeezeComponent) {
            //         //       // found, do something with it.
            //         //       console.log("found squeeze :)")
            //         //     }
            //     });
            // });
        });



    }

    public static getInstance(xrHelper: WebXRDefaultExperience) {
        return this.instance || new PlayerManager(xrHelper)
    }

    public update() {

        // Reduce log quantity
        let counter = 0;
        if (counter % 100 === 0) {
            // console.log((this.leftHand ? "L - " : "") + (this.rightHand ? "R" : ""))
        }


    }

}
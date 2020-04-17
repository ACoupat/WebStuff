import { AbstractMesh, ActionManager, ExecuteCodeAction } from "babylonjs"
import { subscribeToTriggerSqueezeEvent } from "../player-manager/input-event-bus"
import { PlayerManager, $handMeshesEventBus } from "../player-manager/player-manager"

// tslint:disable-next-line: no-unused-expression
export const makeGrabbable = (mesh: AbstractMesh, scene) => {

    PlayerManager.getInstance().subscribeToHandMeshes(
        (handMesh) => {
            // Right Hand collision enter
            addIntersectionEvent(
                mesh,
                handMesh,
                scene,
                ActionManager.OnIntersectionEnterTrigger,
                () => {
                    console.log("Hand enter")
                })

            addIntersectionEvent(
                mesh,
                handMesh,
                scene,
                ActionManager.OnIntersectionExitTrigger,
                () => {
                    console.log("Hand Exit")
                })
        }
    )
}

const addIntersectionEvent = (mesh1, mesh2, scene, eventType, callback) => {
    if (!mesh1.actionManager) {
        mesh1.actionManager = new ActionManager(scene);
    }

    mesh1.actionManager.registerAction(new ExecuteCodeAction(
        {
            trigger: eventType,
            parameter: {
                mesh: mesh2
            }
        },
        callback
    ))
}
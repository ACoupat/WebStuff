import { AbstractMesh, ActionManager, ExecuteCodeAction, Mesh, Vector3 } from "babylonjs"
import { subscribeToSqueezeEvent } from "../player-manager/input-event-bus"
import { PlayerManager, $handMeshesEventBus } from "../player-manager/player-manager"


export class GrabbableObject {

    private mesh: Mesh;

    private isHoveredByHand: boolean = false;
    private currentHoveringHand: Mesh = null as any;
    private isGrabbed: boolean = false;
    private currentGrabbingHandedness = null as any;

    public constructor(mesh: Mesh, scene) {
        this.mesh = mesh
        this.makeGrabbable(mesh, scene)
    }

    private makeGrabbable(mesh: AbstractMesh, scene) {
        PlayerManager.getInstance().subscribeToHandMeshes(
            (handMesh) => {
                // Right Hand collision enter
                this.addIntersectionEvent(
                    mesh,
                    handMesh,
                    scene,
                    ActionManager.OnIntersectionEnterTrigger,
                    () => {
                        this.isHoveredByHand = true;
                        this.currentHoveringHand = handMesh;
                    })

                this.addIntersectionEvent(
                    mesh,
                    handMesh,
                    scene,
                    ActionManager.OnIntersectionExitTrigger,
                    () => {
                        this.isHoveredByHand = false;
                        this.currentHoveringHand = null as any;
                    })
            }
        )

        subscribeToSqueezeEvent(
            event => {
                if (this.isGrabbed) {
                    if (event.handedness === this.currentGrabbingHandedness && event.componentData.value <= 0) {
                        this.unparentFromHand()
                        this.currentGrabbingHandedness = null;
                    }
                } else {
                    if (this.currentHoveringHandedness === event.handedness &&
                        event.componentData.value > 0 && this.isHoveredByHand) {
                        this.currentGrabbingHandedness = event.handedness;
                        this.parentToHand()
                    }
                }
            }
        )
    }

    private get currentHoveringHandedness(){
        return PlayerManager.getInstance().getHandedness(this.currentHoveringHand)
    }

    private parentToHand() {
        this.mesh.parent = this.currentHoveringHand;
        this.mesh.position = Vector3.Zero()
        this.isGrabbed = true;
    }

    private unparentFromHand() {
        const newPos: Vector3 = this.mesh.absolutePosition.clone();
        const newRot = this.mesh.absoluteRotationQuaternion
        this.mesh.parent = null;
        this.mesh.setAbsolutePosition(newPos);
        this.mesh.rotationQuaternion = newRot;
        this.isGrabbed = false;
    }

    private addIntersectionEvent(mesh1, mesh2, scene, eventType, callback) {
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

}


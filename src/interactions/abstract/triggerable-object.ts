import { GrabbableObject } from '../grabbable-object'
import { subscribeToTriggerEvent, XRInputEvent } from '../../player-manager/input-event-bus'
import { Mesh, Scene } from 'babylonjs'

export abstract class TriggerableObject extends GrabbableObject {
    constructor(mesh : Mesh, scene : Scene) {
        super(mesh, scene)
        subscribeToTriggerEvent(
            event => {
                if(this.isGrabbed && event.handedness === this.currentGrabbingHandedness){
                    this.onTriggerEvent(event, scene)
                }
            }
        )
    }


    protected abstract onTriggerEvent(triggerValue : XRInputEvent, scene);
}
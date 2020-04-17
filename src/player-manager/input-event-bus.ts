import { Subject } from "rxjs"
import { filter } from "rxjs/operators"
import { WebXRControllerComponent } from "babylonjs";

interface XRInputEvent{
    componentData : WebXRControllerComponent
    handedness : XRHandedness
}

const $inputTriggerSqueezeEventBus = new Subject<XRInputEvent>();

export const broadcastInputEvent = (event : XRInputEvent) =>  {
    $inputTriggerSqueezeEventBus.next(event)
}

export const subscribeToSqueezeEvent = (callback : (event : XRInputEvent) => any ) => {
    $inputTriggerSqueezeEventBus
    .pipe(filter(
        value => {
            return value.componentData.id === "xr-standard-squeeze"
        }
    ))
    .subscribe(callback)
}
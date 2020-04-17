import { Subject } from "rxjs"

const $inputTriggerSqueezeEventBus = new Subject<any>();

export const broadcastTriggerSqueezeEvent = (event) =>  {
    $inputTriggerSqueezeEventBus.next(event)
}

export const subscribeToTriggerSqueezeEvent = (callback) => {
    $inputTriggerSqueezeEventBus.subscribe(callback)
}
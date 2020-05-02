import { TriggerableObject } from "./abstract/triggerable-object";
import { MeshBuilder, Vector3, Axis, Quaternion, Animation } from "babylonjs";
import { XRInputEvent } from "../player-manager/input-event-bus";

export class Gun extends TriggerableObject {

    constructor(scene) {
        const boxGun = MeshBuilder.CreateBox("boxGun", { width: 1, height: 1, depth: 6 })
        super(boxGun, scene)
        boxGun.scalingDeterminant = 0.04;
        boxGun.position = Vector3.Zero()
    }

    protected onTriggerEvent(event: XRInputEvent, scene) {
        if (event.componentData.value === 1) {
            // Instantiating bullet
            const bullet = MeshBuilder.CreateSphere("sphere", { diameter: 0.04, diameterX: 0.06 }, scene);
            bullet.setAbsolutePosition(this.mesh.absolutePosition)
            bullet.translate(this.mesh.forward.negate(), 1)
            const startPos :Vector3 = bullet.absolutePosition.clone();
            const xSlide = new Animation("xSlide", "position", 10, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
            const keyFrames: any[] = []
            keyFrames.push({
                frame: 0,
                value: startPos
            })

            keyFrames.push({
                frame: 2,
                value: startPos.add(this.mesh.forward.negate().multiplyByFloats(10,10,10))
            })
            xSlide.setKeys(keyFrames)
            scene.beginDirectAnimation(bullet, [xSlide], 0, 2, true);
        }
    }

    onGrabStart() {
        this.mesh.rotationQuaternion = null; // needed for rotate to work
        this.mesh.rotate(Vector3.Right(), -Math.PI / 4 - Math.PI / 12)
    }

    public set position(position: Vector3) {
        this.mesh.position = position
    }

}
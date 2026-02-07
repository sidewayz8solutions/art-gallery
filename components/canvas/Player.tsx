"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

const SPEED = 3;
const PLAYER_HEIGHT = 1.6;

/* Bounds matching the long marble hall (20 wide × 100 long) */
const ROOM_HALF_W = 9.0;
const ROOM_HALF_D = 48.0;

export default function Player() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const velocity = useRef(new THREE.Vector3());
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  /* Keyboard listeners */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  /* Movement loop */
  useFrame((_, delta) => {
    const direction = new THREE.Vector3();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys.current.forward) direction.add(forward);
    if (keys.current.backward) direction.sub(forward);
    if (keys.current.right) direction.add(right);
    if (keys.current.left) direction.sub(right);

    if (direction.length() > 0) {
      direction.normalize();
      velocity.current.lerp(direction.multiplyScalar(SPEED), 0.15);
    } else {
      velocity.current.lerp(new THREE.Vector3(0, 0, 0), 0.2);
    }

    camera.position.add(velocity.current.clone().multiplyScalar(delta));

    /* Clamp inside room bounds */
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      -ROOM_HALF_W,
      ROOM_HALF_W
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      -ROOM_HALF_D,
      ROOM_HALF_D
    );
    camera.position.y = PLAYER_HEIGHT;
  });

  return <PointerLockControls ref={controlsRef} />;
}

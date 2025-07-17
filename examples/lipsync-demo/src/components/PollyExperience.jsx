import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { PollyAvatar } from "./PollyAvatar";

export const PollyExperience = ({ viseme }) => {
  const controls = useRef();

  useEffect(() => {
    controls.current.setLookAt(0, 1.6, 2.5, 0, 1.5, 0);
  }, []);

  return (
    <>
      <CameraControls ref={controls} />
      <directionalLight position={[1, 0.5, -3]} intensity={2} color="blue" />
      <directionalLight position={[-1, 0.5, -2]} intensity={2} color="red" />
      <directionalLight position={[1, 1, 3]} intensity={2} />
      <PollyAvatar viseme={viseme} />
    </>
  );
};

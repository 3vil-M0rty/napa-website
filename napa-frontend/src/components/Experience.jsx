import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";

export const Experience = () => {
  return (
    <>
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={0.3}
        speed={0.2}
        rotationIntensity={0.1}
      >
        <Book />
      </Float>
      <OrbitControls
        enableRotate={false}
        enablePan={false}
        enableZoom={true}
      />
      <Environment preset="studio" />

      {/* Strong key light from upper right */}
      <directionalLight
        position={[2, 5, 2]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Fill light from the left so text side isn't in shadow */}
      <directionalLight position={[-3, 2, 3]} intensity={0.5} />

      {/* Soft ambient so no face is fully dark */}
      <ambientLight intensity={1.2} />

      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.1} />
      </mesh>
    </>
  );
};
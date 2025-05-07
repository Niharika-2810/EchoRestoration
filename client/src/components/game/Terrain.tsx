import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function Terrain() {
  // Load base terrain texture
  const baseTexture = useTexture("/textures/grass.png");
  
  // Repeat the texture to cover the entire terrain
  baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
  baseTexture.repeat.set(8, 8);
  
  return (
    <mesh 
      receiveShadow 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.5, 0]}
    >
      <planeGeometry args={[100, 100, 32, 32]} />
      <meshStandardMaterial 
        map={baseTexture}
        color="#8bc34a"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

export default Terrain;

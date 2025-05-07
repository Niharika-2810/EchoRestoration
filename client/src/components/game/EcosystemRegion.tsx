import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture, Text } from "@react-three/drei";
import { Region, Plant, Animal, WaterSource, Structure } from "../../lib/eco/types";
import { getEcosystemColor, getEcosystemTexture, getHealthStatus } from "../../lib/eco/ecosystemData";
import Plant3D from "./entities/Plant";
import Animal3D from "./entities/Animal";
import Water from "./entities/Water";
import TechStructure from "./entities/TechStructure";

interface EcosystemRegionProps {
  region: Region;
  isSelected: boolean;
  onClick: () => void;
}

function EcosystemRegion({ region, isSelected, onClick }: EcosystemRegionProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hoverRef = useRef(false);
  
  // Load ecosystem-specific texture
  const texture = useTexture(getEcosystemTexture(region.type));
  
  // Repeat the texture to cover the region
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(region.size.width / 2, region.size.height / 2);
  
  // Get color based on ecosystem type
  const baseColor = getEcosystemColor(region.type);
  
  // Calculate health color modifier - healthier regions are more vibrant
  const healthStatus = getHealthStatus(region.health);
  
  // Modify color based on health status
  const colorModifier = useMemo(() => {
    switch (healthStatus) {
      case 'critical':
        return new THREE.Color(baseColor).lerp(new THREE.Color('#8d6e63'), 0.7); // Brown tint
      case 'poor':
        return new THREE.Color(baseColor).lerp(new THREE.Color('#8d6e63'), 0.4); // Less brown
      case 'recovering':
        return new THREE.Color(baseColor).lerp(new THREE.Color('#d1c4e9'), 0.2); // Slight purple tint
      case 'stable':
        return new THREE.Color(baseColor); // Original color
      case 'thriving':
        return new THREE.Color(baseColor).lerp(new THREE.Color('#81c784'), 0.3); // Green tint
      default:
        return new THREE.Color(baseColor);
    }
  }, [baseColor, healthStatus]);
  
  // Generate a simplified fog effect for pollution
  const fogIntensity = region.pollutionLevel / 100;
  
  // Animate hover effect
  useFrame(() => {
    if (!meshRef.current) return;
    
    if (isSelected) {
      // Raise selected region slightly above terrain
      meshRef.current.position.y = 0.15;
    } else if (hoverRef.current) {
      // Slight raise on hover
      meshRef.current.position.y = 0.1;
    } else {
      // Normal position
      meshRef.current.position.y = 0;
    }
  });
  
  return (
    <group position={[region.position.x, 0, region.position.z]}>
      {/* Base ecosystem region */}
      <mesh 
        ref={meshRef}
        receiveShadow
        castShadow
        onClick={onClick}
        onPointerOver={() => { hoverRef.current = true; }}
        onPointerOut={() => { hoverRef.current = false; }}
      >
        <boxGeometry args={[region.size.width, 0.5, region.size.height]} />
        <meshStandardMaterial
          map={texture}
          color={colorModifier}
          transparent={true}
          opacity={isSelected ? 0.95 : 0.85} // More visible when selected
        />
      </mesh>
      
      {/* Pollution fog effect */}
      {fogIntensity > 0.2 && (
        <mesh position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[region.size.width, region.size.height]} />
          <meshBasicMaterial 
            color="#5d4037" 
            transparent={true} 
            opacity={fogIntensity * 0.4}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Region outline (when selected) */}
      {isSelected && (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[region.size.width + 0.2, 0.1, region.size.height + 0.2]} />
          <meshBasicMaterial color="#ffeb3b" wireframe={true} />
        </mesh>
      )}
      
      {/* Render plants */}
      {region.plants.map((plant) => (
        <Plant3D key={plant.id} plant={plant} regionType={region.type} />
      ))}
      
      {/* Render animals */}
      {region.animals.map((animal) => (
        <Animal3D key={animal.id} animal={animal} regionType={region.type} />
      ))}
      
      {/* Render water sources */}
      {region.waterSources.map((water) => (
        <Water key={water.id} water={water} regionType={region.type} />
      ))}
      
      {/* Render structures */}
      {region.structures.map((structure) => (
        <TechStructure key={structure.id} structure={structure} />
      ))}
      
      {/* Display region name above */}
      {isSelected && (
        <Text
          position={[0, 4, 0]}
          color="#ffffff"
          fontSize={1}
          anchorX="center"
          anchorY="middle"
        >
          {region.name}
        </Text>
      )}
    </group>
  );
}

export default EcosystemRegion;

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EcosystemType, WaterSource } from "../../../lib/eco/types";

interface WaterProps {
  water: WaterSource;
  regionType: EcosystemType;
}

function Water({ water, regionType }: WaterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const time = useRef(0);
  
  // Water characteristics based on type and region
  const waterDetails = useMemo(() => {
    // Base properties
    let size = water.size * 2; // Base size multiplier
    let depth = 0.2; // Water depth
    let color = new THREE.Color("#2196f3"); // Default blue
    let opacity = 0.8;
    let flowSpeed = water.flow / 100; // 0-1 based on flow rate
    
    // Adjust based on water type and region
    switch (water.type) {
      case "river":
        size = water.size * 5; // Rivers are longer
        depth = 0.3;
        color = new THREE.Color("#1e88e5"); // Medium blue
        flowSpeed = water.flow / 60; // Rivers flow faster
        break;
      case "lake":
        size = water.size * 4; // Lakes are wider
        depth = 0.5;
        color = new THREE.Color("#0d47a1"); // Darker blue
        flowSpeed = water.flow / 200; // Lakes flow slower
        break;
      case "pond":
        size = water.size * 2.5;
        depth = 0.3;
        color = new THREE.Color("#4fc3f7"); // Light blue
        flowSpeed = water.flow / 150;
        break;
      case "irrigation":
        size = water.size * 3;
        depth = 0.2;
        color = new THREE.Color("#03a9f4"); // Bright blue
        flowSpeed = water.flow / 80;
        break;
      default:
        // Default water
        size = water.size * 2;
        color = new THREE.Color("#2196f3"); // Blue
    }
    
    // Adjust color based on water quality
    if (water.quality < 50) {
      // Mix with brown/gray for poor quality water
      color.lerp(new THREE.Color("#607d8b"), (50 - water.quality) / 50);
      opacity = 0.6 + (water.quality / 100) * 0.3; // Reduce transparency for dirty water
    }
    
    // Adjust for ecosystem
    if (regionType === 'desert') {
      // Desert water is more transparent and lighter colored due to sun
      color.lerp(new THREE.Color("#b3e5fc"), 0.3);
      depth *= 0.7; // Shallower
    } else if (regionType === 'wetland') {
      // Wetland water has more organic matter
      color.lerp(new THREE.Color("#259b24"), 0.2);
      depth *= 1.2; // Deeper
    }
    
    return { size, depth, color, opacity, flowSpeed };
  }, [water.type, water.size, water.flow, water.quality, regionType]);
  
  // Water animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Update time reference for waves
    time.current = state.clock.getElapsedTime();
    
    // Simple wave animation based on sine waves
    const vertices = (meshRef.current.geometry as THREE.BufferGeometry).attributes.position;
    const initialPositions = (meshRef.current.userData.initialPositions || []) as number[];
    
    // Store initial positions if not already stored
    if (!meshRef.current.userData.initialPositions) {
      const positions = [];
      for (let i = 0; i < vertices.count; i++) {
        positions.push(vertices.getY(i));
      }
      meshRef.current.userData.initialPositions = positions;
    }
    
    // Animate water surface
    for (let i = 0; i < vertices.count; i++) {
      const initialY = initialPositions[i];
      const x = vertices.getX(i);
      const z = vertices.getZ(i);
      
      // Create waves with different frequencies based on position
      const wave1 = Math.sin(x * 0.5 + time.current * waterDetails.flowSpeed) * 0.1;
      const wave2 = Math.cos(z * 0.3 + time.current * waterDetails.flowSpeed * 0.8) * 0.1;
      
      // Apply waves to surface
      vertices.setY(i, initialY + wave1 + wave2);
    }
    
    vertices.needsUpdate = true;
  });
  
  // Render appropriate water shape based on type
  const renderWaterGeometry = () => {
    const segments = Math.max(12, Math.floor(waterDetails.size * 4)); // Higher resolution for larger water bodies
    
    switch (water.type) {
      case "river":
        // Rivers are elongated
        return (
          <planeGeometry 
            args={[waterDetails.size, waterDetails.size / 3, segments, segments / 3]} 
            ref={(geometry) => {
              if (geometry) {
                // Add some random variation to make the river course more natural
                const positions = geometry.attributes.position;
                for (let i = 0; i < positions.count; i++) {
                  const x = positions.getX(i);
                  const z = positions.getZ(i);
                  positions.setX(i, x + (Math.random() * 0.3 - 0.15));
                  positions.setZ(i, z + (Math.random() * 0.3 - 0.15));
                }
                positions.needsUpdate = true;
              }
            }}
          />
        );
      case "lake":
        // Lakes are more circular
        return (
          <circleGeometry args={[waterDetails.size / 2, segments]} />
        );
      case "pond":
        // Ponds are small and irregular
        return (
          <circleGeometry 
            args={[waterDetails.size / 2, segments]} 
            ref={(geometry) => {
              if (geometry) {
                // Make the pond shape more irregular
                const positions = geometry.attributes.position;
                for (let i = 0; i < positions.count; i++) {
                  const x = positions.getX(i);
                  const z = positions.getZ(i);
                  const distFromCenter = Math.sqrt(x * x + z * z);
                  if (distFromCenter > 0.1) { // Don't distort the very center
                    const angle = Math.atan2(z, x);
                    const randomDist = 1 + (Math.random() * 0.3 - 0.15);
                    positions.setX(i, Math.cos(angle) * distFromCenter * randomDist);
                    positions.setZ(i, Math.sin(angle) * distFromCenter * randomDist);
                  }
                }
                positions.needsUpdate = true;
              }
            }}
          />
        );
      case "irrigation":
        // Irrigation channels are structured and grid-like
        return (
          <boxGeometry args={[waterDetails.size, waterDetails.depth, waterDetails.size / 4]} />
        );
      default:
        // Default water body is a simple plane
        return (
          <planeGeometry args={[waterDetails.size, waterDetails.size, segments, segments]} />
        );
    }
  };
  
  return (
    <group position={[water.position.x, 0.05, water.position.z]}>
      {/* Water surface */}
      <mesh 
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        {renderWaterGeometry()}
        <meshStandardMaterial 
          color={waterDetails.color}
          transparent={true}
          opacity={waterDetails.opacity}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {/* Water bed (slightly darker than the water) */}
      <mesh 
        position={[0, -waterDetails.depth / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {renderWaterGeometry()}
        <meshStandardMaterial 
          color={waterDetails.color.clone().multiplyScalar(0.5)} // Darker bed
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

export default Water;

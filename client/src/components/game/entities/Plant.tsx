import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EcosystemType, Plant } from "../../../lib/eco/types";

interface PlantProps {
  plant: Plant;
  regionType: EcosystemType;
}

function Plant3D({ plant, regionType }: PlantProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Plant characteristics based on ecosystem type and species
  const plantDetails = useMemo(() => {
    // Base properties
    let height = 0.5;
    let width = 0.3;
    let segments = 8;
    let color = new THREE.Color("#4caf50"); // Default green
    let shape = "box"; // Default shape
    
    // Adjust based on plant species and region
    switch (plant.species) {
      case "Emergent Tree":
        height = 3 * (plant.maturity / 100);
        width = 0.5;
        shape = "cylinder";
        color = new THREE.Color("#2e7d32"); // Dark green
        break;
      case "Canopy Tree":
        height = 2.5 * (plant.maturity / 100);
        width = 0.4;
        shape = "cylinder";
        color = new THREE.Color("#388e3c"); // Medium green
        break;
      case "Understory Plant":
        height = 1 * (plant.maturity / 100);
        width = 0.3;
        shape = "sphere";
        color = new THREE.Color("#66bb6a"); // Light green
        break;
      case "Saguaro Cactus":
        height = 2.2 * (plant.maturity / 100);
        width = 0.3;
        shape = "cylinder";
        color = new THREE.Color("#8bc34a"); // Light green
        break;
      case "Desert Shrub":
        height = 0.8 * (plant.maturity / 100);
        width = 0.6;
        shape = "sphere";
        color = new THREE.Color("#cddc39"); // Lime
        break;
      case "Desert Succulent":
        height = 0.5 * (plant.maturity / 100);
        width = 0.4;
        shape = "sphere";
        color = new THREE.Color("#aed581"); // Light lime
        break;
      case "Cattail Reeds":
        height = 1.5 * (plant.maturity / 100);
        width = 0.2;
        shape = "cylinder";
        color = new THREE.Color("#827717"); // Dark olive
        break;
      case "Mangrove Tree":
        height = 2.8 * (plant.maturity / 100);
        width = 0.5;
        shape = "cylinder";
        color = new THREE.Color("#33691e"); // Dark green
        break;
      case "Water Lilies":
        height = 0.2 * (plant.maturity / 100);
        width = 0.8;
        shape = "disk";
        color = new THREE.Color("#7cb342"); // Olive green
        break;
      default:
        // For any other plants
        height = 1 * (plant.maturity / 100);
        color = new THREE.Color("#43a047"); // Green
    }
    
    // Adjust color based on plant health
    if (plant.health < 50) {
      // Mix with brown for unhealthy plants
      color.lerp(new THREE.Color("#795548"), (50 - plant.health) / 50);
    }
    
    return { height, width, segments, color, shape };
  }, [plant.species, plant.maturity, plant.health, regionType]);
  
  // Small random sway for plants
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Only apply swaying to taller plants
    if (plantDetails.height > 1) {
      // Gentle swaying using sine wave with unique frequency per plant
      const offset = plant.id.charCodeAt(0) / 100; // Use character code from ID for uniqueness
      const sway = Math.sin(state.clock.elapsedTime + offset) * 0.02;
      
      meshRef.current.rotation.x = sway / 2;
      meshRef.current.rotation.z = sway;
    }
  });
  
  // Render appropriate geometry based on plant shape
  const renderPlantGeometry = () => {
    switch (plantDetails.shape) {
      case "cylinder":
        return (
          <>
            {/* Tree trunk */}
            <cylinderGeometry args={[plantDetails.width/4, plantDetails.width/3, plantDetails.height, plantDetails.segments]} />
            {/* Foliage */}
            <mesh position={[0, plantDetails.height/2 + plantDetails.height/5, 0]}>
              <sphereGeometry args={[plantDetails.width * 1.5, plantDetails.segments, plantDetails.segments]} />
              <meshStandardMaterial 
                color={plantDetails.color} 
                roughness={0.8}
              />
            </mesh>
          </>
        );
      case "sphere":
        return (
          <sphereGeometry args={[plantDetails.width, plantDetails.segments, plantDetails.segments]} />
        );
      case "disk":
        return (
          <cylinderGeometry args={[plantDetails.width, plantDetails.width, plantDetails.height/5, plantDetails.segments]} />
        );
      default:
        return (
          <boxGeometry args={[plantDetails.width, plantDetails.height, plantDetails.width]} />
        );
    }
  };
  
  return (
    <group position={[plant.position.x, plant.position.y, plant.position.z]}>
      <mesh 
        ref={meshRef}
        castShadow
        receiveShadow
        position={[0, plantDetails.height / 2, 0]}
      >
        {renderPlantGeometry()}
        <meshStandardMaterial 
          color={plantDetails.color}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

export default Plant3D;

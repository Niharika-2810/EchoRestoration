import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EcosystemType, Animal } from "../../../lib/eco/types";

interface AnimalProps {
  animal: Animal;
  regionType: EcosystemType;
}

function Animal3D({ animal, regionType }: AnimalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a persistent random offset for each animal
  const [randomOffset] = useState({
    movement: Math.random() * 10,
    rotation: Math.random() * Math.PI * 2,
    scale: 0.8 + Math.random() * 0.4, // Scale between 0.8 and 1.2
  });
  
  // Movement state
  const [moveTarget] = useState(new THREE.Vector3(
    animal.position.x + (Math.random() * 4 - 2),
    0,
    animal.position.z + (Math.random() * 4 - 2)
  ));
  
  // Animal characteristics based on species and region
  const animalDetails = useMemo(() => {
    // Default properties
    let size = 0.5;
    let color = new THREE.Color("#795548"); // Default brown
    let shape = "box"; // Default shape
    let speed = 0.02;
    let herdSize = 1; // Number of instances to show
    let height = 0.5; // Height above ground
    
    // Adjust based on animal species and region
    switch (animal.species) {
      case "Capuchin Monkey":
        size = 0.4;
        color = new THREE.Color("#5d4037"); // Dark brown
        shape = "primate";
        speed = 0.04;
        height = 2; // In trees
        break;
      case "Toucan":
        size = 0.3;
        color = new THREE.Color("#212121"); // Black body
        shape = "bird";
        speed = 0.06;
        height = 1.5; // Flying low
        break;
      case "Leaf-cutter Ant":
        size = 0.1;
        color = new THREE.Color("#f44336"); // Reddish
        shape = "insect";
        speed = 0.015;
        herdSize = 5; // Show multiple
        break;
      case "Desert Lizard":
        size = 0.25;
        color = new THREE.Color("#b2afaa"); // Sandy color
        shape = "reptile";
        speed = 0.03;
        break;
      case "Desert Fox":
        size = 0.4;
        color = new THREE.Color("#d7ccc8"); // Light brown
        shape = "mammal";
        speed = 0.05;
        break;
      case "Desert Scorpion":
        size = 0.2;
        color = new THREE.Color("#3e2723"); // Dark brown
        shape = "insect";
        speed = 0.02;
        break;
      case "Marsh Frog":
        size = 0.2;
        color = new THREE.Color("#4caf50"); // Green
        shape = "amphibian";
        speed = 0.04;
        break;
      case "Heron":
        size = 0.6;
        color = new THREE.Color("#b0bec5"); // Gray-blue
        shape = "bird";
        speed = 0.03;
        height = 0.8; // Wading
        break;
      case "Marsh Fish":
        size = 0.25;
        color = new THREE.Color("#29b6f6"); // Blue
        shape = "fish";
        speed = 0.04;
        height = 0.1; // Almost at water level
        herdSize = 3; // Show multiple
        break;
      default:
        // For any other animals
        size = 0.3;
        color = new THREE.Color("#795548"); // Brown
    }
    
    // Adjust size based on population (larger populations have more individuals)
    herdSize = Math.min(Math.ceil(animal.population / 20), 5);
    
    return { size, color, shape, speed, herdSize, height };
  }, [animal.species, animal.population, regionType]);
  
  // Animal movement logic
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Only animate if the animal is healthy enough
    if (animal.health > 30) {
      const time = state.clock.getElapsedTime() + randomOffset.movement;
      
      // Calculate movement based on a wandering pattern
      const xPos = animal.position.x + Math.sin(time * animalDetails.speed) * 2;
      const zPos = animal.position.z + Math.cos(time * animalDetails.speed * 0.7) * 2;
      
      // Update position
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        xPos,
        0.01
      );
      
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        zPos,
        0.01
      );
      
      // Update rotation to face direction of movement
      const targetRotation = Math.atan2(
        groupRef.current.position.x - animal.position.x,
        groupRef.current.position.z - animal.position.z
      );
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation,
        0.05
      );
      
      // Slight bobbing for walking/swimming
      if (animalDetails.shape === "fish") {
        // Swimming motion
        groupRef.current.rotation.x = Math.sin(time * 5) * 0.1;
      } else if (animalDetails.shape === "bird") {
        // Slight vertical movement for birds
        groupRef.current.position.y = animalDetails.height + Math.sin(time * 2) * 0.2;
      }
    }
  });
  
  // Generate a basic animal shape based on type
  const renderAnimalShape = () => {
    switch (animalDetails.shape) {
      case "primate":
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[animalDetails.size, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Head */}
            <mesh position={[0, animalDetails.size * 1.2, 0]}>
              <sphereGeometry args={[animalDetails.size * 0.6, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Limbs */}
            <mesh position={[animalDetails.size * 0.6, -animalDetails.size * 0.5, 0]}>
              <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 1.2, animalDetails.size * 0.2]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            <mesh position={[-animalDetails.size * 0.6, -animalDetails.size * 0.5, 0]}>
              <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 1.2, animalDetails.size * 0.2]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
          </group>
        );
      case "bird":
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[animalDetails.size, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Head */}
            <mesh position={[0, animalDetails.size * 0.7, animalDetails.size * 0.7]}>
              <sphereGeometry args={[animalDetails.size * 0.5, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Beak */}
            <mesh position={[0, animalDetails.size * 0.7, animalDetails.size * 1.3]} rotation={[0, 0, 0]}>
              <coneGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.6, 8]} />
              <meshStandardMaterial color={"#ff9800"} /> {/* Orange beak */}
            </mesh>
            {/* Wings */}
            <mesh position={[animalDetails.size * 0.8, 0, 0]} rotation={[0, 0, Math.PI * 0.1]}>
              <boxGeometry args={[animalDetails.size * 1.5, animalDetails.size * 0.1, animalDetails.size * 0.8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            <mesh position={[-animalDetails.size * 0.8, 0, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
              <boxGeometry args={[animalDetails.size * 1.5, animalDetails.size * 0.1, animalDetails.size * 0.8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
          </group>
        );
      case "insect":
        return (
          <group>
            {/* Body segments */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[animalDetails.size, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            <mesh position={[0, 0, -animalDetails.size * 1.2]}>
              <sphereGeometry args={[animalDetails.size * 0.8, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Legs */}
            {[...Array(3)].map((_, i) => (
              <group key={`right-leg-${i}`}>
                <mesh position={[animalDetails.size * 0.7, -animalDetails.size * 0.3, (i - 1) * animalDetails.size * 0.7]} rotation={[0, 0, Math.PI * 0.25]}>
                  <boxGeometry args={[animalDetails.size * 0.1, animalDetails.size * 0.8, animalDetails.size * 0.1]} />
                  <meshStandardMaterial color={animalDetails.color} />
                </mesh>
                <mesh position={[-animalDetails.size * 0.7, -animalDetails.size * 0.3, (i - 1) * animalDetails.size * 0.7]} rotation={[0, 0, -Math.PI * 0.25]}>
                  <boxGeometry args={[animalDetails.size * 0.1, animalDetails.size * 0.8, animalDetails.size * 0.1]} />
                  <meshStandardMaterial color={animalDetails.color} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case "reptile":
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[animalDetails.size, animalDetails.size * 0.5, animalDetails.size * 2]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Head */}
            <mesh position={[0, animalDetails.size * 0.2, animalDetails.size * 1.2]}>
              <boxGeometry args={[animalDetails.size * 0.7, animalDetails.size * 0.4, animalDetails.size * 0.7]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Tail */}
            <mesh position={[0, animalDetails.size * 0.1, -animalDetails.size * 1.2]} rotation={[0, 0, 0]}>
              <boxGeometry args={[animalDetails.size * 0.4, animalDetails.size * 0.3, animalDetails.size * 1.5]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Legs */}
            {[...Array(2)].map((_, i) => (
              <group key={`leg-pair-${i}`}>
                <mesh position={[animalDetails.size * 0.6, -animalDetails.size * 0.2, (i * 2 - 1) * animalDetails.size * 0.7]}>
                  <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.4, animalDetails.size * 0.2]} />
                  <meshStandardMaterial color={animalDetails.color} />
                </mesh>
                <mesh position={[-animalDetails.size * 0.6, -animalDetails.size * 0.2, (i * 2 - 1) * animalDetails.size * 0.7]}>
                  <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.4, animalDetails.size * 0.2]} />
                  <meshStandardMaterial color={animalDetails.color} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case "mammal":
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[animalDetails.size, animalDetails.size * 2, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Head */}
            <mesh position={[0, animalDetails.size * 0.5, animalDetails.size * 1.2]} rotation={[Math.PI * 0.1, 0, 0]}>
              <sphereGeometry args={[animalDetails.size * 0.7, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Ears */}
            <mesh position={[animalDetails.size * 0.4, animalDetails.size * 0.9, animalDetails.size * 1.1]} rotation={[0, 0, Math.PI * 0.15]}>
              <coneGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.5, 4]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            <mesh position={[-animalDetails.size * 0.4, animalDetails.size * 0.9, animalDetails.size * 1.1]} rotation={[0, 0, -Math.PI * 0.15]}>
              <coneGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.5, 4]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Tail */}
            <mesh position={[0, animalDetails.size * 0.3, -animalDetails.size * 1.2]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.1, animalDetails.size * 1.5, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Legs */}
            {[...Array(2)].map((_, i) => (
              <group key={`leg-pair-${i}`}>
                <mesh position={[animalDetails.size * 0.5, -animalDetails.size * 0.5, (i * 2 - 1) * animalDetails.size * 0.7]}>
                  <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.8, animalDetails.size * 0.2]} />
                  <meshStandardMaterial color={animalDetails.color} />
                </mesh>
                <mesh position={[-animalDetails.size * 0.5, -animalDetails.size * 0.5, (i * 2 - 1) * animalDetails.size * 0.7]}>
                  <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.8, animalDetails.size * 0.2]} />
                  <meshStandardMaterial color={animalDetails.color} />
                </mesh>
              </group>
            ))}
          </group>
        );
      case "amphibian":
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[animalDetails.size, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Head */}
            <mesh position={[0, animalDetails.size * 0.3, animalDetails.size * 0.8]}>
              <sphereGeometry args={[animalDetails.size * 0.8, 8, 8]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Eyes */}
            <mesh position={[animalDetails.size * 0.4, animalDetails.size * 0.6, animalDetails.size * 1]}>
              <sphereGeometry args={[animalDetails.size * 0.2, 8, 8]} />
              <meshStandardMaterial color={"#212121"} /> {/* Black eyes */}
            </mesh>
            <mesh position={[-animalDetails.size * 0.4, animalDetails.size * 0.6, animalDetails.size * 1]}>
              <sphereGeometry args={[animalDetails.size * 0.2, 8, 8]} />
              <meshStandardMaterial color={"#212121"} /> {/* Black eyes */}
            </mesh>
            {/* Legs */}
            <mesh position={[animalDetails.size * 0.7, -animalDetails.size * 0.2, animalDetails.size * 0.5]} rotation={[0, 0, Math.PI * 0.2]}>
              <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.6, animalDetails.size * 0.2]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            <mesh position={[-animalDetails.size * 0.7, -animalDetails.size * 0.2, animalDetails.size * 0.5]} rotation={[0, 0, -Math.PI * 0.2]}>
              <boxGeometry args={[animalDetails.size * 0.2, animalDetails.size * 0.6, animalDetails.size * 0.2]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
          </group>
        );
      case "fish":
        return (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[animalDetails.size, animalDetails.size * 2, 8, 8]} rotation={[0, Math.PI / 2, 0]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Tail */}
            <mesh position={[-animalDetails.size * 1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <coneGeometry args={[animalDetails.size * 0.8, animalDetails.size * 1, 2]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
            {/* Dorsal fin */}
            <mesh position={[0, animalDetails.size * 0.8, 0]} rotation={[0, 0, 0]}>
              <coneGeometry args={[animalDetails.size * 0.1, animalDetails.size * 0.6, 4]} />
              <meshStandardMaterial color={animalDetails.color} />
            </mesh>
          </group>
        );
      default:
        return (
          <boxGeometry args={[
            animalDetails.size, 
            animalDetails.size, 
            animalDetails.size * 1.5
          ]} />
        );
    }
  };
  
  // Create multiple instances for herd animals
  const renderHerd = () => {
    if (animalDetails.herdSize <= 1) {
      return (
        <mesh ref={meshRef} castShadow>
          {renderAnimalShape()}
          <meshStandardMaterial color={animalDetails.color} roughness={0.7} />
        </mesh>
      );
    }
    
    return Array.from({ length: animalDetails.herdSize }).map((_, index) => {
      // Calculate offset position within the herd
      const offsetX = (index % 2) * animalDetails.size * 2 - animalDetails.size;
      const offsetZ = Math.floor(index / 2) * animalDetails.size * 2 - animalDetails.size;
      
      return (
        <group key={`herd-${index}`} position={[offsetX, 0, offsetZ]}>
          <mesh castShadow scale={0.8 + Math.random() * 0.4}>
            {renderAnimalShape()}
            <meshStandardMaterial color={animalDetails.color} roughness={0.7} />
          </mesh>
        </group>
      );
    });
  };
  
  return (
    <group 
      ref={groupRef}
      position={[animal.position.x, animalDetails.height, animal.position.z]}
      rotation={[0, randomOffset.rotation, 0]}
      scale={randomOffset.scale}
    >
      {renderHerd()}
    </group>
  );
}

export default Animal3D;

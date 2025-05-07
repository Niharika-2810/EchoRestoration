import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Structure } from "../../../lib/eco/types";

interface TechStructureProps {
  structure: Structure;
}

function TechStructure({ structure }: TechStructureProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const pulseRef = useRef(0);
  
  // Structure characteristics based on type
  const getStructureDetails = () => {
    switch (structure.type) {
      case 'monitoring':
        return {
          color: '#2196f3', // Blue for monitoring
          height: 2.5,
          width: 1.2,
          hasRotor: true,
          hasLight: true,
          lightColor: '#4fc3f7', // Light blue
          lightIntensity: 1 + (structure.efficiency / 100)
        };
      case 'research':
        return {
          color: '#9c27b0', // Purple for research
          height: 3,
          width: 1.5,
          hasRotor: false,
          hasLight: true,
          lightColor: '#ce93d8', // Light purple
          lightIntensity: 1.2 + (structure.efficiency / 100)
        };
      case 'purification':
        return {
          color: '#4caf50', // Green for purification
          height: 2,
          width: 1.3,
          hasRotor: true,
          hasLight: true,
          lightColor: '#a5d6a7', // Light green
          lightIntensity: 1.5 + (structure.efficiency / 100)
        };
      default:
        return {
          color: '#607d8b', // Gray default
          height: 2,
          width: 1,
          hasRotor: false,
          hasLight: false,
          lightColor: '#90a4ae',
          lightIntensity: 1
        };
    }
  };
  
  const details = getStructureDetails();
  
  // Animate structure elements
  useFrame((state) => {
    // Rotate the rotor if present
    if (rotorRef.current) {
      rotorRef.current.rotation.y += 0.01 * (structure.efficiency / 100);
    }
    
    // Pulse the light if present
    if (lightRef.current) {
      pulseRef.current += 0.03;
      const pulse = Math.sin(pulseRef.current) * 0.2 + 0.8; // Range between 0.6 and 1.0
      lightRef.current.intensity = details.lightIntensity * pulse;
    }
  });
  
  return (
    <group 
      ref={groupRef}
      position={[structure.position.x, 0, structure.position.z]}
    >
      {/* Base platform */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[details.width / 1.5, details.width / 1.5, 0.1, 16]} />
        <meshStandardMaterial color="#455a64" roughness={0.7} />
      </mesh>
      
      {/* Main structure body */}
      <mesh position={[0, details.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[details.width, details.height, details.width]} />
        <meshStandardMaterial color={details.color} roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* Structure details - solar panels */}
      <mesh position={[0, details.height, 0]} castShadow>
        <boxGeometry args={[details.width * 1.3, 0.1, details.width * 1.3]} />
        <meshStandardMaterial color="#212121" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[details.width/3, details.height + 0.5, details.width/3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#9e9e9e" metalness={0.8} />
      </mesh>
      
      {/* Rotor/Scanner */}
      {details.hasRotor && (
        <mesh 
          ref={rotorRef}
          position={[0, details.height + 0.2, 0]} 
          castShadow
        >
          <cylinderGeometry args={[0.4, 0.4, 0.2, 16]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.6} />
          
          {/* Radar dish */}
          <mesh position={[0.4, 0.2, 0]}>
            <sphereGeometry args={[0.3, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#f5f5f5" metalness={0.7} />
          </mesh>
        </mesh>
      )}
      
      {/* Status light */}
      {details.hasLight && (
        <pointLight
          ref={lightRef}
          position={[0, details.height * 0.75, 0]}
          color={details.lightColor}
          intensity={details.lightIntensity}
          distance={4}
        />
      )}
      
      {/* Additional structure details - windows */}
      {[0, 90, 180, 270].map((rotation, index) => (
        <mesh 
          key={`window-${index}`}
          position={[0, details.height / 2, 0]} 
          rotation={[0, (rotation * Math.PI) / 180, 0]}
        >
          <planeGeometry args={[details.width * 0.4, details.height * 0.2]} />
          <meshStandardMaterial 
            color="#e1f5fe" 
            transparent={true} 
            opacity={0.8} 
            emissive="#e1f5fe"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Structure efficiency indicator */}
      <mesh 
        position={[0, -0.05, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[details.width / 1.5 - 0.1, details.width / 1.5, 32]} />
        <meshBasicMaterial 
          color={structure.efficiency > 70 ? "#4caf50" : structure.efficiency > 40 ? "#ff9800" : "#f44336"}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

export default TechStructure;

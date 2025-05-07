import { useRef, useEffect, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useKeyboardControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useEcosystem } from "../../lib/stores/useEcosystem";
import { useAudio } from "../../lib/stores/useAudio";
import { ActionType } from "../../lib/eco/types";
import { plantTemplates, animalTemplates, waterSourceTemplates, generateRandomPosition } from "../../lib/eco/ecosystemData";

interface RegionControllerProps {
  regionId: string;
}

function RegionController({ regionId }: RegionControllerProps) {
  const { camera, raycaster, mouse, scene } = useThree();
  const cursorRef = useRef<THREE.Mesh>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<THREE.Vector3 | null>(null);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);
  
  const region = useEcosystem(state => 
    state.regions.find(r => r.id === regionId)
  );
  const performAction = useEcosystem(state => state.performAction);
  const selectPosition = useEcosystem(state => state.selectPosition);
  const { playHit } = useAudio();
  
  // Get keyboard controls
  const [, getKeys] = useKeyboardControls();
  
  // Set up action based on HUD selection
  useEffect(() => {
    // Subscribe to action selection from external sources (UI buttons)
    const unsubscribe = useEcosystem.subscribe(
      state => state.selectedPosition,
      (position) => {
        if (position) {
          setHoverPosition(new THREE.Vector3(position.x, position.y, position.z));
        }
      }
    );
    
    return () => {
      unsubscribe();
      // Reset cursor when component unmounts
      setCursorVisible(false);
    };
  }, [regionId]);
  
  // Update cursor position based on mouse/raycaster
  useFrame(() => {
    if (!region) return;
    
    // Cast ray from mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Find ground plane intersection
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, intersection);
    
    // Check if intersection is within region bounds
    if (intersection) {
      const regionPos = new THREE.Vector3(region.position.x, 0, region.position.z);
      const halfWidth = region.size.width / 2;
      const halfHeight = region.size.height / 2;
      
      // Check if point is within region bounds
      if (
        intersection.x >= regionPos.x - halfWidth &&
        intersection.x <= regionPos.x + halfWidth &&
        intersection.z >= regionPos.z - halfHeight &&
        intersection.z <= regionPos.z + halfHeight
      ) {
        // Update cursor position
        if (cursorRef.current) {
          cursorRef.current.position.set(intersection.x, 0.5, intersection.z);
          setCursorVisible(true);
        }
        
        // Update hover position for action placement
        setHoverPosition(intersection);
        
        // Update selected position in ecosystem state
        selectPosition({
          x: intersection.x,
          y: 0,
          z: intersection.z
        });
      } else {
        setCursorVisible(false);
        setHoverPosition(null);
        selectPosition(null);
      }
    }
    
    // Handle action execution on click (space key)
    const keys = getKeys();
    if (keys.action && selectedAction && hoverPosition && region) {
      executeAction();
    }
  });
  
  // Handle action execution
  const executeAction = () => {
    if (!selectedAction || !hoverPosition || !region) return;
    
    // Convert hover position to the format expected by performAction
    const position = {
      x: hoverPosition.x,
      y: 0,
      z: hoverPosition.z
    };
    
    // Generate entity type if not selected
    let entityType = selectedEntityType;
    
    if (!entityType) {
      // Choose a random entity based on action type and region type
      switch (selectedAction) {
        case 'plantTree':
          const plantOptions = plantTemplates[region.type];
          if (plantOptions.length > 0) {
            const randomPlant = plantOptions[Math.floor(Math.random() * plantOptions.length)];
            entityType = randomPlant.species;
          }
          break;
        case 'introduceAnimal':
          const animalOptions = animalTemplates[region.type];
          if (animalOptions.length > 0) {
            const randomAnimal = animalOptions[Math.floor(Math.random() * animalOptions.length)];
            entityType = randomAnimal.species;
          }
          break;
        case 'createWaterSource':
          const waterOptions = waterSourceTemplates[region.type];
          if (waterOptions.length > 0) {
            const randomWater = waterOptions[Math.floor(Math.random() * waterOptions.length)];
            entityType = randomWater.type;
          }
          break;
        case 'buildStructure':
          entityType = 'monitoring';
          break;
        default:
          entityType = 'default';
      }
    }
    
    // Attempt to perform the action
    const success = performAction(selectedAction, regionId, position, entityType || undefined);
    
    if (success) {
      // Play sound effect
      playHit();
      
      // Reset selection after successful action
      setSelectedAction(null);
    }
  };
  
  // External method to set the current action
  useEffect(() => {
    // This exposes setSelectedAction to parent components
    window.setRegionAction = (action: ActionType, entityType: string | null = null) => {
      setSelectedAction(action);
      setSelectedEntityType(entityType);
      
      // Make cursor visible when an action is selected
      setCursorVisible(true);
    };
    
    return () => {
      // Clean up by setting to undefined (safer than delete)
      window.setRegionAction = undefined as any;
    };
  }, []);
  
  // If no region is found, don't render anything
  if (!region) return null;
  
  return (
    <>
      {/* Cursor for showing action placement */}
      {cursorVisible && (
        <mesh 
          ref={cursorRef}
          position={[0, 0.5, 0]} 
          visible={cursorVisible}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial 
            color={selectedAction ? "#4caf50" : "#2196f3"} 
            transparent={true} 
            opacity={0.7} 
          />
        </mesh>
      )}
      
      {/* Action indicator text */}
      {cursorVisible && selectedAction && (
        <Text
          position={[0, 2.5, 0]}
          color="#ffffff"
          fontSize={0.5}
          anchorX="center"
          anchorY="middle"
        >
          {selectedAction}
        </Text>
      )}
    </>
  );
}

// Add global type for action setting
declare global {
  interface Window {
    setRegionAction?: (action: ActionType, entityType?: string | null) => void;
  }
}

export default RegionController;

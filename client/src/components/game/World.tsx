import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import Terrain from "./Terrain";
import EcosystemRegion from "./EcosystemRegion";
import { useEcosystem } from "../../lib/stores/useEcosystem";
import { useGame } from "../../lib/stores/useGame";
import RegionController from "./RegionController";

export function World() {
  const { camera } = useThree();
  const controls = useRef<any>();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const regions = useEcosystem((state) => state.regions);
  const selectRegion = useEcosystem((state) => state.selectRegion);
  const gamePhase = useGame((state) => state.phase);
  
  // Get keyboard controls state
  const [, getKeys] = useKeyboardControls();
  
  // Initialize camera position
  useEffect(() => {
    camera.position.set(0, 20, 20);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Handle camera movement with keyboard controls
  useFrame(() => {
    if (gamePhase !== "playing") return;
    
    const keys = getKeys();
    
    // Don't use camera controls when a region is selected (allow for local navigation)
    if (selectedRegionId && controls.current) {
      // Get the selected region
      const selectedRegion = regions.find(r => r.id === selectedRegionId);
      
      if (selectedRegion) {
        // Focus camera on selected region
        controls.current.target.set(
          selectedRegion.position.x,
          0,
          selectedRegion.position.z
        );
      }
    }
    
    // Zoom controls
    if (keys.zoomIn) {
      camera.position.y = Math.max(5, camera.position.y - 0.2);
      camera.position.z = Math.max(5, camera.position.z - 0.2);
    }
    
    if (keys.zoomOut) {
      camera.position.y = Math.min(30, camera.position.y + 0.2);
      camera.position.z = Math.min(30, camera.position.z + 0.2);
    }
  });
  
  // Handle region selection
  const handleRegionClick = (regionId: string) => {
    if (gamePhase !== "playing") return;
    
    // Toggle selection if clicking the same region
    if (selectedRegionId === regionId) {
      setSelectedRegionId(null);
      selectRegion(null);
    } else {
      setSelectedRegionId(regionId);
      selectRegion(regionId);
      
      // Find the selected region
      const selectedRegion = regions.find(r => r.id === regionId);
      
      if (selectedRegion && controls.current) {
        // Animate camera to focus on the selected region
        const target = new THREE.Vector3(
          selectedRegion.position.x,
          0,
          selectedRegion.position.z
        );
        
        // Update orbit controls to focus on the region
        controls.current.target.copy(target);
      }
    }
  };
  
  return (
    <>
      {/* World lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[50, 100, 50]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* World terrain */}
      <Terrain />
      
      {/* Ecosystem regions */}
      {regions.map((region) => (
        <EcosystemRegion
          key={region.id}
          region={region}
          isSelected={region.id === selectedRegionId}
          onClick={() => handleRegionClick(region.id)}
        />
      ))}
      
      {/* Active region controller (handles actions within selected region) */}
      {selectedRegionId && <RegionController regionId={selectedRegionId} />}
      
      {/* Camera controls */}
      <OrbitControls 
        ref={controls} 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1} // Limit to slightly above horizon
        minPolarAngle={Math.PI / 6}    // Limit minimum angle (prevent looking from below)
      />
    </>
  );
}

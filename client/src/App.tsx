import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Loader, Sky } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { World } from "./components/game/World";
import GameHUD from "./components/game/ui/GameHUD";
import Tutorial from "./components/game/ui/Tutorial";
import { useAudio } from "./lib/stores/useAudio";
import { useGame } from "./lib/stores/useGame";
import "@fontsource/inter";

// Define control keys for the game
const controls = [
  { name: "forward", keys: ["KeyW", "ArrowUp"] },
  { name: "backward", keys: ["KeyS", "ArrowDown"] },
  { name: "leftward", keys: ["KeyA", "ArrowLeft"] },
  { name: "rightward", keys: ["KeyD", "ArrowRight"] },
  { name: "action", keys: ["Space"] },
  { name: "zoomIn", keys: ["KeyQ"] },
  { name: "zoomOut", keys: ["KeyE"] },
];

// Main App component
function App() {
  const { phase } = useGame();
  const [showCanvas, setShowCanvas] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const { setBackgroundMusic } = useAudio();

  // Load background music
  useEffect(() => {
    const music = new Audio("/sounds/background.mp3");
    music.loop = true;
    music.volume = 0.3;
    setBackgroundMusic(music);
    
    // Load other sound effects
    const hit = new Audio("/sounds/hit.mp3");
    const success = new Audio("/sounds/success.mp3");
    hit.volume = 0.4;
    success.volume = 0.5;
    
    // Show the canvas once everything is loaded
    setShowCanvas(true);
    
    return () => {
      music.pause();
    };
  }, [setBackgroundMusic]);

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    useGame.getState().start();
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {showCanvas && (
        <KeyboardControls map={controls}>
          <div className="relative w-full h-full">
            <Canvas
              shadows
              camera={{
                position: [0, 20, 20],
                fov: 50,
                near: 0.1,
                far: 1000
              }}
              gl={{
                antialias: true,
                powerPreference: "default"
              }}
            >
              <color attach="background" args={["#87ceeb"]} />
              <Sky sunPosition={[100, 20, 100]} />
              
              <Suspense fallback={null}>
                <World />
              </Suspense>
            </Canvas>
            
            {/* Game UI rendered over the Canvas */}
            <GameHUD />
            
            {/* Show tutorial on first load */}
            {showTutorial && phase === "ready" && (
              <Tutorial onComplete={handleTutorialComplete} />
            )}
          </div>
        </KeyboardControls>
      )}
      
      {/* Loader component */}
      <Loader 
        containerStyles={{ background: 'rgba(21, 101, 80, 0.9)' }} 
        innerStyles={{ background: '#2a9d8f' }}
        barStyles={{ background: '#e9c46a' }}
        dataStyles={{ color: '#f4f1de', fontWeight: 'bold', fontSize: '1.2em' }}
        dataInterpolation={(p) => `Loading Echoes of Terra... ${p.toFixed(0)}%`}
      />
    </div>
  );
}

export default App;

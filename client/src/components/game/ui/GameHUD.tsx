import { useState, useEffect } from "react";
import { useGame } from "../../../lib/stores/useGame";
import { useEcosystem } from "../../../lib/stores/useEcosystem";
import { useTechnology } from "../../../lib/stores/useTechnology";
import { useAudio } from "../../../lib/stores/useAudio";
import { getHealthStatus } from "../../../lib/eco/ecosystemData";
import { ActionType } from "../../../lib/eco/types";
import ActionMenu from "./ActionMenu";
import RegionDetails from "./RegionDetails";
import TechnologyMenu from "./TechnologyMenu";
import EventNotification from "./EventNotification";
import EcoStats from "./EcoStats";

function GameHUD() {
  const { phase } = useGame();
  const { cycle, score, resources, selectedRegionId, regions } = useEcosystem();
  const { isMuted, toggleMute } = useAudio();
  const [showTechMenu, setShowTechMenu] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Get the selected region
  const selectedRegion = selectedRegionId 
    ? regions.find(r => r.id === selectedRegionId)
    : null;
  
  // Function to handle action selection
  const handleActionSelect = (action: ActionType, entityType?: string) => {
    if (window.setRegionAction && selectedRegionId) {
      window.setRegionAction(action, entityType || null);
    }
  };
  
  // Only render HUD when game is playing
  if (phase !== "playing") return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar with game status */}
      <div className="p-4 bg-black bg-opacity-70 text-white flex justify-between items-center pointer-events-auto">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-gray-400 mr-2">Cycle:</span>
            <span className="font-bold">{cycle}</span>
          </div>
          <div>
            <span className="text-gray-400 mr-2">Score:</span>
            <span className="font-bold text-green-400">{score}</span>
          </div>
          <div>
            <span className="text-gray-400 mr-2">Resources:</span>
            <span className="font-bold text-yellow-400">{resources}</span>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Statistics
          </button>
          <button 
            onClick={() => setShowTechMenu(!showTechMenu)}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white"
          >
            Technologies
          </button>
          <button 
            onClick={() => useGame.getState().end()}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            End Game
          </button>
          <button 
            onClick={toggleMute}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button 
            onClick={() => useEcosystem.getState().incrementCycle()}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            Next Cycle
          </button>
        </div>
      </div>
      
      {/* Left side panel for region details */}
      {selectedRegion && (
        <div className="absolute left-0 top-20 bottom-0 w-64 bg-black bg-opacity-70 text-white p-4 overflow-y-auto pointer-events-auto">
          <RegionDetails region={selectedRegion} />
        </div>
      )}
      
      {/* Right side panel for actions */}
      {selectedRegion && (
        <div className="absolute right-0 top-20 bottom-0 w-64 bg-black bg-opacity-70 text-white p-4 overflow-y-auto pointer-events-auto">
          <ActionMenu 
            regionType={selectedRegion.type} 
            onSelectAction={handleActionSelect} 
          />
        </div>
      )}
      
      {/* Technology menu overlay */}
      {showTechMenu && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20 pointer-events-auto">
          <TechnologyMenu onClose={() => setShowTechMenu(false)} />
        </div>
      )}
      
      {/* Statistics overlay */}
      {showStats && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-20 pointer-events-auto">
          <EcoStats onClose={() => setShowStats(false)} />
        </div>
      )}
      
      {/* Event notifications */}
      <EventNotification />
      
      {/* Selection instructions when a region is selected */}
      {selectedRegion && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg text-sm">
          Select an action from the right panel, then click on the region to place it. Press SPACE to confirm.
        </div>
      )}
      
      {/* No region selected message */}
      {!selectedRegion && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg">
          Click on a region to begin restoration
        </div>
      )}
    </div>
  );
}

export default GameHUD;

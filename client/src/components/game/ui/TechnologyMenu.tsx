import { useState, useEffect } from "react";
import { useTechnology } from "../../../lib/stores/useTechnology";
import { useEcosystem } from "../../../lib/stores/useEcosystem";
import { Technology } from "../../../lib/eco/types";
import { technologyTree } from "../../../lib/eco/techData";

interface TechnologyMenuProps {
  onClose: () => void;
}

function TechnologyMenu({ onClose }: TechnologyMenuProps) {
  const { technologies, selectedTechId, selectTechnology, startResearch, continueResearch, researchProgress } = useTechnology();
  const { resources, addResources } = useEcosystem();
  
  const [availableTechs, setAvailableTechs] = useState<Technology[]>([]);
  const [researchedTechs, setResearchedTechs] = useState<Technology[]>([]);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  
  // Populate available and researched technologies
  useEffect(() => {
    const available = technologies.filter(tech => tech.unlocked && !tech.researched);
    const researched = technologies.filter(tech => tech.researched);
    
    setAvailableTechs(available);
    setResearchedTechs(researched);
    
    // Set selected tech if one is already selected
    if (selectedTechId) {
      const tech = technologies.find(t => t.id === selectedTechId);
      if (tech) setSelectedTech(tech);
    }
  }, [technologies, selectedTechId]);
  
  // Handle tech selection
  const handleSelectTech = (tech: Technology) => {
    selectTechnology(tech.id);
    setSelectedTech(tech);
  };
  
  // Start researching selected technology
  const handleStartResearch = () => {
    if (!selectedTech) return;
    
    // Check if we have enough resources
    if (resources < selectedTech.cost) {
      alert("Not enough resources to research this technology!");
      return;
    }
    
    // Deduct resources
    addResources(-selectedTech.cost);
    
    // Start research
    startResearch(selectedTech.id);
  };
  
  // Continue researching (simulate research progress)
  const handleContinueResearch = () => {
    if (!selectedTech) return;
    
    // Add research progress
    continueResearch(selectedTech.id, 20); // 20% progress per click for demo
  };
  
  return (
    <div className="w-4/5 h-4/5 bg-gray-800 rounded-lg p-6 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-white">Research & Development</h2>
        <button 
          onClick={onClose}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Close
        </button>
      </div>
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left panel: Available technologies */}
        <div className="w-1/3 bg-gray-900 rounded-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-3">Available Technologies</h3>
          
          {availableTechs.length === 0 ? (
            <p className="text-gray-400">No technologies available to research.</p>
          ) : (
            <ul className="space-y-2">
              {availableTechs.map(tech => (
                <li 
                  key={tech.id}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedTech?.id === tech.id 
                      ? 'bg-blue-700 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                  onClick={() => handleSelectTech(tech)}
                >
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-xs opacity-80">Cost: {tech.cost} resources</div>
                  {researchProgress[tech.id] !== undefined && (
                    <div className="mt-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${researchProgress[tech.id]}%` }}
                      ></div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Middle panel: Technology details */}
        <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-y-auto">
          {selectedTech ? (
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{selectedTech.name}</h3>
              <p className="text-gray-300 mb-4">{selectedTech.description}</p>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">Effects:</h4>
                <ul className="space-y-1 text-gray-300">
                  {selectedTech.effects.map((effect, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-32 text-gray-400">{effect.type}:</span>
                      <span>{effect.target}</span>
                      <span className="ml-2 text-green-400">+{effect.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedTech.prerequisite && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400">Prerequisite:</h4>
                  <p className="text-gray-300">
                    {technologies.find(t => t.id === selectedTech.prerequisite)?.name || selectedTech.prerequisite}
                  </p>
                </div>
              )}
              
              {/* Research progress */}
              {researchProgress[selectedTech.id] !== undefined && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-400">Research Progress:</h4>
                  <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${researchProgress[selectedTech.id]}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-400 mt-1">
                    {Math.floor(researchProgress[selectedTech.id] || 0)}%
                  </p>
                </div>
              )}
              
              {/* Research actions */}
              <div className="mt-6 flex justify-center gap-4">
                {researchProgress[selectedTech.id] === undefined ? (
                  <button
                    onClick={handleStartResearch}
                    disabled={resources < selectedTech.cost}
                    className={`px-4 py-2 rounded-lg ${
                      resources >= selectedTech.cost
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Start Research ({selectedTech.cost} resources)
                  </button>
                ) : researchProgress[selectedTech.id] < 100 ? (
                  <button
                    onClick={handleContinueResearch}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Continue Research
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-lg bg-green-600 text-white">
                    Research Complete!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a technology to view details
            </div>
          )}
        </div>
        
        {/* Right panel: Researched technologies */}
        <div className="w-1/3 bg-gray-900 rounded-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-3">Researched Technologies</h3>
          
          {researchedTechs.length === 0 ? (
            <p className="text-gray-400">No technologies have been researched yet.</p>
          ) : (
            <ul className="space-y-2">
              {researchedTechs.map(tech => (
                <li 
                  key={tech.id}
                  className="p-2 rounded bg-green-800 text-white cursor-pointer hover:bg-green-700"
                  onClick={() => handleSelectTech(tech)}
                >
                  <div className="font-medium">{tech.name}</div>
                  <div className="text-xs text-green-300">Researched</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnologyMenu;

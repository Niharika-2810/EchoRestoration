import { useState, useMemo } from "react";
import { EcosystemType, ActionType } from "../../../lib/eco/types";
import { availableActions } from "../../../lib/eco/ecosystemData";
import { useEcosystem } from "../../../lib/stores/useEcosystem";
import { useTechnology } from "../../../lib/stores/useTechnology";
import { plantTemplates, animalTemplates, waterSourceTemplates } from "../../../lib/eco/ecosystemData";

interface ActionMenuProps {
  regionType: EcosystemType;
  onSelectAction: (type: ActionType, entityType?: string) => void;
}

function ActionMenu({ regionType, onSelectAction }: ActionMenuProps) {
  const [expandedAction, setExpandedAction] = useState<ActionType | null>(null);
  const { resources } = useEcosystem();
  const { isTechResearched } = useTechnology();
  
  // Filter actions applicable to this region type
  const filteredActions = useMemo(() => {
    return availableActions.filter(action => 
      action.applicableRegions.includes(regionType)
    );
  }, [regionType]);
  
  // Check if an action is available (has resources and required tech)
  const isActionAvailable = (action: typeof availableActions[0]) => {
    // Check resources
    if (resources < action.cost) {
      return false;
    }
    
    // Check technology requirements
    if (action.techRequired && !isTechResearched(action.techRequired)) {
      return false;
    }
    
    return true;
  };
  
  // Handle selecting an action
  const handleSelectAction = (action: typeof availableActions[0]) => {
    if (!isActionAvailable(action)) return;
    
    // If it's already expanded, collapse it
    if (expandedAction === action.type) {
      setExpandedAction(null);
      return;
    }
    
    // Otherwise expand it to show options
    setExpandedAction(action.type);
    
    // If it doesn't have sub-options, directly select it
    if (action.type === 'removeInvasive' || action.type === 'cleanPollution') {
      onSelectAction(action.type);
    }
  };
  
  // Get options based on action type
  const getActionOptions = (actionType: ActionType) => {
    switch(actionType) {
      case 'plantTree':
        return plantTemplates[regionType];
      case 'introduceAnimal':
        return animalTemplates[regionType];
      case 'createWaterSource':
        return waterSourceTemplates[regionType];
      case 'buildStructure':
        return [{ id: 'monitoring', species: 'Monitoring Station' }];
      default:
        return [];
    }
  };
  
  // Select a specific entity within an action type
  const handleSelectEntity = (actionType: ActionType, entityId: string) => {
    switch(actionType) {
      case 'plantTree':
        const plant = plantTemplates[regionType].find(p => p.id === entityId);
        if (plant) onSelectAction(actionType, plant.species);
        break;
      case 'introduceAnimal':
        const animal = animalTemplates[regionType].find(a => a.id === entityId);
        if (animal) onSelectAction(actionType, animal.species);
        break;
      case 'createWaterSource':
        const water = waterSourceTemplates[regionType].find(w => w.id === entityId);
        if (water) onSelectAction(actionType, water.type);
        break;
      case 'buildStructure':
        onSelectAction(actionType, entityId);
        break;
      default:
        onSelectAction(actionType);
    }
    
    // Collapse after selection
    setExpandedAction(null);
  };
  
  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-4">Available Actions</h2>
      
      <div className="space-y-3">
        {filteredActions.map((action) => (
          <div key={action.type} className="rounded-lg overflow-hidden">
            {/* Action header */}
            <button
              onClick={() => handleSelectAction(action)}
              disabled={!isActionAvailable(action)}
              className={`w-full p-2 text-left ${
                isActionAvailable(action)
                  ? expandedAction === action.type
                    ? 'bg-blue-700'
                    : 'bg-blue-900 hover:bg-blue-800'
                  : 'bg-gray-800 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{action.name}</span>
                <span className={resources >= action.cost ? 'text-yellow-400' : 'text-red-400'}>
                  {action.cost}
                </span>
              </div>
              
              {action.techRequired && !isTechResearched(action.techRequired) && (
                <div className="text-xs text-red-400">
                  Requires: {action.techRequired.split('_').join(' ')}
                </div>
              )}
            </button>
            
            {/* Expanded options */}
            {expandedAction === action.type && (
              <div className="bg-gray-800 p-2 space-y-1">
                <div className="text-xs text-gray-400 mb-2">{action.description}</div>
                
                {/* Show available options for this action */}
                {['plantTree', 'introduceAnimal', 'createWaterSource', 'buildStructure'].includes(action.type) && (
                  <div className="space-y-1">
                    {getActionOptions(action.type).map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelectEntity(action.type, option.id)}
                        className="w-full p-1 text-sm bg-gray-700 hover:bg-gray-600 rounded text-left"
                      >
                        {action.type === 'plantTree' ? option.species : 
                         action.type === 'introduceAnimal' ? option.species :
                         action.type === 'createWaterSource' ? option.type :
                         option.species}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-xs text-gray-400">
        Select an action, then click on the region to place it.
        Press SPACE to confirm placement.
      </div>
    </div>
  );
}

export default ActionMenu;

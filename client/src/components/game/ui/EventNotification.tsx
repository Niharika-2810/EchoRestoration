import { useState, useEffect } from "react";
import { useEvents } from "../../../lib/stores/useEvents";
import { useTechnology } from "../../../lib/stores/useTechnology";
import { GameEvent, EventChoice } from "../../../lib/eco/types";

function EventNotification() {
  const { activeEvents, currentEvent, handleEventChoice, dismissEvent } = useEvents();
  const { isTechResearched } = useTechnology();
  const [showNotification, setShowNotification] = useState(false);
  
  // Show notification when there's a current event
  useEffect(() => {
    setShowNotification(!!currentEvent);
  }, [currentEvent]);
  
  // If no event to show, don't render anything
  if (!showNotification || !currentEvent) {
    return null;
  }
  
  // Handle choice selection
  const onSelectChoice = (choiceId: string) => {
    handleEventChoice(currentEvent.id, choiceId);
    setShowNotification(false);
  };
  
  // Handle dismissing the event
  const onDismiss = () => {
    dismissEvent();
    setShowNotification(false);
  };
  
  // Check if choice requires technology
  const isChoiceAvailable = (choice: EventChoice) => {
    if (!choice.techRequired) return true;
    return isTechResearched(choice.techRequired);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-30 pointer-events-auto">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
        <div className="border-b border-gray-700 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-red-500">{currentEvent.name}</h2>
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded">
              Duration: {currentEvent.duration} cycles
            </span>
          </div>
        </div>
        
        <div className="my-6">
          <p className="text-white text-lg">{currentEvent.description}</p>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">Effects:</h3>
            <ul className="space-y-1 text-gray-300">
              {currentEvent.effects.map((effect, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-32 text-gray-400">{effect.target}:</span>
                  <span className={effect.value > 0 ? 'text-green-400' : 'text-red-400'}>
                    {effect.value > 0 ? '+' : ''}{effect.value}%
                  </span>
                  <span className="ml-2 text-gray-400">
                    (for {effect.duration} cycles)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {currentEvent.choices && currentEvent.choices.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">How will you respond?</h3>
            
            <div className="space-y-3">
              {currentEvent.choices.map(choice => (
                <button
                  key={choice.id}
                  onClick={() => onSelectChoice(choice.id)}
                  disabled={!isChoiceAvailable(choice)}
                  className={`w-full p-3 rounded-lg text-left ${
                    isChoiceAvailable(choice)
                      ? 'bg-blue-700 hover:bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="font-medium">{choice.text}</div>
                  
                  {choice.techRequired && !isChoiceAvailable(choice) && (
                    <div className="text-xs text-red-400 mt-1">
                      Requires: {choice.techRequired.split('_').join(' ')}
                    </div>
                  )}
                  
                  <div className="text-xs mt-1 text-gray-300">
                    Effects: {choice.effects.map(e => 
                      `${e.target} ${e.value > 0 ? '+' : ''}${e.value}%`
                    ).join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onDismiss}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventNotification;

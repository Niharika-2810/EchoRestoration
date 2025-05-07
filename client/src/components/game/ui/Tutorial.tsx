import { useState } from "react";

interface TutorialProps {
  onComplete: () => void;
}

function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Tutorial content steps
  const tutorialSteps = [
    {
      title: "Welcome to Echoes of Terra",
      content: "Earth's ecosystems are in peril. As a Restorer, your mission is to rebuild natural environments, restore biodiversity, and balance ecological needs through strategic actions and scientific methods.",
      image: "🌎"
    },
    {
      title: "Understanding Ecosystems",
      content: "You'll manage three distinct ecosystems: Rainforests, Deserts, and Wetlands. Each has unique challenges and plants/animals that thrive there. Monitor their health, biodiversity, water quality, and pollution levels.",
      image: "🌿"
    },
    {
      title: "Restoration Actions",
      content: "Use your resources to plant native species, reintroduce animals, create water sources, remove invasive species, and clean pollution. As you restore ecosystems, observe how these elements interact and create chain reactions.",
      image: "🌱"
    },
    {
      title: "Technology Research",
      content: "Research new technologies to improve your restoration capabilities. Advanced techniques will allow you to restore ecosystems more efficiently and unlock new abilities.",
      image: "🔬"
    },
    {
      title: "Environmental Events",
      content: "Be prepared for environmental events like droughts, wildfires, or pollution spills that will challenge your management. Your technology and preparation will determine how well you can respond.",
      image: "🌪️"
    },
    {
      title: "Gameplay Controls",
      content: "Click on a region to select it. Use WASD/Arrow keys to navigate the camera. Zoom with Q/E keys. Select actions from the menu and place them with Space. The Next Cycle button advances game time.",
      image: "⌨️"
    },
    {
      title: "Ready to Begin",
      content: "Your mission starts now. Can you restore Earth's damaged ecosystems and create a sustainable balance between nature and humanity?",
      image: "🚀"
    }
  ];
  
  // Current step data
  const step = tutorialSteps[currentStep];
  
  // Navigation handlers
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{step.image}</div>
          <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
          <p className="text-gray-300">{step.content}</p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          {tutorialSteps.map((_, index) => (
            <div 
              key={index}
              className={`h-2 w-8 mx-1 rounded-full ${
                index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            ></div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded ${
              currentStep === 0 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-600 text-white hover:bg-gray-500'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleSkip}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-600"
          >
            Skip Tutorial
          </button>
          
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            {currentStep < tutorialSteps.length - 1 ? 'Next' : 'Start Game'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;

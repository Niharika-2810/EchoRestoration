import { GameEvent, EcosystemType } from './types';

// Game events that can trigger during gameplay
export const gameEvents: GameEvent[] = [
  {
    id: 'drought',
    name: 'Severe Drought',
    description: 'A severe drought is affecting the region, threatening plant life and water sources.',
    duration: 5,
    targetRegionTypes: ['rainforest', 'desert', 'wetland'],
    effects: [
      { target: 'health', value: -10, duration: 5 },
      { target: 'waterQuality', value: -15, duration: 5 },
      { target: 'plants', value: -20, duration: 5 }
    ],
    choices: [
      {
        id: 'water_conservation',
        text: 'Implement emergency water conservation measures',
        effects: [
          { target: 'waterQuality', value: 5, duration: 5 },
          { target: 'health', value: -5, duration: 2 }
        ]
      },
      {
        id: 'drought_resistant',
        text: 'Plant drought-resistant species',
        effects: [
          { target: 'health', value: 10, duration: 10 },
          { target: 'biodiversity', value: -5, duration: 3 }
        ],
        techRequired: 'advanced_planting'
      }
    ],
    isActive: false
  },
  {
    id: 'wildfire',
    name: 'Wildfire',
    description: 'A wildfire has broken out, threatening to destroy vegetation and wildlife.',
    duration: 3,
    targetRegionTypes: ['rainforest', 'desert'],
    effects: [
      { target: 'health', value: -20, duration: 3 },
      { target: 'biodiversity', value: -15, duration: 3 },
      { target: 'plants', value: -30, duration: 3 }
    ],
    choices: [
      {
        id: 'fire_containment',
        text: 'Deploy containment measures',
        effects: [
          { target: 'health', value: 10, duration: 2 }
        ]
      },
      {
        id: 'controlled_burn',
        text: 'Implement controlled burn strategy',
        effects: [
          { target: 'health', value: 15, duration: 5 },
          { target: 'biodiversity', value: 10, duration: 7 }
        ],
        techRequired: 'ecosystem_engineering'
      }
    ],
    isActive: false
  },
  {
    id: 'pollution_spill',
    name: 'Industrial Pollution Spill',
    description: 'An industrial accident has released pollutants into the ecosystem.',
    duration: 7,
    targetRegionTypes: ['rainforest', 'wetland'],
    effects: [
      { target: 'pollutionLevel', value: 25, duration: 7 },
      { target: 'waterQuality', value: -20, duration: 7 },
      { target: 'animals', value: -15, duration: 5 }
    ],
    choices: [
      {
        id: 'cleanup_operation',
        text: 'Launch immediate cleanup operation',
        effects: [
          { target: 'pollutionLevel', value: -15, duration: 3 },
          { target: 'waterQuality', value: 10, duration: 4 }
        ]
      },
      {
        id: 'bioremediation',
        text: 'Deploy bioremediation techniques',
        effects: [
          { target: 'pollutionLevel', value: -25, duration: 5 },
          { target: 'waterQuality', value: 20, duration: 6 },
          { target: 'health', value: 10, duration: 4 }
        ],
        techRequired: 'microbial_remediation'
      }
    ],
    isActive: false
  },
  {
    id: 'invasive_species',
    name: 'Invasive Species Outbreak',
    description: 'An invasive species is spreading rapidly, threatening native flora and fauna.',
    duration: 6,
    targetRegionTypes: ['rainforest', 'wetland', 'desert'],
    effects: [
      { target: 'biodiversity', value: -20, duration: 6 },
      { target: 'health', value: -10, duration: 4 },
      { target: 'plants', value: -15, duration: 5 }
    ],
    choices: [
      {
        id: 'manual_removal',
        text: 'Organize manual removal campaign',
        effects: [
          { target: 'biodiversity', value: 10, duration: 3 },
          { target: 'health', value: 5, duration: 2 }
        ]
      },
      {
        id: 'targeted_management',
        text: 'Implement targeted ecosystem management',
        effects: [
          { target: 'biodiversity', value: 20, duration: 6 },
          { target: 'health', value: 15, duration: 5 },
          { target: 'plants', value: 10, duration: 4 }
        ],
        techRequired: 'biodiversity_management'
      }
    ],
    isActive: false
  },
  {
    id: 'flood',
    name: 'Severe Flooding',
    description: 'Extreme rainfall has caused flooding, impacting the ecosystem.',
    duration: 4,
    targetRegionTypes: ['rainforest', 'wetland'],
    effects: [
      { target: 'waterQuality', value: -15, duration: 4 },
      { target: 'health', value: -10, duration: 3 },
      { target: 'animals', value: -10, duration: 2 }
    ],
    choices: [
      {
        id: 'flood_barriers',
        text: 'Deploy temporary flood barriers',
        effects: [
          { target: 'waterQuality', value: 5, duration: 2 },
          { target: 'health', value: 8, duration: 3 }
        ]
      },
      {
        id: 'natural_buffers',
        text: 'Enhance natural flood buffers',
        effects: [
          { target: 'waterQuality', value: 15, duration: 5 },
          { target: 'health', value: 12, duration: 4 },
          { target: 'biodiversity', value: 10, duration: 6 }
        ],
        techRequired: 'water_purification'
      }
    ],
    isActive: false
  }
];

// Get a random event appropriate for the region type
export function getRandomEvent(regionType: EcosystemType): GameEvent | null {
  const appropriateEvents = gameEvents.filter(event => 
    !event.isActive && 
    event.targetRegionTypes.includes(regionType)
  );
  
  if (appropriateEvents.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * appropriateEvents.length);
  return { ...appropriateEvents[randomIndex] };
}

// Calculate chance of event occurrence based on ecosystem health
export function calculateEventChance(health: number): number {
  // Lower health means higher chance of negative events
  // Returns a value between 0.05 (5% at health 100) and 0.5 (50% at health 0)
  return 0.5 - (health / 250); // Linear scaling
}

// Process event choice effects
export function processEventChoice(event: GameEvent, choiceId: string) {
  const choice = event.choices?.find(c => c.id === choiceId);
  
  if (!choice) {
    console.error(`Choice with ID ${choiceId} not found in event ${event.id}`);
    return null;
  }
  
  return choice.effects;
}

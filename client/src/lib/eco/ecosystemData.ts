import { Region, EcosystemType, Plant, Animal, WaterSource, ResourceEffect } from './types';

// Basic plant templates by ecosystem type
export const plantTemplates: Record<EcosystemType, Plant[]> = {
  rainforest: [
    {
      id: 'rainforest_tree_1',
      species: 'Emergent Tree',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'health', value: 2, radius: 3 },
        { target: 'biodiversity', value: 3, radius: 5 }
      ]
    },
    {
      id: 'rainforest_tree_2',
      species: 'Canopy Tree',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'health', value: 1.5, radius: 2 },
        { target: 'biodiversity', value: 2, radius: 4 }
      ]
    },
    {
      id: 'rainforest_understory',
      species: 'Understory Plant',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'health', value: 1, radius: 1 },
        { target: 'waterQuality', value: 0.5, radius: 2 }
      ]
    }
  ],
  desert: [
    {
      id: 'desert_cactus',
      species: 'Saguaro Cactus',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'health', value: 1, radius: 2 },
        { target: 'waterQuality', value: 0.5, radius: 1 }
      ]
    },
    {
      id: 'desert_shrub',
      species: 'Desert Shrub',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'health', value: 0.8, radius: 1 },
        { target: 'pollutionLevel', value: -0.5, radius: 2 }
      ]
    },
    {
      id: 'desert_succulent',
      species: 'Desert Succulent',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'health', value: 0.5, radius: 1 },
        { target: 'biodiversity', value: 1, radius: 1 }
      ]
    }
  ],
  wetland: [
    {
      id: 'wetland_reeds',
      species: 'Cattail Reeds',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'waterQuality', value: 2, radius: 3 },
        { target: 'health', value: 1, radius: 2 }
      ]
    },
    {
      id: 'wetland_mangrove',
      species: 'Mangrove Tree',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'pollutionLevel', value: -2, radius: 4 },
        { target: 'biodiversity', value: 3, radius: 3 }
      ]
    },
    {
      id: 'wetland_lilies',
      species: 'Water Lilies',
      position: { x: 0, y: 0, z: 0 },
      maturity: 0,
      health: 100,
      isNative: true,
      effects: [
        { target: 'waterQuality', value: 1.5, radius: 2 },
        { target: 'biodiversity', value: 1, radius: 2 }
      ]
    }
  ]
};

// Basic animal templates by ecosystem type
export const animalTemplates: Record<EcosystemType, Animal[]> = {
  rainforest: [
    {
      id: 'rainforest_monkey',
      species: 'Capuchin Monkey',
      position: { x: 0, y: 0, z: 0 },
      population: 10,
      health: 80,
      isNative: true,
      effects: [
        { target: 'biodiversity', value: 3, radius: 5 },
        { target: 'health', value: 1, radius: 4 }
      ]
    },
    {
      id: 'rainforest_bird',
      species: 'Toucan',
      position: { x: 0, y: 0, z: 0 },
      population: 15,
      health: 90,
      isNative: true,
      effects: [
        { target: 'biodiversity', value: 2, radius: 7 },
        { target: 'health', value: 0.5, radius: 6 }
      ]
    },
    {
      id: 'rainforest_insect',
      species: 'Leaf-cutter Ant',
      position: { x: 0, y: 0, z: 0 },
      population: 1000,
      health: 100,
      isNative: true,
      effects: [
        { target: 'health', value: 0.8, radius: 2 }
      ]
    }
  ],
  desert: [
    {
      id: 'desert_lizard',
      species: 'Desert Lizard',
      position: { x: 0, y: 0, z: 0 },
      population: 30,
      health: 95,
      isNative: true,
      effects: [
        { target: 'biodiversity', value: 1.5, radius: 3 }
      ]
    },
    {
      id: 'desert_fox',
      species: 'Desert Fox',
      position: { x: 0, y: 0, z: 0 },
      population: 8,
      health: 85,
      isNative: true,
      effects: [
        { target: 'biodiversity', value: 2, radius: 4 },
        { target: 'health', value: 0.5, radius: 3 }
      ]
    },
    {
      id: 'desert_scorpion',
      species: 'Desert Scorpion',
      position: { x: 0, y: 0, z: 0 },
      population: 50,
      health: 100,
      isNative: true,
      effects: [
        { target: 'biodiversity', value: 1, radius: 2 }
      ]
    }
  ],
  wetland: [
    {
      id: 'wetland_frog',
      species: 'Marsh Frog',
      position: { x: 0, y: 0, z: 0 },
      population: 100,
      health: 90,
      isNative: true,
      effects: [
        { target: 'biodiversity', value: 2, radius: 3 },
        { target: 'waterQuality', value: 1, radius: 2 }
      ]
    },
    {
      id: 'wetland_bird',
      species: 'Heron',
      position: { x: 0, y: 0, z: 0 },
      population: 12,
      health: 95,
      isNative: true,
      effects: [
        { target: 'biodiversity', value: 3, radius: 5 }
      ]
    },
    {
      id: 'wetland_fish',
      species: 'Marsh Fish',
      position: { x: 0, y: 0, z: 0 },
      population: 200,
      health: 85,
      isNative: true,
      effects: [
        { target: 'waterQuality', value: 2, radius: 4 },
        { target: 'biodiversity', value: 1.5, radius: 3 }
      ]
    }
  ]
};

// Water source templates by ecosystem type
export const waterSourceTemplates: Record<EcosystemType, WaterSource[]> = {
  rainforest: [
    {
      id: 'rainforest_river',
      type: 'river',
      position: { x: 0, y: 0, z: 0 },
      size: 2,
      flow: 90,
      quality: 85,
      effects: [
        { target: 'waterQuality', value: 3, radius: 5 },
        { target: 'health', value: 2, radius: 4 }
      ]
    }
  ],
  desert: [
    {
      id: 'desert_oasis',
      type: 'pond',
      position: { x: 0, y: 0, z: 0 },
      size: 1,
      flow: 30,
      quality: 75,
      effects: [
        { target: 'waterQuality', value: 2, radius: 3 },
        { target: 'health', value: 3, radius: 4 }
      ]
    }
  ],
  wetland: [
    {
      id: 'wetland_marsh',
      type: 'lake',
      position: { x: 0, y: 0, z: 0 },
      size: 3,
      flow: 20,
      quality: 80,
      effects: [
        { target: 'waterQuality', value: 4, radius: 6 },
        { target: 'biodiversity', value: 3, radius: 5 }
      ]
    }
  ]
};

// Initial regions data
export const initialRegions: Region[] = [
  {
    id: 'region_rainforest',
    type: 'rainforest',
    name: 'Amazon Basin',
    position: { x: -15, y: 0, z: 0 },
    size: { width: 10, height: 10 },
    health: 30,
    biodiversity: 25,
    waterQuality: 40,
    pollutionLevel: 60,
    plants: [],
    animals: [],
    waterSources: [],
    structures: [],
    activeEvents: []
  },
  {
    id: 'region_desert',
    type: 'desert',
    name: 'Sonoran Desert',
    position: { x: 0, y: 0, z: 0 },
    size: { width: 10, height: 10 },
    health: 20,
    biodiversity: 15,
    waterQuality: 10,
    pollutionLevel: 40,
    plants: [],
    animals: [],
    waterSources: [],
    structures: [],
    activeEvents: []
  },
  {
    id: 'region_wetland',
    type: 'wetland',
    name: 'Coastal Marshes',
    position: { x: 15, y: 0, z: 0 },
    size: { width: 10, height: 10 },
    health: 25,
    biodiversity: 30,
    waterQuality: 35,
    pollutionLevel: 70,
    plants: [],
    animals: [],
    waterSources: [],
    structures: [],
    activeEvents: []
  }
];

// Available actions by ecosystem type
export const availableActions = [
  {
    type: 'plantTree',
    name: 'Plant Native Trees',
    description: 'Introduce native tree species to improve ecosystem health and biodiversity.',
    cost: 10,
    techRequired: null,
    effects: [
      { target: 'health', value: 2, radius: 3 },
      { target: 'biodiversity', value: 1.5, radius: 2 }
    ],
    applicableRegions: ['rainforest', 'wetland', 'desert']
  },
  {
    type: 'introduceAnimal',
    name: 'Reintroduce Native Species',
    description: 'Reintroduce native animal species to restore ecological balance.',
    cost: 20,
    techRequired: null,
    effects: [
      { target: 'biodiversity', value: 3, radius: 4 }
    ],
    applicableRegions: ['rainforest', 'wetland', 'desert']
  },
  {
    type: 'createWaterSource',
    name: 'Create Water Source',
    description: 'Develop a water source to support the local ecosystem.',
    cost: 30,
    techRequired: null,
    effects: [
      { target: 'waterQuality', value: 4, radius: 5 },
      { target: 'health', value: 2, radius: 3 }
    ],
    applicableRegions: ['rainforest', 'wetland', 'desert']
  },
  {
    type: 'removeInvasive',
    name: 'Remove Invasive Species',
    description: 'Clear invasive species that harm the native ecosystem.',
    cost: 15,
    techRequired: null,
    effects: [
      { target: 'health', value: 1, radius: 2 },
      { target: 'biodiversity', value: 2, radius: 3 }
    ],
    applicableRegions: ['rainforest', 'wetland', 'desert']
  },
  {
    type: 'cleanPollution',
    name: 'Clean Pollution',
    description: 'Remove pollutants to improve environmental health.',
    cost: 25,
    techRequired: null,
    effects: [
      { target: 'pollutionLevel', value: -5, radius: 4 },
      { target: 'waterQuality', value: 3, radius: 3 }
    ],
    applicableRegions: ['rainforest', 'wetland', 'desert']
  },
  {
    type: 'buildStructure',
    name: 'Build Monitoring Station',
    description: 'Construct a station to monitor ecosystem health.',
    cost: 40,
    techRequired: 'basic_monitoring',
    effects: [
      { target: 'health', value: 0.5, radius: 6 },
      { target: 'pollutionLevel', value: -1, radius: 5 }
    ],
    applicableRegions: ['rainforest', 'wetland', 'desert']
  }
];

// Helper functions to generate ecosystem elements
export function generateRandomPosition(regionPosition: Position, regionSize: {width: number, height: number}): Position {
  // Calculate random position within region boundaries
  const halfWidth = regionSize.width / 2;
  const halfHeight = regionSize.height / 2;
  
  return {
    x: regionPosition.x + (Math.random() * regionSize.width - halfWidth),
    y: 0, // Keep at ground level for now
    z: regionPosition.z + (Math.random() * regionSize.height - halfHeight)
  };
}

// Get color based on ecosystem type
export function getEcosystemColor(type: EcosystemType): string {
  switch (type) {
    case 'rainforest':
      return '#2e7d32'; // Dark green
    case 'desert':
      return '#ffd54f'; // Sand yellow
    case 'wetland':
      return '#4fc3f7'; // Light blue
    default:
      return '#9e9e9e'; // Gray fallback
  }
}

// Get texture based on ecosystem type
export function getEcosystemTexture(type: EcosystemType): string {
  switch (type) {
    case 'rainforest':
      return '/textures/grass.png';
    case 'desert':
      return '/textures/sand.jpg';
    case 'wetland':
      return '/textures/grass.png'; // Using grass as a substitute
    default:
      return '/textures/sand.jpg';
  }
}

// Calculate health status from numerical value
export function getHealthStatus(health: number): 'critical' | 'poor' | 'recovering' | 'stable' | 'thriving' {
  if (health < 20) return 'critical';
  if (health < 40) return 'poor';
  if (health < 60) return 'recovering';
  if (health < 80) return 'stable';
  return 'thriving';
}

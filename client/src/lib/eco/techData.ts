import { Technology } from './types';

// Technology data with unlockable improvements
export const technologies: Technology[] = [
  {
    id: 'basic_monitoring',
    name: 'Basic Ecosystem Monitoring',
    description: 'Simple tools to monitor ecosystem health and track changes.',
    cost: 50,
    effects: [
      { type: 'efficiency', target: 'all_actions', value: 10 }
    ],
    prerequisite: null,
    unlocked: true,
    researched: false
  },
  {
    id: 'advanced_planting',
    name: 'Advanced Planting Techniques',
    description: 'Improved methods for planting and nurturing native vegetation.',
    cost: 75,
    effects: [
      { type: 'efficiency', target: 'plantTree', value: 25 },
      { type: 'costReduction', target: 'plantTree', value: 20 }
    ],
    prerequisite: 'basic_monitoring',
    unlocked: false,
    researched: false
  },
  {
    id: 'wildlife_tracking',
    name: 'Wildlife Tracking Systems',
    description: 'Technology to monitor and protect reintroduced animal species.',
    cost: 100,
    effects: [
      { type: 'efficiency', target: 'introduceAnimal', value: 30 },
      { type: 'newAbility', target: 'animal_monitoring', value: 1 }
    ],
    prerequisite: 'basic_monitoring',
    unlocked: false,
    researched: false
  },
  {
    id: 'water_purification',
    name: 'Water Purification Methods',
    description: 'Advanced techniques for cleaning and maintaining water sources.',
    cost: 125,
    effects: [
      { type: 'efficiency', target: 'createWaterSource', value: 35 },
      { type: 'efficiency', target: 'cleanPollution', value: 20 }
    ],
    prerequisite: 'basic_monitoring',
    unlocked: false,
    researched: false
  },
  {
    id: 'biodiversity_management',
    name: 'Biodiversity Management',
    description: 'Comprehensive approach to maintaining diverse ecosystem balance.',
    cost: 150,
    effects: [
      { type: 'efficiency', target: 'biodiversity', value: 30 },
      { type: 'efficiency', target: 'removeInvasive', value: 40 }
    ],
    prerequisite: 'advanced_planting',
    unlocked: false,
    researched: false
  },
  {
    id: 'drone_monitoring',
    name: 'Drone Monitoring Systems',
    description: 'Automated drones for widespread ecosystem monitoring and data collection.',
    cost: 200,
    effects: [
      { type: 'efficiency', target: 'all_monitoring', value: 50 },
      { type: 'newAbility', target: 'automated_data', value: 1 }
    ],
    prerequisite: 'wildlife_tracking',
    unlocked: false,
    researched: false
  },
  {
    id: 'sustainable_agriculture',
    name: 'Sustainable Agriculture',
    description: 'Farming methods that work with natural ecosystems rather than against them.',
    cost: 175,
    effects: [
      { type: 'efficiency', target: 'health', value: 25 },
      { type: 'costReduction', target: 'all_actions', value: 15 }
    ],
    prerequisite: 'biodiversity_management',
    unlocked: false,
    researched: false
  },
  {
    id: 'microbial_remediation',
    name: 'Microbial Remediation',
    description: 'Using microorganisms to clean polluted soil and water.',
    cost: 225,
    effects: [
      { type: 'efficiency', target: 'cleanPollution', value: 60 },
      { type: 'efficiency', target: 'waterQuality', value: 40 }
    ],
    prerequisite: 'water_purification',
    unlocked: false,
    researched: false
  },
  {
    id: 'ecosystem_engineering',
    name: 'Ecosystem Engineering',
    description: 'Advanced techniques for large-scale ecosystem restoration and design.',
    cost: 300,
    effects: [
      { type: 'efficiency', target: 'all_actions', value: 40 },
      { type: 'newAbility', target: 'create_biome', value: 1 }
    ],
    prerequisite: 'drone_monitoring',
    unlocked: false,
    researched: false
  }
];

// Technology tree structure for visualization
export const technologyTree = {
  root: 'basic_monitoring',
  branches: [
    {
      from: 'basic_monitoring',
      to: ['advanced_planting', 'wildlife_tracking', 'water_purification']
    },
    {
      from: 'advanced_planting',
      to: ['biodiversity_management']
    },
    {
      from: 'wildlife_tracking',
      to: ['drone_monitoring']
    },
    {
      from: 'water_purification',
      to: ['microbial_remediation']
    },
    {
      from: 'biodiversity_management',
      to: ['sustainable_agriculture']
    },
    {
      from: 'drone_monitoring',
      to: ['ecosystem_engineering']
    }
  ]
};

// Helper functions for technology management
export function getTechById(id: string): Technology | undefined {
  return technologies.find(tech => tech.id === id);
}

export function getUnlockedTechnologies(): Technology[] {
  return technologies.filter(tech => tech.unlocked && !tech.researched);
}

export function getResearchedTechnologies(): Technology[] {
  return technologies.filter(tech => tech.researched);
}

export function unlockTechnologiesAfterResearch(id: string): string[] {
  const newlyUnlocked: string[] = [];
  
  // Find branches where this tech unlocks others
  technologyTree.branches.forEach(branch => {
    if (branch.from === id) {
      branch.to.forEach(techId => {
        const tech = getTechById(techId);
        if (tech && !tech.unlocked) {
          tech.unlocked = true;
          newlyUnlocked.push(techId);
        }
      });
    }
  });
  
  return newlyUnlocked;
}

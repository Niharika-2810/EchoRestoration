// Ecosystem Types and Interfaces

export type EcosystemType = 'rainforest' | 'desert' | 'wetland';

export type HealthStatus = 'critical' | 'poor' | 'recovering' | 'stable' | 'thriving';

export interface Position {
  x: number;
  y: number;
  z: number;
}

// Region represents a specific ecosystem area on the map
export interface Region {
  id: string;
  type: EcosystemType;
  name: string;
  position: Position;
  size: { width: number; height: number };
  health: number; // 0-100
  biodiversity: number; // 0-100
  waterQuality: number; // 0-100
  pollutionLevel: number; // 0-100 (lower is better)
  plants: Plant[];
  animals: Animal[];
  waterSources: WaterSource[];
  structures: Structure[];
  activeEvents: GameEvent[];
}

// Plant represents flora that can be planted in regions
export interface Plant {
  id: string;
  species: string;
  position: Position;
  maturity: number; // 0-100
  health: number; // 0-100
  isNative: boolean;
  effects: ResourceEffect[];
}

// Animal represents fauna that can be introduced to regions
export interface Animal {
  id: string;
  species: string;
  position: Position;
  population: number;
  health: number; // 0-100
  isNative: boolean;
  effects: ResourceEffect[];
}

// WaterSource represents water bodies or systems
export interface WaterSource {
  id: string;
  type: 'river' | 'lake' | 'pond' | 'irrigation';
  position: Position;
  size: number; // Scale factor
  flow: number; // 0-100
  quality: number; // 0-100
  effects: ResourceEffect[];
}

// Structure represents player-built improvements
export interface Structure {
  id: string;
  type: string;
  name: string;
  position: Position;
  efficiency: number; // 0-100
  techRequired: string | null;
  effects: ResourceEffect[];
}

// ResourceEffect represents how an element affects the ecosystem
export interface ResourceEffect {
  target: 'health' | 'biodiversity' | 'waterQuality' | 'pollutionLevel';
  value: number; // Can be positive or negative
  radius: number; // Area of effect
}

// Technology represents unlockable improvements
export interface Technology {
  id: string;
  name: string;
  description: string;
  cost: number;
  effects: TechEffect[];
  prerequisite: string | null;
  unlocked: boolean;
  researched: boolean;
}

// TechEffect represents how technologies improve restoration efforts
export interface TechEffect {
  type: 'efficiency' | 'costReduction' | 'newAbility';
  target: string; // What is affected
  value: number; // Magnitude of effect
}

// GameEvent represents dynamic occurrences in the game
export interface GameEvent {
  id: string;
  name: string;
  description: string;
  duration: number; // In game cycles
  targetRegionTypes: EcosystemType[];
  effects: EventEffect[];
  choices?: EventChoice[];
  isActive: boolean;
  timeRemaining?: number;
}

// EventEffect represents how events impact the ecosystem
export interface EventEffect {
  target: 'health' | 'biodiversity' | 'waterQuality' | 'pollutionLevel' | 'plants' | 'animals' | 'water';
  value: number; // Impact magnitude
  duration: number; // How long the effect lasts
}

// EventChoice represents player decisions for events
export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  techRequired?: string; // Technology required to unlock this choice
}

// Player actions for ecosystem restoration
export type ActionType = 
  | 'plantTree' 
  | 'introduceAnimal' 
  | 'createWaterSource' 
  | 'removeInvasive' 
  | 'cleanPollution'
  | 'buildStructure';

export interface Action {
  type: ActionType;
  name: string;
  description: string;
  cost: number;
  techRequired: string | null;
  effects: ResourceEffect[];
  applicableRegions: EcosystemType[];
}

// Game state management
export interface GameState {
  cycle: number; // Game time unit
  score: number;
  resources: number;
  selectedRegion: string | null;
  regions: Region[];
  availableTechnologies: Technology[];
  possibleEvents: GameEvent[];
  activeEvents: GameEvent[];
  completedObjectives: string[];
}

// Statistics for tracking player progress
export interface GameStats {
  regionsRestored: number;
  plantsPlanted: number;
  animalsIntroduced: number;
  pollutionCleaned: number;
  technologiesResearched: number;
  eventsResolved: number;
  totalScore: number;
}

import { create } from "zustand";
import { Region, Plant, Animal, WaterSource, Position, Structure, ActionType, GameStats } from "../eco/types";
import { initialRegions, plantTemplates, animalTemplates, waterSourceTemplates, availableActions, generateRandomPosition } from "../eco/ecosystemData";
import { getRandomEvent, calculateEventChance } from "../eco/eventData";
import { subscribeWithSelector } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import { useAudio } from "./useAudio";

interface EcosystemState {
  // Game state
  cycle: number;
  score: number;
  resources: number;
  selectedRegionId: string | null;
  selectedPosition: Position | null;
  
  // Ecosystem data
  regions: Region[];
  stats: GameStats;
  
  // Actions
  incrementCycle: () => void;
  selectRegion: (regionId: string | null) => void;
  selectPosition: (position: Position | null) => void;
  addResources: (amount: number) => void;
  
  // Ecosystem management actions
  plantTree: (regionId: string, position: Position, plantType: string) => void;
  introduceAnimal: (regionId: string, position: Position, animalType: string) => void;
  createWaterSource: (regionId: string, position: Position, waterType: string) => void;
  buildStructure: (regionId: string, position: Position, structureType: string) => void;
  removeInvasive: (regionId: string, position: Position) => void;
  cleanPollution: (regionId: string, position: Position) => void;
  performAction: (actionType: ActionType, regionId: string, position: Position, entityType?: string) => boolean;
  
  // Event and update functions
  triggerRandomEvent: (regionId: string) => void;
  updateEcosystems: () => void;
}

export const useEcosystem = create<EcosystemState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    cycle: 1,
    score: 0,
    resources: 100,
    selectedRegionId: null,
    selectedPosition: null,
    regions: [...initialRegions],
    stats: {
      regionsRestored: 0,
      plantsPlanted: 0,
      animalsIntroduced: 0,
      pollutionCleaned: 0,
      technologiesResearched: 0,
      eventsResolved: 0,
      totalScore: 0
    },
    
    // Game cycle progression
    incrementCycle: () => {
      set((state) => ({ 
        cycle: state.cycle + 1,
        resources: state.resources + 15 // Base resource gain per cycle
      }));
      
      // Update ecosystems when cycle changes
      get().updateEcosystems();
      
      // Chance for random events based on region health
      get().regions.forEach(region => {
        const eventChance = calculateEventChance(region.health);
        if (Math.random() < eventChance) {
          get().triggerRandomEvent(region.id);
        }
      });
    },
    
    // Region selection
    selectRegion: (regionId) => {
      set({ selectedRegionId: regionId, selectedPosition: null });
    },
    
    // Position selection within a region
    selectPosition: (position) => {
      set({ selectedPosition: position });
    },
    
    // Add resources (from events, tech, etc.)
    addResources: (amount) => {
      set((state) => ({ resources: state.resources + amount }));
    },
    
    // Plant a tree in the selected region
    plantTree: (regionId, position, plantType) => {
      set((state) => {
        const regionIndex = state.regions.findIndex(r => r.id === regionId);
        if (regionIndex === -1) return state;
        
        const region = state.regions[regionIndex];
        const template = plantTemplates[region.type].find(p => p.species === plantType);
        
        if (!template) return state;
        
        const newPlant: Plant = {
          ...template,
          id: `plant_${uuid()}`,
          position,
          maturity: 0 // Start as seedling
        };
        
        const updatedRegions = [...state.regions];
        updatedRegions[regionIndex] = {
          ...region,
          plants: [...region.plants, newPlant]
        };
        
        // Play sound effect
        useAudio.getState().playSuccess();
        
        return {
          regions: updatedRegions,
          stats: {
            ...state.stats,
            plantsPlanted: state.stats.plantsPlanted + 1
          }
        };
      });
    },
    
    // Introduce animal species
    introduceAnimal: (regionId, position, animalType) => {
      set((state) => {
        const regionIndex = state.regions.findIndex(r => r.id === regionId);
        if (regionIndex === -1) return state;
        
        const region = state.regions[regionIndex];
        const template = animalTemplates[region.type].find(a => a.species === animalType);
        
        if (!template) return state;
        
        const newAnimal: Animal = {
          ...template,
          id: `animal_${uuid()}`,
          position
        };
        
        const updatedRegions = [...state.regions];
        updatedRegions[regionIndex] = {
          ...region,
          animals: [...region.animals, newAnimal]
        };
        
        // Play sound effect
        useAudio.getState().playSuccess();
        
        return {
          regions: updatedRegions,
          stats: {
            ...state.stats,
            animalsIntroduced: state.stats.animalsIntroduced + 1
          }
        };
      });
    },
    
    // Create water source
    createWaterSource: (regionId, position, waterType) => {
      set((state) => {
        const regionIndex = state.regions.findIndex(r => r.id === regionId);
        if (regionIndex === -1) return state;
        
        const region = state.regions[regionIndex];
        const template = waterSourceTemplates[region.type].find(w => w.type === waterType);
        
        if (!template) return state;
        
        const newWaterSource: WaterSource = {
          ...template,
          id: `water_${uuid()}`,
          position
        };
        
        const updatedRegions = [...state.regions];
        updatedRegions[regionIndex] = {
          ...region,
          waterSources: [...region.waterSources, newWaterSource]
        };
        
        // Play sound effect
        useAudio.getState().playSuccess();
        
        return { regions: updatedRegions };
      });
    },
    
    // Build technology structure
    buildStructure: (regionId, position, structureType) => {
      set((state) => {
        const regionIndex = state.regions.findIndex(r => r.id === regionId);
        if (regionIndex === -1) return state;
        
        const region = state.regions[regionIndex];
        
        const newStructure: Structure = {
          id: `structure_${uuid()}`,
          type: structureType,
          name: structureType === 'monitoring' ? 'Monitoring Station' : 'Research Outpost',
          position,
          efficiency: 100,
          techRequired: 'basic_monitoring',
          effects: [
            { target: 'health', value: 1, radius: 5 },
            { target: 'pollutionLevel', value: -2, radius: 4 }
          ]
        };
        
        const updatedRegions = [...state.regions];
        updatedRegions[regionIndex] = {
          ...region,
          structures: [...region.structures, newStructure]
        };
        
        // Play sound effect
        useAudio.getState().playSuccess();
        
        return { regions: updatedRegions };
      });
    },
    
    // Remove invasive species
    removeInvasive: (regionId, position) => {
      set((state) => {
        const regionIndex = state.regions.findIndex(r => r.id === regionId);
        if (regionIndex === -1) return state;
        
        const region = state.regions[regionIndex];
        
        // Simulate removing invasive species - improve biodiversity
        const updatedRegion = {
          ...region,
          biodiversity: Math.min(100, region.biodiversity + 5),
          health: Math.min(100, region.health + 3)
        };
        
        const updatedRegions = [...state.regions];
        updatedRegions[regionIndex] = updatedRegion;
        
        // Play sound effect
        useAudio.getState().playHit();
        
        return { regions: updatedRegions };
      });
    },
    
    // Clean pollution
    cleanPollution: (regionId, position) => {
      set((state) => {
        const regionIndex = state.regions.findIndex(r => r.id === regionId);
        if (regionIndex === -1) return state;
        
        const region = state.regions[regionIndex];
        
        // Reduce pollution level and improve water quality
        const updatedRegion = {
          ...region,
          pollutionLevel: Math.max(0, region.pollutionLevel - 8),
          waterQuality: Math.min(100, region.waterQuality + 5)
        };
        
        const updatedRegions = [...state.regions];
        updatedRegions[regionIndex] = updatedRegion;
        
        // Play sound effect
        useAudio.getState().playHit();
        
        return {
          regions: updatedRegions,
          stats: {
            ...state.stats,
            pollutionCleaned: state.stats.pollutionCleaned + 1
          }
        };
      });
    },
    
    // Unified method to perform actions with cost checking
    performAction: (actionType, regionId, position, entityType) => {
      const { resources, regions } = get();
      
      // Find the action details
      const action = availableActions.find(a => a.type === actionType);
      if (!action) return false;
      
      // Check if we have enough resources
      if (resources < action.cost) {
        console.log("Not enough resources for this action");
        return false;
      }
      
      // Check if the region exists
      const region = regions.find(r => r.id === regionId);
      if (!region) return false;
      
      // Check if action is applicable to this region type
      if (!action.applicableRegions.includes(region.type)) {
        console.log("This action is not applicable to this region type");
        return false;
      }
      
      // Deduct resources
      set((state) => ({ resources: state.resources - action.cost }));
      
      // Perform the action
      switch(actionType) {
        case 'plantTree':
          get().plantTree(regionId, position, entityType || 'default');
          break;
        case 'introduceAnimal':
          get().introduceAnimal(regionId, position, entityType || 'default');
          break;
        case 'createWaterSource':
          get().createWaterSource(regionId, position, entityType || 'pond');
          break;
        case 'buildStructure':
          get().buildStructure(regionId, position, entityType || 'monitoring');
          break;
        case 'removeInvasive':
          get().removeInvasive(regionId, position);
          break;
        case 'cleanPollution':
          get().cleanPollution(regionId, position);
          break;
      }
      
      // Update score
      set((state) => ({ score: state.score + action.cost / 2 }));
      
      return true;
    },
    
    // Trigger a random event in a region
    triggerRandomEvent: (regionId) => {
      set((state) => {
        const regionIndex = state.regions.findIndex(r => r.id === regionId);
        if (regionIndex === -1) return state;
        
        const region = state.regions[regionIndex];
        const event = getRandomEvent(region.type);
        
        if (!event) return state;
        
        // Mark event as active and add it to the region
        event.isActive = true;
        event.timeRemaining = event.duration;
        
        const updatedRegions = [...state.regions];
        updatedRegions[regionIndex] = {
          ...region,
          activeEvents: [...region.activeEvents, event]
        };
        
        // Play hit sound to alert player
        useAudio.getState().playHit();
        
        return { regions: updatedRegions };
      });
    },
    
    // Update ecosystem state each cycle
    updateEcosystems: () => {
      set((state) => {
        const updatedRegions = state.regions.map(region => {
          // Calculate effects from plants, animals, etc.
          let healthChange = 0;
          let biodiversityChange = 0;
          let waterQualityChange = 0;
          let pollutionChange = 0;
          
          // Process plant effects
          region.plants.forEach(plant => {
            plant.effects.forEach(effect => {
              switch (effect.target) {
                case 'health':
                  healthChange += effect.value * (plant.maturity / 100);
                  break;
                case 'biodiversity':
                  biodiversityChange += effect.value * (plant.maturity / 100);
                  break;
                case 'waterQuality':
                  waterQualityChange += effect.value * (plant.maturity / 100);
                  break;
                case 'pollutionLevel':
                  pollutionChange += effect.value * (plant.maturity / 100);
                  break;
              }
            });
          });
          
          // Process animal effects
          region.animals.forEach(animal => {
            animal.effects.forEach(effect => {
              switch (effect.target) {
                case 'health':
                  healthChange += effect.value * (animal.health / 100);
                  break;
                case 'biodiversity':
                  biodiversityChange += effect.value * (animal.health / 100);
                  break;
                case 'waterQuality':
                  waterQualityChange += effect.value * (animal.health / 100);
                  break;
                case 'pollutionLevel':
                  pollutionChange += effect.value * (animal.health / 100);
                  break;
              }
            });
          });
          
          // Process water source effects
          region.waterSources.forEach(water => {
            water.effects.forEach(effect => {
              switch (effect.target) {
                case 'health':
                  healthChange += effect.value * (water.quality / 100);
                  break;
                case 'biodiversity':
                  biodiversityChange += effect.value * (water.quality / 100);
                  break;
                case 'waterQuality':
                  waterQualityChange += effect.value * (water.quality / 100);
                  break;
                case 'pollutionLevel':
                  pollutionChange += effect.value * (water.quality / 100);
                  break;
              }
            });
          });
          
          // Process structure effects
          region.structures.forEach(structure => {
            structure.effects.forEach(effect => {
              switch (effect.target) {
                case 'health':
                  healthChange += effect.value * (structure.efficiency / 100);
                  break;
                case 'biodiversity':
                  biodiversityChange += effect.value * (structure.efficiency / 100);
                  break;
                case 'waterQuality':
                  waterQualityChange += effect.value * (structure.efficiency / 100);
                  break;
                case 'pollutionLevel':
                  pollutionChange += effect.value * (structure.efficiency / 100);
                  break;
              }
            });
          });
          
          // Process active events and their effects
          const remainingEvents = region.activeEvents.filter(event => {
            if (event.timeRemaining === undefined || event.timeRemaining <= 0) {
              return false; // Event has ended
            }
            
            // Apply event effects
            event.effects.forEach(effect => {
              switch (effect.target) {
                case 'health':
                  healthChange += effect.value;
                  break;
                case 'biodiversity':
                  biodiversityChange += effect.value;
                  break;
                case 'waterQuality':
                  waterQualityChange += effect.value;
                  break;
                case 'pollutionLevel':
                  pollutionChange += Math.abs(effect.value); // Ensure pollution is positive
                  break;
                case 'plants':
                  // Damage to plants would be handled separately
                  break;
                case 'animals':
                  // Damage to animals would be handled separately
                  break;
                case 'water':
                  // Damage to water would be handled separately
                  break;
              }
            });
            
            // Reduce time remaining
            return {
              ...event,
              timeRemaining: (event.timeRemaining || event.duration) - 1
            };
          });
          
          // Update plants' maturity
          const updatedPlants = region.plants.map(plant => ({
            ...plant,
            maturity: Math.min(100, plant.maturity + 2) // Grow by 2% per cycle
          }));
          
          // Calculate new region stats with constraints
          return {
            ...region,
            health: Math.max(0, Math.min(100, region.health + healthChange / 10)),
            biodiversity: Math.max(0, Math.min(100, region.biodiversity + biodiversityChange / 10)),
            waterQuality: Math.max(0, Math.min(100, region.waterQuality + waterQualityChange / 10)),
            pollutionLevel: Math.max(0, Math.min(100, region.pollutionLevel + pollutionChange / 10)),
            plants: updatedPlants,
            activeEvents: remainingEvents
          };
        });
        
        // Calculate restored regions
        const restoredRegions = updatedRegions.filter(
          r => r.health >= 80 && r.biodiversity >= 70 && r.waterQuality >= 75 && r.pollutionLevel <= 20
        ).length;
        
        // Update overall score based on ecosystem improvements
        const totalEcosystemStats = updatedRegions.reduce(
          (total, region) => {
            return {
              health: total.health + region.health,
              biodiversity: total.biodiversity + region.biodiversity,
              waterQuality: total.waterQuality + region.waterQuality,
              pollution: total.pollution + (100 - region.pollutionLevel) // Invert for scoring
            };
          },
          { health: 0, biodiversity: 0, waterQuality: 0, pollution: 0 }
        );
        
        const newScore = Math.floor(
          (totalEcosystemStats.health + 
           totalEcosystemStats.biodiversity + 
           totalEcosystemStats.waterQuality + 
           totalEcosystemStats.pollution) / 4
        );
        
        return {
          regions: updatedRegions,
          score: newScore,
          stats: {
            ...state.stats,
            regionsRestored: restoredRegions,
            totalScore: newScore
          }
        };
      });
    }
  }))
);

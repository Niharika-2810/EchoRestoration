import { create } from "zustand";
import { Technology } from "../eco/types";
import { technologies, getTechById, unlockTechnologiesAfterResearch } from "../eco/techData";
import { subscribeWithSelector } from "zustand/middleware";
import { useAudio } from "./useAudio";

interface TechnologyState {
  // Technology data
  technologies: Technology[];
  selectedTechId: string | null;
  researchProgress: Record<string, number>; // Progress percentage for each tech
  
  // Actions
  selectTechnology: (techId: string | null) => void;
  startResearch: (techId: string) => boolean;
  continueResearch: (techId: string, progressAmount: number) => void;
  completeResearch: (techId: string) => string[];
  isTechResearched: (techId: string) => boolean;
  getResearchedTechs: () => Technology[];
  getAvailableTechs: () => Technology[];
  getTechEfficiencyBonus: (actionType: string) => number;
  getTechCostReduction: (actionType: string) => number;
  hasTechWithAbility: (abilityName: string) => boolean;
}

export const useTechnology = create<TechnologyState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    technologies: [...technologies],
    selectedTechId: null,
    researchProgress: {},
    
    // Select a technology to view details or research
    selectTechnology: (techId) => {
      set({ selectedTechId: techId });
    },
    
    // Start researching a technology (if resources are available)
    startResearch: (techId) => {
      const tech = get().technologies.find(t => t.id === techId);
      
      if (!tech || tech.researched || !tech.unlocked) {
        console.log("Technology can't be researched");
        return false;
      }
      
      // Initialize research progress
      set((state) => ({
        researchProgress: {
          ...state.researchProgress,
          [techId]: state.researchProgress[techId] || 0
        }
      }));
      
      return true;
    },
    
    // Continue researching a technology
    continueResearch: (techId, progressAmount) => {
      set((state) => {
        const currentProgress = state.researchProgress[techId] || 0;
        const newProgress = Math.min(100, currentProgress + progressAmount);
        
        return {
          researchProgress: {
            ...state.researchProgress,
            [techId]: newProgress
          }
        };
      });
      
      // Check if research is complete
      const progress = get().researchProgress[techId] || 0;
      if (progress >= 100) {
        // Complete the research
        get().completeResearch(techId);
      }
    },
    
    // Complete research and unlock dependent technologies
    completeResearch: (techId) => {
      const updatedTechs = get().technologies.map(tech => {
        if (tech.id === techId) {
          return { ...tech, researched: true };
        }
        return tech;
      });
      
      set({ technologies: updatedTechs });
      
      // Unlock dependent technologies
      const newlyUnlocked = unlockTechnologiesAfterResearch(techId);
      
      if (newlyUnlocked.length > 0) {
        // Update unlocked status
        set((state) => ({
          technologies: state.technologies.map(tech => {
            if (newlyUnlocked.includes(tech.id)) {
              return { ...tech, unlocked: true };
            }
            return tech;
          })
        }));
        
        // Play success sound
        useAudio.getState().playSuccess();
      }
      
      return newlyUnlocked;
    },
    
    // Check if a tech is researched
    isTechResearched: (techId) => {
      const tech = get().technologies.find(t => t.id === techId);
      return tech ? tech.researched : false;
    },
    
    // Get all researched technologies
    getResearchedTechs: () => {
      return get().technologies.filter(tech => tech.researched);
    },
    
    // Get all available (unlocked but not researched) technologies
    getAvailableTechs: () => {
      return get().technologies.filter(tech => tech.unlocked && !tech.researched);
    },
    
    // Get efficiency bonus for a specific action type from all researched techs
    getTechEfficiencyBonus: (actionType) => {
      return get().getResearchedTechs().reduce((total, tech) => {
        const relevantEffects = tech.effects.filter(
          effect => effect.type === 'efficiency' && 
            (effect.target === actionType || effect.target === 'all_actions')
        );
        
        return total + relevantEffects.reduce((sum, effect) => sum + effect.value, 0);
      }, 0);
    },
    
    // Get cost reduction for a specific action type from all researched techs
    getTechCostReduction: (actionType) => {
      return get().getResearchedTechs().reduce((total, tech) => {
        const relevantEffects = tech.effects.filter(
          effect => effect.type === 'costReduction' && 
            (effect.target === actionType || effect.target === 'all_actions')
        );
        
        return total + relevantEffects.reduce((sum, effect) => sum + effect.value, 0);
      }, 0);
    },
    
    // Check if any researched tech has a specific ability
    hasTechWithAbility: (abilityName) => {
      return get().getResearchedTechs().some(tech => 
        tech.effects.some(
          effect => effect.type === 'newAbility' && effect.target === abilityName
        )
      );
    }
  }))
);

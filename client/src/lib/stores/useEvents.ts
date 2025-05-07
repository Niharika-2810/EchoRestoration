import { create } from "zustand";
import { GameEvent, EventEffect, EventChoice } from "../eco/types";
import { gameEvents, processEventChoice } from "../eco/eventData";
import { subscribeWithSelector } from "zustand/middleware";
import { useEcosystem } from "./useEcosystem";
import { useAudio } from "./useAudio";

interface EventsState {
  // Active events
  possibleEvents: GameEvent[];
  activeEvents: GameEvent[]; // Currently active events across all regions
  eventHistory: string[]; // IDs of past events
  
  // Current event being handled by player
  currentEvent: GameEvent | null;
  
  // Actions
  initializeEvents: () => void;
  triggerEvent: (regionId: string, eventId: string) => void;
  handleEventChoice: (eventId: string, choiceId: string) => void;
  resolveEvent: (eventId: string) => void;
  dismissEvent: () => void;
  
  // Status
  hasActiveEvent: () => boolean;
  getActiveRegionEvents: (regionId: string) => GameEvent[];
  
  // Add custom event
  addCustomEvent: (event: GameEvent) => void;
}

export const useEvents = create<EventsState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    possibleEvents: [...gameEvents],
    activeEvents: [],
    eventHistory: [],
    currentEvent: null,
    
    // Initialize event system
    initializeEvents: () => {
      set({ 
        possibleEvents: [...gameEvents],
        activeEvents: [],
        eventHistory: []
      });
    },
    
    // Trigger a specific event in a region
    triggerEvent: (regionId, eventId) => {
      const event = get().possibleEvents.find(e => e.id === eventId);
      
      if (!event) {
        console.error(`Event with ID ${eventId} not found`);
        return;
      }
      
      // Clone the event and set it as active
      const newEvent: GameEvent = {
        ...event,
        isActive: true,
        timeRemaining: event.duration
      };
      
      // Add to active events
      set((state) => ({
        activeEvents: [...state.activeEvents, newEvent],
        currentEvent: newEvent // Set as current event to handle
      }));
      
      // Add event to the region
      const { regions } = useEcosystem.getState();
      const regionIndex = regions.findIndex(r => r.id === regionId);
      
      if (regionIndex !== -1) {
        const updatedRegions = [...regions];
        updatedRegions[regionIndex] = {
          ...updatedRegions[regionIndex],
          activeEvents: [...updatedRegions[regionIndex].activeEvents, newEvent]
        };
        
        useEcosystem.setState({ regions: updatedRegions });
        
        // Play hit sound to alert player
        useAudio.getState().playHit();
      }
    },
    
    // Handle player's choice for an event
    handleEventChoice: (eventId, choiceId) => {
      const event = get().activeEvents.find(e => e.id === eventId);
      
      if (!event) {
        console.error(`Active event with ID ${eventId} not found`);
        return;
      }
      
      // Process effects of the choice
      const choiceEffects = processEventChoice(event, choiceId);
      
      if (!choiceEffects) {
        console.error(`Choice ${choiceId} not found or has no effects`);
        return;
      }
      
      // Apply effects to affected regions
      const { regions } = useEcosystem.getState();
      const updatedRegions = regions.map(region => {
        // Check if this region has this event
        const hasEvent = region.activeEvents.some(e => e.id === eventId);
        
        if (!hasEvent) return region;
        
        // Apply choice effects to this region
        const updatedStats = { ...region };
        
        choiceEffects.forEach(effect => {
          switch (effect.target) {
            case 'health':
              updatedStats.health = Math.max(0, Math.min(100, region.health + effect.value));
              break;
            case 'biodiversity':
              updatedStats.biodiversity = Math.max(0, Math.min(100, region.biodiversity + effect.value));
              break;
            case 'waterQuality':
              updatedStats.waterQuality = Math.max(0, Math.min(100, region.waterQuality + effect.value));
              break;
            case 'pollutionLevel':
              updatedStats.pollutionLevel = Math.max(0, Math.min(100, region.pollutionLevel + effect.value));
              break;
            // Additional effect targets would be handled here
          }
        });
        
        return updatedStats;
      });
      
      useEcosystem.setState({ regions: updatedRegions });
      
      // Add event to history and resolve it
      get().resolveEvent(eventId);
      
      // Play success sound
      useAudio.getState().playSuccess();
    },
    
    // Resolve an event (remove from active events)
    resolveEvent: (eventId) => {
      // Remove from active events
      set((state) => ({
        activeEvents: state.activeEvents.filter(e => e.id !== eventId),
        eventHistory: [...state.eventHistory, eventId],
        currentEvent: null
      }));
      
      // Remove from regions
      const { regions } = useEcosystem.getState();
      const updatedRegions = regions.map(region => ({
        ...region,
        activeEvents: region.activeEvents.filter(e => e.id !== eventId)
      }));
      
      useEcosystem.setState({ regions: updatedRegions });
    },
    
    // Dismiss the current event UI
    dismissEvent: () => {
      set({ currentEvent: null });
    },
    
    // Check if there's an active event being displayed
    hasActiveEvent: () => {
      return get().currentEvent !== null;
    },
    
    // Get all active events for a specific region
    getActiveRegionEvents: (regionId) => {
      const { regions } = useEcosystem.getState();
      const region = regions.find(r => r.id === regionId);
      
      if (!region) return [];
      
      return region.activeEvents;
    },
    
    // Add a custom event to the game
    addCustomEvent: (event) => {
      set((state) => ({
        possibleEvents: [...state.possibleEvents, event]
      }));
    }
  }))
);

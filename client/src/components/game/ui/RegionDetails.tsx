import { useMemo } from "react";
import { Region } from "../../../lib/eco/types";
import { getHealthStatus } from "../../../lib/eco/ecosystemData";

interface RegionDetailsProps {
  region: Region;
}

function RegionDetails({ region }: RegionDetailsProps) {
  // Get display color based on health status
  const healthColor = useMemo(() => {
    const status = getHealthStatus(region.health);
    switch (status) {
      case 'critical': return 'text-red-500';
      case 'poor': return 'text-orange-500';
      case 'recovering': return 'text-yellow-500';
      case 'stable': return 'text-blue-500';
      case 'thriving': return 'text-green-500';
      default: return 'text-white';
    }
  }, [region.health]);
  
  // Get display color for pollution level (inverse - lower is better)
  const pollutionColor = useMemo(() => {
    if (region.pollutionLevel < 20) return 'text-green-500';
    if (region.pollutionLevel < 40) return 'text-blue-500';
    if (region.pollutionLevel < 60) return 'text-yellow-500';
    if (region.pollutionLevel < 80) return 'text-orange-500';
    return 'text-red-500';
  }, [region.pollutionLevel]);
  
  // Format region type for display
  const formattedType = region.type.charAt(0).toUpperCase() + region.type.slice(1);
  
  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-2">{region.name}</h2>
      <div className="text-sm text-gray-400 mb-4">Type: {formattedType}</div>
      
      <div className="space-y-4">
        {/* Region health metrics */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ecosystem Status</h3>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1">
                <span>Health:</span>
                <span className={healthColor}>{region.health.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-full rounded-full ${healthColor.replace('text', 'bg')}`} style={{ width: `${region.health}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Biodiversity:</span>
                <span className="text-green-500">{region.biodiversity.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${region.biodiversity}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Water Quality:</span>
                <span className="text-blue-500">{region.waterQuality.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${region.waterQuality}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span>Pollution Level:</span>
                <span className={pollutionColor}>{region.pollutionLevel.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-full rounded-full ${pollutionColor.replace('text', 'bg')}`} style={{ width: `${region.pollutionLevel}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Region ecosystem elements */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ecosystem Elements</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-green-400">Plants:</span> {region.plants.length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-yellow-400">Animals:</span> {region.animals.length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-blue-400">Water Sources:</span> {region.waterSources.length}
            </div>
            <div className="bg-gray-700 p-2 rounded">
              <span className="text-purple-400">Structures:</span> {region.structures.length}
            </div>
          </div>
        </div>
        
        {/* Active events */}
        {region.activeEvents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-red-400">Active Events</h3>
            
            <div className="space-y-2">
              {region.activeEvents.map(event => (
                <div key={event.id} className="bg-red-900 bg-opacity-50 p-2 rounded border border-red-700">
                  <div className="font-medium text-red-300">{event.name}</div>
                  <div className="text-xs text-gray-300">
                    Remaining: {event.timeRemaining || event.duration} cycles
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Region status summary */}
        <div className="mt-6 p-3 rounded bg-gray-700">
          <h3 className="font-semibold text-center">Restoration Status</h3>
          <div className="text-center mt-1">
            <span className={`text-lg font-bold ${healthColor}`}>
              {getHealthStatus(region.health).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegionDetails;

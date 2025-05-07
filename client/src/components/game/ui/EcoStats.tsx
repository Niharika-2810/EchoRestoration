import { useMemo } from "react";
import { useEcosystem } from "../../../lib/stores/useEcosystem";
import { useTechnology } from "../../../lib/stores/useTechnology";
import { getHealthStatus } from "../../../lib/eco/ecosystemData";

interface EcoStatsProps {
  onClose: () => void;
}

function EcoStats({ onClose }: EcoStatsProps) {
  const { regions, cycle, score, stats, resources } = useEcosystem();
  const { technologies } = useTechnology();
  
  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (regions.length === 0) return { health: 0, biodiversity: 0, waterQuality: 0, pollution: 0 };
    
    const totals = regions.reduce(
      (acc, region) => {
        return {
          health: acc.health + region.health,
          biodiversity: acc.biodiversity + region.biodiversity,
          waterQuality: acc.waterQuality + region.waterQuality,
          pollution: acc.pollution + region.pollutionLevel
        };
      },
      { health: 0, biodiversity: 0, waterQuality: 0, pollution: 0 }
    );
    
    // Calculate averages
    return {
      health: totals.health / regions.length,
      biodiversity: totals.biodiversity / regions.length,
      waterQuality: totals.waterQuality / regions.length,
      pollution: totals.pollution / regions.length
    };
  }, [regions]);
  
  // Get status color
  const getStatusColor = (value: number, inverse = false) => {
    const normalizedValue = inverse ? 100 - value : value;
    
    if (normalizedValue >= 80) return "text-green-500";
    if (normalizedValue >= 60) return "text-blue-500";
    if (normalizedValue >= 40) return "text-yellow-500";
    if (normalizedValue >= 20) return "text-orange-500";
    return "text-red-500";
  };
  
  // Calculate game progress
  const gameProgress = useMemo(() => {
    // Progress is a combination of:
    // - Regions restored (biggest factor)
    // - Overall ecosystem health
    // - Technologies researched
    
    const restoredRegionsWeight = 0.5;
    const ecosystemHealthWeight = 0.3;
    const technologiesWeight = 0.2;
    
    const restoredRatio = stats.regionsRestored / regions.length;
    const ecosystemHealthRatio = (
      overallStats.health + 
      overallStats.biodiversity + 
      overallStats.waterQuality + 
      (100 - overallStats.pollution)
    ) / 400; // Average of 4 metrics, each 0-100
    
    const researchedTechs = technologies.filter(t => t.researched).length;
    const techRatio = researchedTechs / technologies.length;
    
    return Math.min(100, Math.round(
      (restoredRatio * restoredRegionsWeight * 100) +
      (ecosystemHealthRatio * ecosystemHealthWeight * 100) +
      (techRatio * technologiesWeight * 100)
    ));
  }, [stats, overallStats, technologies, regions.length]);
  
  return (
    <div className="w-4/5 h-4/5 bg-gray-800 rounded-lg p-6 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-2xl font-bold text-white">Ecosystem Statistics</h2>
        <button 
          onClick={onClose}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Close
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Top stats row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-xl text-yellow-400 font-bold">{score}</div>
            <div className="text-gray-400">Total Score</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-xl text-blue-400 font-bold">{cycle}</div>
            <div className="text-gray-400">Current Cycle</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-xl text-green-400 font-bold">{resources}</div>
            <div className="text-gray-400">Available Resources</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-xl text-purple-400 font-bold">
              {technologies.filter(t => t.researched).length}/{technologies.length}
            </div>
            <div className="text-gray-400">Technologies Researched</div>
          </div>
        </div>
        
        {/* Global ecosystem health */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Global Ecosystem Health</h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">Average Health:</span>
                <span className={getStatusColor(overallStats.health)}>
                  {overallStats.health.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-full rounded-full ${getStatusColor(overallStats.health).replace('text', 'bg')}`} 
                  style={{ width: `${overallStats.health}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">Average Biodiversity:</span>
                <span className={getStatusColor(overallStats.biodiversity)}>
                  {overallStats.biodiversity.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-full rounded-full ${getStatusColor(overallStats.biodiversity).replace('text', 'bg')}`} 
                  style={{ width: `${overallStats.biodiversity}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">Average Water Quality:</span>
                <span className={getStatusColor(overallStats.waterQuality)}>
                  {overallStats.waterQuality.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-full rounded-full ${getStatusColor(overallStats.waterQuality).replace('text', 'bg')}`} 
                  style={{ width: `${overallStats.waterQuality}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-300">Average Pollution Level:</span>
                <span className={getStatusColor(overallStats.pollution, true)}>
                  {overallStats.pollution.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-full rounded-full ${getStatusColor(overallStats.pollution, true).replace('text', 'bg')}`} 
                  style={{ width: `${overallStats.pollution}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Restoration statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Restoration Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Regions Restored:</span>
                <span className="font-bold text-green-400">{stats.regionsRestored}/{regions.length}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Plants Planted:</span>
                <span className="font-bold text-green-400">{stats.plantsPlanted}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Animals Introduced:</span>
                <span className="font-bold text-green-400">{stats.animalsIntroduced}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Pollution Cleaned:</span>
                <span className="font-bold text-green-400">{stats.pollutionCleaned}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Game Progress</h3>
            <div className="flex flex-col items-center justify-center h-32">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#333"
                    strokeWidth="10"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      gameProgress >= 75 ? "#4caf50" :
                      gameProgress >= 50 ? "#2196f3" :
                      gameProgress >= 25 ? "#ff9800" : "#f44336"
                    }
                    strokeWidth="10"
                    strokeDasharray={`${gameProgress * 2.83} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${
                    gameProgress >= 75 ? "text-green-400" :
                    gameProgress >= 50 ? "text-blue-400" :
                    gameProgress >= 25 ? "text-orange-400" : "text-red-400"
                  }`}>
                    {gameProgress}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Region comparison */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-3">Region Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left">Region</th>
                  <th className="py-2 text-center">Type</th>
                  <th className="py-2 text-center">Health</th>
                  <th className="py-2 text-center">Biodiversity</th>
                  <th className="py-2 text-center">Water Quality</th>
                  <th className="py-2 text-center">Pollution</th>
                  <th className="py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {regions.map(region => (
                  <tr key={region.id} className="border-b border-gray-800">
                    <td className="py-2 text-left">{region.name}</td>
                    <td className="py-2 text-center">
                      {region.type.charAt(0).toUpperCase() + region.type.slice(1)}
                    </td>
                    <td className="py-2 text-center">
                      <span className={getStatusColor(region.health)}>
                        {region.health.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={getStatusColor(region.biodiversity)}>
                        {region.biodiversity.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={getStatusColor(region.waterQuality)}>
                        {region.waterQuality.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={getStatusColor(region.pollutionLevel, true)}>
                        {region.pollutionLevel.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        region.health >= 80 && region.biodiversity >= 70 &&
                        region.waterQuality >= 75 && region.pollutionLevel <= 20
                          ? "bg-green-900 text-green-300"
                          : "bg-gray-700 text-gray-300"
                      }`}>
                        {region.health >= 80 && region.biodiversity >= 70 &&
                         region.waterQuality >= 75 && region.pollutionLevel <= 20
                          ? "RESTORED"
                          : getHealthStatus(region.health).toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EcoStats;

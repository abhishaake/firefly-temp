import React from 'react';
import type { MachineSummary } from '../../types';

interface MachineChartProps {
  machineSummary: MachineSummary;
}

export const MachineChart: React.FC<MachineChartProps> = ({ machineSummary }) => {
  const generateEqualizerBars = (type: 'avg' | 'max' | 'pace') => {
    const bars = [];
    let values: string[] = [];
    let colors: string[] = [];
    let minValue = 0;
    let maxValue = 0;
    let achievedValue = 0;
    
    // Define the color progression from red to darker green
    const activeColors = ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#B8D62F', '#7CB518', '#4A7C0A'];
    const inactiveColor = 'rgba(255, 255, 255, 0.4)';
    
    if (type === 'avg') {
      minValue = machineSummary.minWattTarget;
      maxValue = Math.max(machineSummary.maxWattTarget, machineSummary.avgWatt);
      achievedValue = machineSummary.avgWatt;
    } else if (type === 'max') {
      minValue = machineSummary.minWattTarget;
      maxValue = Math.max(machineSummary.maxWattTarget, machineSummary.maxWatt);
      achievedValue = machineSummary.maxWatt;
    } else { // pace (250M time)
      minValue = machineSummary.avgPaceMaxTarget;
      maxValue = machineSummary.avgPaceMinTarget;
      achievedValue = machineSummary.time250;
    }
    
    // Calculate the step size for 8 blocks
    const stepSize = (maxValue - minValue) / 7; 
    

    // Determine which blocks should be colored based on achieved value
    let achievedBlockIndex = -1;
    if (achievedValue > 0) {
      // Find which block the achieved value falls into (reverse calculation)
      const originalBlockIndex = Math.round((achievedValue - minValue) / stepSize);
      achievedBlockIndex = 7 - originalBlockIndex;
      // Ensure it's within bounds
      achievedBlockIndex = Math.min(Math.max(achievedBlockIndex, 0), 7);
    }

    // Generate values for each block (in reverse order)
    for (let i = 0; i < 8; i++) {
      const blockValue = minValue + (stepSize * (7 - i));
      
      if (type === 'pace') {  
        // Format time values as MM:SS
        if (i==achievedBlockIndex) { 
          const minutes = Math.floor(achievedValue / 60);
          const seconds = Math.floor(achievedValue % 60);
          values.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          const minutes = Math.floor(blockValue / 60);
          const seconds = Math.floor(blockValue % 60);
          values.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
        
      } else {
        // Format watt values as integers
        if (i==achievedBlockIndex) { 
          values.push(Math.round(achievedValue).toString());
        } else {
          values.push(Math.round(blockValue).toString());

        }
      }
    }
    
    
    
    // Generate colors based on achieved value (reverse order)
    for (let i = 0; i < 8; i++) {
      if (i >= achievedBlockIndex && achievedValue > 0) {
        colors.push(activeColors[7 - i]);
      } else {
        colors.push(inactiveColor);
      }
    }
    
    // Generate the bar elements
    for (let i = 0; i < 8; i++) {
      bars.push(
        <div key={i} className="equalizer-frame">
          <div 
            className="equalizer-bar" 
            style={{ backgroundColor: colors[i] }}
          >
            <span className="equalizer-value">{values[i]}</span>
          </div>
        </div>
      );
    }
    
    return bars;
  };

  return (
    <div className="machine-chart">
      <div className="machine-chart-background"></div>
      <div className="machine-chart-content">
        <div className="machine-header">
          <div className="machine-tags">
            <span className="machine-type-tag">{machineSummary.machineType}</span>
            <span className="machine-level-tag">LEVEL {machineSummary.level}</span>
          </div>
        </div>
        
        <div className="machine-metrics-container">
          <div className="metric-chart">
            <div className="equalizer-section">
              <div className="equalizer-bars">
                {generateEqualizerBars('avg')}
              </div>
            </div>
            <div className="metric-label-container">
              <div className="metric-label">
                <span>AVG</span>
                <span>WATTAGE</span>
              </div>
            </div>
          </div>
          
          <div className="metric-chart">
            <div className="equalizer-section">
              <div className="equalizer-bars">
                {generateEqualizerBars('max')}
              </div>
            </div>
            <div className="metric-label-container">
              <div className="metric-label">
                <span>MAX</span>
                <span>WATTAGE</span>
              </div>
            </div>
          </div>
          
          <div className="metric-chart">
            <div className="equalizer-section">
              <div className="equalizer-bars">
                {generateEqualizerBars('pace')}
              </div>
            </div>
            <div className="metric-label-container">
              <div className="metric-label">
                <span>250 M</span>
                <span>TIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
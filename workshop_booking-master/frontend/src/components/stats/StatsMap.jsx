import React, { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

// Public GeoJSON for India states (from public CDN)
const INDIA_TOPO =
  'https://cdn.jsdelivr.net/npm/indian-geojson@1.0.0/india_state.geojson';

// Normalization map — backend state names may differ from GeoJSON names
const STATE_NAME_MAP = {
  'andaman and nicobar islands': 'Andaman & Nicobar Island',
  'andaman & nicobar islands': 'Andaman & Nicobar Island',
  'andhra pradesh': 'Andhra Pradesh',
  'arunachal pradesh': 'Arunachal Pradesh',
  'assam': 'Assam',
  'bihar': 'Bihar',
  'chandigarh': 'Chandigarh',
  'chhattisgarh': 'Chhattisgarh',
  'dadra and nagar haveli': 'Dadra & Nagar Haveli',
  'daman and diu': 'Daman & Diu',
  'delhi': 'NCT of Delhi',
  'goa': 'Goa',
  'gujarat': 'Gujarat',
  'haryana': 'Haryana',
  'himachal pradesh': 'Himachal Pradesh',
  'jammu and kashmir': 'Jammu & Kashmir',
  'jharkhand': 'Jharkhand',
  'karnataka': 'Karnataka',
  'kerala': 'Kerala',
  'lakshadweep': 'Lakshadweep',
  'madhya pradesh': 'Madhya Pradesh',
  'maharashtra': 'Maharashtra',
  'manipur': 'Manipur',
  'meghalaya': 'Meghalaya',
  'mizoram': 'Mizoram',
  'nagaland': 'Nagaland',
  'odisha': 'Odisha',
  'puducherry': 'Puducherry',
  'punjab': 'Punjab',
  'rajasthan': 'Rajasthan',
  'sikkim': 'Sikkim',
  'tamil nadu': 'Tamil Nadu',
  'telangana': 'Telangana',
  'tripura': 'Tripura',
  'uttar pradesh': 'Uttar Pradesh',
  'uttarakhand': 'Uttarakhand',
  'west bengal': 'West Bengal',
};

/**
 * StatsMap — India choropleth map using react-simple-maps.
 * MASTER_PROMPT Section 13.1: "Almost nobody does this."
 *
 * @param {Object} stateData - { 'Maharashtra': 45, 'Tamil Nadu': 32, ... }
 */
export default function StatsMap({ stateData = {} }) {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Build a lookup from GeoJSON state name → count
  const dataLookup = useMemo(() => {
    const lookup = {};
    Object.entries(stateData).forEach(([name, count]) => {
      const normalized = STATE_NAME_MAP[name.toLowerCase()] || name;
      lookup[normalized] = (lookup[normalized] || 0) + count;
    });
    return lookup;
  }, [stateData]);

  const maxVal = useMemo(
    () => Math.max(1, ...Object.values(dataLookup)),
    [dataLookup]
  );

  const colorScale = useMemo(
    () => scaleLinear().domain([0, maxVal]).range(['#E0E7FF', '#1A56DB']),
    [maxVal]
  );

  const handleMouseEnter = (geo, evt) => {
    const name = geo.properties.NAME_1 || geo.properties.name || geo.properties.NAME;
    const count = dataLookup[name] || 0;
    setTooltipContent(`${name}: ${count} workshop${count !== 1 ? 's' : ''}`);
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  };

  return (
    <div className="relative bg-fossee-card rounded-2xl border border-fossee-border shadow-card p-4 md:p-6">
      <h3 className="font-bold text-lg text-fossee-dark mb-4">Workshop Distribution</h3>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 bg-fossee-dark text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 28 }}
        >
          {tooltipContent}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [82, 22],
        }}
        className="w-full h-auto"
        style={{ maxHeight: '500px' }}
      >
        <ZoomableGroup>
          <Geographies geography={INDIA_TOPO}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.NAME_1 || geo.properties.name || geo.properties.NAME;
                const count = dataLookup[name] || 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={count > 0 ? colorScale(count) : '#F3F4F6'}
                    stroke="#E5E7EB"
                    strokeWidth={0.5}
                    onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                    onMouseLeave={() => setTooltipContent('')}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#E3A008', outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 justify-center">
        <span className="text-xs text-fossee-muted">0</span>
        <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#E0E7FF] to-[#1A56DB]" />
        <span className="text-xs text-fossee-muted">{maxVal}</span>
        <span className="text-xs text-fossee-muted ml-1">workshops</span>
      </div>
    </div>
  );
}

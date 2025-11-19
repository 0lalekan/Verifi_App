import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
// eslint-disable-next-line no-undef

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      const heat = L.heatLayer(points, {
        radius: 20,
        blur: 15,
        max: 1,
        gradient: {
          0.4: 'yellow',
          0.65: 'orange',
          1.0: 'red'
        }
      }).addTo(map);

      return () => {
        map.removeLayer(heat);
      };
    }
  }, [map, points]);

  return null;
};

const FakeMapComponent = ({ scanLogs }) => {
  // Default center for Nigeria
  const center = [9.0820, 8.6753];
  const zoom = 6;

  // Transform scanLogs into heatmap data format: [[lat, lng, intensity], ...]
  const heatmapData = scanLogs
    .filter(log => {
      const lat = parseFloat(log.location?.latitude);
      const lng = parseFloat(log.location?.longitude);
      return !isNaN(lat) && !isNaN(lng);
    })
    .map(log => [
      parseFloat(log.location.latitude),
      parseFloat(log.location.longitude),
      log.status === 'Fake' ? 1 : 0.5 // Higher intensity for 'Fake' reports
    ]);

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Scan Logs Map</h2>
      <div className="h-96 w-full">
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          />
          <HeatmapLayer points={heatmapData} />
        </MapContainer>
      </div>
    </div>
  );
};

export default FakeMapComponent;

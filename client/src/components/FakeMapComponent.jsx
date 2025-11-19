import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const FakeMapComponent = ({ scanLogs }) => {
  // Default center for Nigeria
  const center = [9.0820, 8.6753];
  const zoom = 6;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Scan Logs Map</h2>
      <div className="h-96 w-full">
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {scanLogs.map((log, index) => {
            const latitude = parseFloat(log.location?.latitude);
            const longitude = parseFloat(log.location?.longitude);
            if (isNaN(latitude) || isNaN(longitude)) return null;

            const isFake = log.status === 'Fake';
            const color = isFake ? '#D9534F' : '#5CB85C';
            const radius = Math.min((log.locationAccuracy / 100) || 10, 100);
            const productName = log.productBatch || 'Unknown Product';

            return (
              <React.Fragment key={log._id || index}>
                <Marker position={[latitude, longitude]}>
                  <Popup>
                    <strong>Product:</strong> {productName}<br />
                    <strong>Status:</strong> {log.status}
                  </Popup>
                </Marker>
                <Circle
                  center={[latitude, longitude]}
                  radius={radius}
                  color={color}
                  fillColor={color}
                  fillOpacity={0.1}
                  stroke={false}
                />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default FakeMapComponent;

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Map as MapIcon, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom Green Shield Icon for Safe Spots
const safeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const SafeMapScreen = () => {
  const navigate = useNavigate();

  // 1. Fetch Aggregated Data
  const { data: safeSpots, isLoading } = useQuery({
    queryKey: ['safeMap'],
    queryFn: async () => (await api.get('/logs/safe-map')).data,
    staleTime: 60000 // Cache for 1 minute
  });

  // Default Center (e.g., Lagos) - Ideally get from user's current location
  const defaultCenter = [6.5244, 3.3792]; 

  return (
    <div className="min-h-screen w-full bg-background relative flex flex-col">
      
      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
        <button 
          onClick={() => navigate(-1)} 
          className="pointer-events-auto p-3 bg-background/90 backdrop-blur-md shadow-lg rounded-full text-foreground hover:scale-105 transition-transform"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="pointer-events-auto bg-background/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/20">
          <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="font-bold text-sm text-foreground">Verified Retailers</h1>
            <p className="text-[10px] text-muted-foreground">
              {isLoading ? 'Locating...' : `${safeSpots?.length || 0} Safe Zones Found`}
            </p>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 w-full h-full z-0">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary/20">
            <Loader2 size={40} className="animate-spin text-emerald-500" />
          </div>
        ) : (
          <MapContainer 
            center={safeSpots?.[0] ? [safeSpots[0].latitude, safeSpots[0].longitude] : defaultCenter} 
            zoom={13} 
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            
            {safeSpots?.map((spot, idx) => (
              <Marker 
                key={idx} 
                position={[spot.latitude, spot.longitude]} 
                icon={safeIcon}
              >
                <Popup className="rounded-xl overflow-hidden">
                  <div className="p-1 min-w-[150px]">
                    <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-sm">
                      <ShieldCheck size={16} /> Safe Zone
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      High volume of authentic product scans detected here.
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-[10px] text-gray-500">
                      <span>{spot.trustScore} Verifications</span>
                      <span>Active Recently</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Bottom Floating Info */}
      <div className="absolute bottom-24 left-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-border text-xs text-muted-foreground text-center pointer-events-auto">
          <span className="font-bold text-foreground">Tip:</span> Only buy from locations marked with a <span className="text-emerald-600 font-bold">Green Shield</span>.
        </div>
      </div>

    </div>
  );
};

export default SafeMapScreen;
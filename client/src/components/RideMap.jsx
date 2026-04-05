import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Custom Marker Icons for Midnight Theme
const pilotIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3082/3082383.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45],
});

const targetIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

// Helper to auto-center map when coordinates change
function RecenterAutomatically({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 15, { animate: true });
    }, [lat, lng, map]);
    return null;
}

const RideMap = ({ pickup = [19.0760, 72.8777], destination = null }) => {
    const [currentPos, setCurrentPos] = useState(pickup);

    // Simulation of a moving driver (Pilot)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPos(prev => [
                prev[0] + (Math.random() - 0.5) * 0.001,
                prev[1] + (Math.random() - 0.5) * 0.001
            ]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full relative">
            <MapContainer 
                center={pickup} 
                zoom={15} 
                scrollWheelZoom={true}
                className="w-full h-full grayscale-[0.8] invert-[0.1] contrast-[1.2]"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Pickup Marker */}
                <Marker position={pickup} icon={pilotIcon}>
                    <Popup className="font-black uppercase tracking-widest text-[9px]">
                        Elite Pickup Point
                    </Popup>
                </Marker>

                {/* Destination Marker */}
                {destination && (
                    <Marker position={destination} icon={targetIcon}>
                        <Popup className="font-black uppercase tracking-widest text-[9px]">
                            Target Coordinates
                        </Popup>
                    </Marker>
                )}

                {/* Animated Pilot Marker */}
                <Marker position={currentPos} icon={pilotIcon}>
                    <Popup className="font-black uppercase tracking-widest text-[9px]">
                        Pilot Commander
                    </Popup>
                </Marker>

                <RecenterAutomatically lat={pickup[0]} lng={pickup[1]} />
            </MapContainer>
            
            {/* Map Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#010103] via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#010103]/40 via-transparent to-transparent opacity-40" />
        </div>
    );
};

export default RideMap;

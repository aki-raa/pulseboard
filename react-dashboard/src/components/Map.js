import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
    const [vehicles, setVehicles] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8082/ws'),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe('/topic/location', (message) => {
                    const location = JSON.parse(message.body);
                    setVehicles((prev) => ({
                        ...prev,
                        [location.vehicleId]: location,
                    }));
                });
            },
        });

        client.activate();
        return () => client.deactivate();
    }, [token]);

    return (
        <MapContainer center={[27.7172, 85.324]} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.values(vehicles).map((v) => (
                <Marker key={v.vehicleId} position={[v.latitude, v.longitude]}>
                    <Popup>
                        Vehicle: {v.vehicleId}<br />
                        Driver: {v.driverId}<br />
                        Speed: {v.speed} km/h
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
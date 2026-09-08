import { useEffect, useState } from 'react';
import { alertApi } from '../api/axios';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);

    const fetchAlerts = async () => {
        try {
            const res = await alertApi.get('/alert/active');
            setAlerts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5000);
        return () => clearInterval(interval);
    }, []);

    const getColor = (type) => {
        if (type === 'OVERSPEED') return '#ff4444';
        if (type === 'VEHICLE_STOPPED') return '#ffaa00';
        return '#888';
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Active Alerts</h3>
                <button onClick={fetchAlerts} style={{ padding: '0.4rem 0.8rem' }}>Refresh</button>
            </div>
            {alerts.length === 0 && <p>No alerts</p>}
            {alerts.map((alert) => (
                <div key={alert.id} style={{
                    border: `2px solid ${getColor(alert.type)}`,
                    borderRadius: '8px',
                    padding: '0.8rem',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{ fontWeight: 'bold', color: getColor(alert.type) }}>{alert.type}</div>
                    <div>{alert.message}</div>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        Vehicle: {alert.vehicleId} | Driver: {alert.driverId} | {new Date(alert.timestamp).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Alerts;
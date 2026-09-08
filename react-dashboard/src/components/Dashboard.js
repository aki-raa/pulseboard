import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Map from './Map';
import Chat from './Chat';
import Alerts from './Alerts';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('map');
    const { email, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            <div style={{
                background: '#1a1a2e',
                color: 'white',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ margin: 0 }}>PulseBoard</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>{email} | {role}</span>
                    <button onClick={handleLogout} style={{
                        padding: '0.4rem 0.8rem',
                        background: '#ff4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#f0f0f0' }}>
                {['map', 'chat', 'alerts'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.5rem 1.5rem',
                            background: activeTab === tab ? '#007bff' : 'white',
                            color: activeTab === tab ? 'white' : 'black',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ padding: '1rem' }}>
                <div style={{ display: activeTab === 'map' ? 'block' : 'none' }}>
                    <Map />
                </div>
                <div style={{ display: activeTab === 'chat' ? 'block' : 'none' }}>
                    <Chat />
                </div>
                <div style={{ display: activeTab === 'alerts' ? 'block' : 'none' }}>
                    <Alerts />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
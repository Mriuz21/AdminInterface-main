import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function DataPage({ data, logout }) {
    const navigate = useNavigate();
    const [position, setPosition] = useState([51.505, -0.09]); // Default position

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="data-container">
            <div className="data-section">
                <h2>Data from Firebase:</h2>
                {data && Object.entries(data.issues).map(([id, issue]) => (
                    <div key={id}>
                        <h3>Issue ID: {id}</h3>
                        <p>Department: {issue.department}</p>
                        <p>Encoded Email: {issue.encodedEmail}</p>
                        <p>Altitude: {issue.location.altitude}</p>
                    </div>
                ))}
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* Add this block for the map */}
            <div className="map-section">
                <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                        <Popup>
                            You are here!
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

export default DataPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';



function DataPage({ data, logout }) {
    const navigate = useNavigate();
    const [position, setPosition] = useState(null); // Set initial position to null


    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // If position is still null, don't render the map yet
    if (!position) {
        return <div>Loading...</div>;
    }

    return (
        <div className="data-container">
            <div className="map-section">
                <MapContainer center={position} zoom={13} style={{ height: "90%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {data && data.issues && Object.entries(data.issues).map(([id, issue]) => (
                        <Marker key={id} position={[issue.location.latitude, issue.location.longitude]}>
                            <Popup>
                                {issue.description}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            <div className="button-section">
                <button onClick={() => navigate('/issues')}>See Issues</button>
                <button onClick={() => navigate('/report')}>Report Issue</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default DataPage;

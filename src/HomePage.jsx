import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

function HomePage() {
    const [position, setPosition] = useState(null); // Set initial position to null

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    // If position is still null, don't render the map yet
    if (!position) {
        return <div>Loading...</div>;
    }

    return (
        <div className="map-section">
            <MapContainer center={position} zoom={13} style={{ height: "90%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </MapContainer>
        </div>
    );
}

export default HomePage;

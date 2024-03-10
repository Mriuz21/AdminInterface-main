import React, { useEffect, useState } from 'react';
import {json, useNavigate} from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import './DataPage.css'
function ReturnamDiv(roletemp, navigate) {
    return (<div>

        {roletemp === 'admin' && (
            <button onClick={() => {
                navigate('/issues');
            }}>Vezi Sesizari</button>
        )}
        <button className="report-button" onClick={() => navigate('/report')}>Fa Sesizare!</button>


    </div>)
}
function IssueCard({ issue }) {
    return (
        <div className="issue-card">
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
            <p>Status: {issue.status}</p>
            <img src={issue.image} alt="Issue" style={{ width: '100px', height: '100px' }} />
            <p>Department: {issue.department}</p>
            <p>Request Time: {issue.requestTime}</p>
        </div>
    );
}


function DataPage({ data, logout, showMarkers = true }) {
    const navigate = useNavigate();
    const [position, setPosition] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // State to manage loading
    const [role, setRole] = useState("user")

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude]);
        });
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                console.log("Alex User: " + user);
                // Fetch role from Realtime Database
                const encodedEmail = currentUser.email.replace(/\./g, ',');
                const snapshot = await get(ref(getDatabase(), `user/${encodedEmail}/role`));
                const roletemp = snapshot.val();
                console.log(`Alex User role: ${role}`);
                setRole(roletemp);
                console.log("probabil bine role temp: " + roletemp);
                console.log("probabil bine role global" + role);
                // Assuming the role is fetched successfully, you can now use it as needed
                // For demonstration, we'll just log it
                setLoading(false); // Set loading to false after fetching the role
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while fetching the role
    }
    function ImageDisplay({ imageUrl }) {
        return (
            <div>
                <img src={imageUrl} alt="Displayed Image" />
            </div>
        );
    }

    return (
        <div className="data-container">
            <div className="map-section">
                <MapContainer center={position} zoom={13} style={{ height: "90%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {showMarkers && data && Object.entries(data).map(([id, issue]) => (
                        <Marker key={id} position={[issue.location.latitude, issue.location.longitude]}>
                            <Popup>
                                {"Titlu: " + issue.title + "\n"}
                                <br/>
                                {"Descriere : "+issue.description + "\n"}
                                <br/>
                                {"Status :" + issue.status+"\n"}
                                <br/>
                                {<img src={issue.image} alt="Photo unavailable" style={{ width: '100px', height: '100px' }} />}
                                <br/>
                                {"Departament: " + issue.department + "\n"}
                                <br/>
                                {"Data sesizare: " + issue.requestTime + "\n"}
                                <br/>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            {/*<div className="button-section">
                <h2>Hai sa vedem</h2>
                <h2>{JSON.stringify(role)}</h2>
                {user && JSON.stringify(role) === 'admin' && (
                    <button onClick={() => {
                        navigate('/issues');
                    }}>See Issues</button>
                )}
                <button onClick={() => navigate('/report')}>Report Issue</button>
                <button onClick={handleLogout}>Logout</button>
            </div>*/}<div className="button-section">
            {ReturnamDiv(role, navigate)}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
        </div>
    );
}


export default DataPage;

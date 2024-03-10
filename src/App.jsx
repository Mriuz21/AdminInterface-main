import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import db from './firebaseConfig.jsx';
import { ref, get, getDatabase } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import DataPage from './DataPage.jsx';
import IssuesPage from "./IssuePage.jsx";
import HomePage from "./HomePage.jsx";
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useTypewriter } from 'react-simple-typewriter'; // Import useTypewriter


function LoginPage({ setIsLoggedIn, fetchData }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState(null); // Initialize with null
    const [data, setData] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // Use useTypewriter hook for typewriter effect
    const [typewriterText] = useTypewriter({
        words: ["Connect-TM"],
        loop: false,
        typeSpeed: 120,
        deleteSpeed: 80,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error("Error getting user location:", error.message);
            }
        );
    }, []);

    const login = async () => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const encodedEmail = user.email.replace(/\./g, ',')
            const snapshot = await get(ref(getDatabase(), `user/${encodedEmail}/role`));
            const role = snapshot.val();
            setUserRole(role);
            console.log(`User role: ${role}`);
            fetchData();
            setIsLoggedIn(true);
            navigate("/data");
        } catch (error) {
            console.log(`Error code: ${error.code}`);
            console.log(`Error message: ${error.message}`);
        }
    };

    if (!userLocation) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <div className="login-section">
                <h3 style={{ color: 'purple' ,fontSize:50, }} className="typewriter-text">{typewriterText}</h3>

                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button onClick={login}>Login</button>
                <button onClick={() => navigate("/register")}>Register</button>
            </div>
            <div className="map-section">
                <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%"}}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                </MapContainer>
            </div>
        </div>
    );
}

function NotLoggedInPage() {
    const navigate = useNavigate();
    return (
        <div>
            Please log in to view this page.
            <button onClick={() => navigate("/")}>Log In</button>
            <button onClick={() => navigate("/register")}>Register</button>
        </div>
    );
}

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            navigate('/'); // Navigate to home page after successful registration
        } catch (error) {
            console.log(`Error code: ${error.code}`);
            console.log(`Error message: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={register}>Register</button>
        </div>
    );
}

function FirstPageWrapper({ setIsLoggedIn, fetchData }) {
    return (
        <div>
            <HomePage />
            <LoginPage setIsLoggedIn={setIsLoggedIn} fetchData={fetchData} />
        </div>
    );
}

function App() {
    const [data, setData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const fetchData = async () => {
        try {
            const snapshot = await get(ref(db));
            const allData = snapshot.val();
            const data = allData.issues;
            setData(data);
            if (data) {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        console.log(`ID: ${key}, Department: ${data[key].department}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    const database = getDatabase();
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FirstPageWrapper setIsLoggedIn={setIsLoggedIn} fetchData={fetchData} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/data" element={isLoggedIn ? <DataPage data={data} logout={logout} /> : <NotLoggedInPage />} />
                <Route path="/issues" element={isLoggedIn ? <IssuesPage data={data} database={database} logout={logout} /> : <NotLoggedInPage />} />
            </Routes>
        </Router>
    );
}

export default App;

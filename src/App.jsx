import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import db from './firebaseConfig.jsx';
import { ref, get } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import DataPage from './DataPage.jsx';

function LoginPage({ setIsLoggedIn, fetchData }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const login = async () => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in
            const user = userCredential.user;
            // Fetch data after successful login
            fetchData();
            setIsLoggedIn(true);
            navigate('/data');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    };

    return (
        <div>
            <h1>Merge?</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={login}>Login</button>
        </div>
    );
}

function App() {
    const [data, setData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchData = async () => {
        try {
            const snapshot = await get(ref(db));
            setData(snapshot.val());
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

    return (
        <Router>
            <Routes>
                <Route path="/" element={isLoggedIn ? <DataPage data={data} logout={logout} /> : <LoginPage setIsLoggedIn={setIsLoggedIn} fetchData={fetchData} />} />
                <Route path="/data" element={isLoggedIn ? <DataPage data={data} logout={logout} /> : <div>Please log in to view this page.</div>} />
            </Routes>
        </Router>
    );
}

export default App;

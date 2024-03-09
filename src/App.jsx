import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import db from './firebaseConfig.jsx';
import { ref, get } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import DataPage from './DataPage.jsx';
import IssuesPage from "./IssuePage.jsx";
import issuePage from "./IssuePage.jsx";

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

function NotLoggedInPage() {
    const navigate = useNavigate();
    return (
        <div>
            Please log in to view this page.
            <button onClick={() => navigate("/")}>Log In</button>
        </div>
    );
}

function App() {
    const [data, setData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const fetchData = async () => {
        try {
            const snapshot = await get(ref(db));
            const allData = snapshot.val();
            const data = allData.issues;
            setData(data);

            console.log("I've read the database: ", allData);
            console.log("NA BAAA: ", data);

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

    return (
        <Router>
            <Routes>
                <Route path="/" element={isLoggedIn ? <DataPage data={data} logout={logout} /> : <LoginPage setIsLoggedIn={setIsLoggedIn} fetchData={fetchData} />} />
                <Route path="/data" element={isLoggedIn ? <DataPage data={data} logout={logout} /> : <NotLoggedInPage />} />
                <Route path="/issues" element={isLoggedIn ? <IssuesPage data={data} logout={logout} /> : <NotLoggedInPage />} />

            </Routes>
        </Router>
    );
}

export default App;

import { useState, useEffect } from 'react';
import './App.css';
import db from './firebaseConfig.jsx';
import { ref, get } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function App() {
    const [data, setData] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const fetchData = async () => {
        try {
            const snapshot = await get(ref(db));
            setData(snapshot.val());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const login = async () => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Signed in
            const user = userCredential.user;
            // Fetch data after successful login
            fetchData();
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
            {data && (
                <div className="data-container">
                    <h2>Data from Firebase:</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;

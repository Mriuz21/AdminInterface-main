import React from 'react';
import { useNavigate } from 'react-router-dom';

function DataPage({ data, logout }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="data-container">
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
    );
}

export default DataPage;

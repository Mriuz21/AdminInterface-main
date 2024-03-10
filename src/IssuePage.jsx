import React, { useState , useEffect} from 'react';
import { ref, set } from 'firebase/database'; // Import ref and set from Firebase Realtime Database

function IssuesPage({ data, database }) {
    const [status, setStatus] = useState({});

    useEffect(() => {
        if (data) {
            const newStatus = {};
            for (const id in data) {
                if (data.hasOwnProperty(id)) {
                    newStatus[id] = data[id].status;
                }
            }
            setStatus(newStatus);
        }
    }, [data]);

    const handleChangeStatus = async (id, event) => {
        const newStatus = event.target.value;
        setStatus(prevStatus => ({
            ...prevStatus,
            [id]: newStatus
        }));

        try {
            if (database && data && data[id]) {
                await set(ref(database, `issues/${id}/status`), newStatus);
                console.log('Status updated successfully');
            } else {
                console.error('Database or issue not found');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };


    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            {data && Object.entries(data).map(([id, issue]) => (
                <div key={id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', width: '70%' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <p>ID: {id}</p>
                        <p>Title: {issue.title}</p>
                        <p>Description: {issue.description}</p>
                        <p>Status: <select
                            value={status[id] || issue.status}
                            onChange={(event) => handleChangeStatus(id, event)}
                        >
                            <option value="Open">Open</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select></p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default IssuesPage;

import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database'; // Import ref and set from Firebase Realtime Database

function IssuesPage({ data, database }) {
    const [status, setStatus] = useState({});
    const [department, setDepartment] = useState({});

    useEffect(() => {
        if (data) {
            const newStatus = {};
            const newDepartment = {};
            for (const id in data) {
                if (data.hasOwnProperty(id)) {
                    newStatus[id] = data[id].status;
                    newDepartment[id] = data[id].department;
                }
            }
            setStatus(newStatus);
            setDepartment(newDepartment);
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

    const handleChangeDepartment = async (id, event) => {
        const newDepartment = event.target.value;
        setDepartment(prevDepartment => ({
            ...prevDepartment,
            [id]: newDepartment
        }));

        try {
            if (database && data && data[id]) {
                await set(ref(database, `issues/${id}/department`), newDepartment);
                console.log('Department updated successfully');
            } else {
                console.error('Database or issue not found');
            }
        } catch (error) {
            console.error('Error updating department:', error);
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
                        <p>Department: <select
                            value={department[id] || issue.selectedOption}
                            onChange={(event) => handleChangeDepartment(id, event)}
                        >
                            <option value="Unallocated">Unallocated</option>
                            <option value="Drumuri si poduri">Drumuri si poduri</option>
                            <option value="Mediu">Mediu</option>
                            <option value="Ministerul afacerilor interne">MAI</option>
                            {/* Add more departments as needed */}
                        </select></p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default IssuesPage;

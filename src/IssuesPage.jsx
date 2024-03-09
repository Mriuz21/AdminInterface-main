function IssuesPage({ data }) {
    return (
        <div className="data-section">
            <h2>Data from Firebase:</h2>
            {data && data.issues && Object.entries(data.issues).map(([id, issue]) => (
                <div key={id}>
                    <h3>Issue ID: {id}</h3>
                    <p>Department: {issue.department}</p>
                    <p>Encoded Email: {issue.encodedEmail}</p>
                    <p>Altitude: {issue.location.altitude}</p>
                </div>
            ))}
        </div>
    );
}

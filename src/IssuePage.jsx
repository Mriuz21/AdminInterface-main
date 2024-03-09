function IssuesPage({ data }) {
    return (
        <div>
            {data && Object.entries(data).map(([id, issue]) => (
                <div key={id}>
                    <p>ID: {id}</p>
                    <p>Title: {issue.title}</p>
                    <p>Description: {issue.description}</p>
                    <p>Status: {issue.status}</p>
                    {/* Add more details as needed */}
                </div>
            ))}
        </div>
    );
}

export default IssuesPage;

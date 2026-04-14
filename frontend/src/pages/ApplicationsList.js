import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function ApplicationsList() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(`/application/${jobId}`);
        setApplications(res.data);
      } catch (error) {
        alert("Failed to fetch applications.");
      }
    };
    fetchApplications();
  }, [jobId]);

  // ✅ New Function to handle status updates
  const handleStatus = async (appId, newStatus) => {
    try {
      await API.put(`/application/${appId}/status`, { status: newStatus });
      alert(`Candidate marked as ${newStatus}`);
      
      setApplications((prev) => 
        prev.map((app) => app._id === appId ? { ...app, status: newStatus } : app)
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <button onClick={() => navigate("/employer-dashboard")} style={{ background: "#6c757d", color: "white", width: "auto", marginBottom: "20px" }}>← Back to Dashboard</button>
      
      <h2 style={{ marginBottom: "20px" }}>Applicants for this Job</h2>
      
      {applications.length === 0 ? <p>No applications yet.</p> : null}

      <div className="job-grid">
        {applications.map((app) => (
          <div key={app._id} className="card">
            <div>
              {/* 🛡️ FIX: Check if applicant exists before accessing .name */}
              <h3 style={{ margin: "0", color: "#333" }}>
                {app.applicant ? app.applicant.name : "Unknown Candidate (Deleted User)"}
              </h3>
              <p style={{ margin: "5px 0", color: "#666" }}>
                {app.applicant ? app.applicant.email : "No Email Available"}
              </p>
              
              <p style={{ fontWeight: "bold", marginTop: "5px" }}>
                Status: <span style={{ 
                  color: app.status === "accepted" ? "green" : app.status === "rejected" ? "red" : "#d39e00" 
                }}>
                  {app.status.toUpperCase()}
                </span>
              </p>
            </div>

            <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <a 
                href={`${(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "")}/${app.resume.replace(/\\/g, "/")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  background: "#007bff",
                  color: "white",
                  padding: "8px",
                  borderRadius: "5px",
                  textAlign: "center",
                  fontWeight: "bold"
                }}
              >
                📄 Download Resume
              </a>

              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  onClick={() => handleStatus(app._id, "accepted")}
                  style={{ background: "#28a745", color: "white", flex: 1 }}
                >
                  ✅ Accept
                </button>
                <button 
                  onClick={() => handleStatus(app._id, "rejected")}
                  style={{ background: "#dc3545", color: "white", flex: 1 }}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationsList;
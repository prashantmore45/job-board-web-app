import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        const res = await API.get("/application/my-applications");
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications");
      }
    };
    fetchMyApps();
  }, []);

  return (
    <div>
      <button onClick={() => navigate("/candidate-dashboard")} style={{ background: "#6c757d", color: "white", width: "auto", marginBottom: "20px" }}>← Back</button>
      
      <h2 style={{ marginBottom: "20px" }}>My Job Applications</h2>
      
      {applications.length === 0 ? <p>You haven't applied to any jobs yet.</p> : null}

      <div className="job-grid">
        {applications.map((app) => (
          <div key={app._id} className="card">
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#007bff" }}>{app.job.title}</h3>
              <p style={{ margin: "0", color: "#555" }}>{app.job.company}</p>
              <p style={{ margin: "0", color: "#777", fontSize: "0.9rem" }}>{app.job.location}</p>
              <small style={{ color: "#999" }}>Applied: {new Date(app.createdAt).toLocaleDateString()}</small>
            </div>

            <div style={{ marginTop: "15px" }}>
              <span style={{
                display: "inline-block",
                width: "100%",
                textAlign: "center",
                padding: "8px",
                borderRadius: "5px",
                fontWeight: "bold",
                background: app.status === "applied" ? "#fff3cd" : "#d4edda",
                color: app.status === "applied" ? "#856404" : "#155724"
              }}>
                {app.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplications;
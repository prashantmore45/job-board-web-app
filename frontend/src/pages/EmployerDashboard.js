import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function EmployerDashboard() {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        const userJobs = res.data.filter(job => job.postedBy === user._id);
        setMyJobs(userJobs);
      } catch (error) {
        console.error("Error fetching jobs");
      }
    };
    fetchJobs();
  }, [user._id]);

  const handleDelete = async (jobId) => {
    try {
      await API.delete(`/jobs/${jobId}`);
      setMyJobs(myJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Employer Dashboard</h2>

      <div style={{ marginBottom: "30px" }}>
        <button 
          onClick={() => navigate("/post-job")}
          style={{ width: "auto", padding: "12px 25px", fontSize: "1.1rem", background: "#28a745", color: "white" }}
        >
          + Post a New Job
        </button>
      </div>

      <h3 style={{ marginBottom: "20px" }}>Your Posted Jobs</h3>
      {myJobs.length === 0 ? <p style={{ color: "#777" }}>You haven't posted any jobs yet.</p> : null}

      <div className="job-grid">
        {myJobs.map((job) => (
          <div key={job._id} className="card" style={{ borderLeft: "5px solid #007bff" }}>
            <div>
              <h3 style={{ margin: "0 0 5px 0" }}>{job.title}</h3>
              <p style={{ margin: "0", color: "#555" }}>{job.location} • {job.type}</p>
            </div>
            
            <button 
              onClick={() => navigate(`/applications/${job._id}`)}
              style={{ marginTop: "15px", background: "#17a2b8", color: "white" }}
            >
              View Applicants 👥
            </button>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button 
                  onClick={() => navigate(`/edit-job/${job._id}`)}
                  style={{ background: "#ffc107", color: "black" }}
              >
                  ✏️ Edit
              </button>
              <button 
                  onClick={() => handleDelete(job._id)}
                  style={{ background: "#dc3545", color: "white" }}
              >
                  🗑️ Delete
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard; 
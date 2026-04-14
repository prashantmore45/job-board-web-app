import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState({ 
    keyword: searchParams.get("keyword") || "", 
    location: searchParams.get("location") || "" 
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const keyword = searchParams.get("keyword") || "";
        const location = searchParams.get("location") || "";
        const res = await API.get(`/jobs?keyword=${keyword}&location=${location}`);
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs");
      }
    };
    fetchJobs();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/candidate-dashboard?keyword=${search.keyword}&location=${search.location}`);
  };

  const handleClear = () => {
    setSearch({ keyword: "", location: "" });
    navigate("/candidate-dashboard");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Job Feed</h2>
        <button 
          onClick={() => navigate("/my-applications")} 
          style={{ width: "auto", background: "#17a2b8", color: "white", padding: "10px 20px" }}
        >
          📂 My Applications
        </button>
      </div>

      <div style={{ 
        background: "white", 
        padding: "15px", 
        borderRadius: "8px", 
        marginBottom: "20px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
      }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <input 
            placeholder="Job Title (e.g. React)..." 
            value={search.keyword}
            onChange={(e) => setSearch({...search, keyword: e.target.value})}
            style={{ flex: 1, margin: 0, minWidth: "200px" }}
          />
          <input 
            placeholder="Location (e.g. Remote)..." 
            value={search.location}
            onChange={(e) => setSearch({...search, location: e.target.value})}
            style={{ flex: 1, margin: 0, minWidth: "150px" }}
          />
          <button type="submit" style={{ width: "auto", margin: 0, background: "#ffc107", color: "black" }}>
            🔍 Search
          </button>
          
          {(searchParams.get("keyword") || searchParams.get("location")) && (
            <button 
              type="button" 
              onClick={handleClear} 
              style={{ width: "auto", margin: 0, background: "#6c757d", color: "white" }}
            >
              ❌ Clear
            </button>
          )}
        </form>
      </div>

      {jobs.length === 0 ? <p>No jobs found matching your search.</p> : null}

      <div className="job-grid">
        {jobs.map((job) => (
          <div key={job._id} className="card">
            <div>
              <h3 style={{ margin: "0 0 5px 0", color: "#007bff" }}>{job.title}</h3>
              <p style={{ margin: "5px 0", fontWeight: "bold" }}>{job.company}</p>
              <p style={{ margin: "0", color: "#555" }}>📍 {job.location}</p>
              <p style={{ margin: "5px 0", color: "#28a745", fontWeight: "bold" }}>💰 {job.salary}</p>
            </div>
            
            <button 
                onClick={() => navigate(`/job/${job._id}`)}
                style={{ marginTop: "15px", background: "#007bff", color: "white" }}
            >
                View & Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateDashboard;
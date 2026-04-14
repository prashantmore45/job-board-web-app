import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [search, setSearch] = useState({ keyword: "", location: "" });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get("/jobs");
        setFeaturedJobs(res.data.slice(0, 3)); 
      } catch (error) {
        console.error("Error fetching jobs");
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/candidate-dashboard?keyword=${search.keyword}&location=${search.location}`);
  };

  return (
    <div>
      <div className="hero-section">
        <h1 style={{ fontSize: "2.5rem", marginBottom: "15px" }}>Find Your Dream Job</h1>
        <p style={{ fontSize: "1.2rem", opacity: "0.9" }}>Browse thousands of job openings from top companies.</p>
        
        <form onSubmit={handleSearch} style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <input 
            placeholder="Job Title..." 
            value={search.keyword}
            onChange={(e) => setSearch({...search, keyword: e.target.value})}
            style={{ width: "250px", margin: "0" }}
          />
          <input 
            placeholder="Location..." 
            value={search.location}
            onChange={(e) => setSearch({...search, location: e.target.value})}
            style={{ width: "200px", margin: "0" }}
          />
          <button type="submit" style={{ width: "auto", background: "#ffc107", color: "#333", margin: "0" }}>
            Search Jobs
          </button>
        </form>

        <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button 
            onClick={() => navigate("/register", { state: { role: "candidate" } })}
            style={{ width: "auto", background: "white", color: "#007bff", padding: "12px 30px", border: "none" }}
          >
            I'm a Job Seeker
          </button>
          <button 
            onClick={() => navigate("/register", { state: { role: "employer" } })}
            style={{ width: "auto", background: "transparent", border: "2px solid white", color: "white", padding: "12px 30px" }}
          >
            I'm an Employer
          </button>
        </div>
      </div>

      <div>
        <h2 style={{ color: "#333", marginBottom: "20px" }}>🔥 Featured Jobs</h2>
        
        <div className="job-grid">
          {featuredJobs.map((job) => (
            <div key={job._id} className="card">
              <h3 style={{ margin: "0 0 5px 0", color: "#007bff" }}>{job.title}</h3>
              <p style={{ margin: "5px 0", color: "#666" }}>{job.company} • {job.location}</p>
              <button 
                onClick={() => navigate("/login")} 
                style={{ marginTop: "15px", background: "transparent", color: "#007bff", border: "1px solid #007bff" }}
              >
                Login to Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
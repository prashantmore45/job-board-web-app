import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    type: "Full-time"
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", formData);
      alert("Job Posted Successfully!");
      navigate("/employer-dashboard");
    } catch (error) {
      alert("Failed to post job.");
    }
  };

  return (
    <div className="form-box" style={{ margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Job Title (e.g. React Dev)" onChange={handleChange} required />
        <input name="company" placeholder="Company Name" onChange={handleChange} required />
        <input name="location" placeholder="Location (e.g. Remote)" onChange={handleChange} required />
        <input name="salary" placeholder="Salary (e.g. $50k/year)" onChange={handleChange} required />
        
        <select name="type" onChange={handleChange}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>

        <textarea 
          name="description" 
          placeholder="Job Description..." 
          onChange={handleChange} 
          rows="5"
          required
        />

        <button type="submit" style={{ background: "#28a745", color: "white" }}>Post Job</button>
        <button type="button" onClick={() => navigate("/employer-dashboard")} style={{ background: "#6c757d", color: "white", marginTop: "10px" }}>Cancel</button>
      </form>
    </div>
  );
}

export default PostJob;
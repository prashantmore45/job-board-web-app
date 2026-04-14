import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    type: "Full-time"
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setFormData({
            title: res.data.title,
            company: res.data.company,
            location: res.data.location,
            salary: res.data.salary,
            description: res.data.description,
            type: res.data.type
        });
        setLoading(false);
      } catch (error) {
        alert("Error fetching job details");
        navigate("/employer-dashboard");
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/jobs/${id}`, formData);
      alert("Job Updated Successfully!");
      navigate("/employer-dashboard");
    } catch (error) {
      alert("Failed to update job.");
    }
  };

  if (loading) return <div className="form-box">Loading...</div>;

  return (
    <div className="form-box">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={formData.title} onChange={handleChange} required />
        <input name="company" value={formData.company} onChange={handleChange} required />
        <input name="location" value={formData.location} onChange={handleChange} required />
        <input name="salary" value={formData.salary} onChange={handleChange} required />
        
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
        </select>

        <textarea 
          name="description" 
          value={formData.description}
          onChange={handleChange} 
          rows="5"
          required
        />

        <button type="submit" style={{ background: "#ffc107", color: "#000" }}>Update Job</button>
        <button type="button" onClick={() => navigate("/employer-dashboard")} style={{ background: "#6c757d", color: "white", marginTop: "10px" }}>Cancel</button>
      </form>
    </div>
  );
}

export default EditJob;
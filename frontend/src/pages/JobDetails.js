import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error("Failed to load job");
      }
    };
    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await API.post(`/application/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application Sent Successfully! 🚀");
      navigate("/candidate-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Application Failed");
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ width: "auto", background: "#6c757d", color: "white", marginBottom: "20px" }}>← Back</button>
      
      <div className="card" style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#007bff" }}>{job.title}</h2>
          <h4 style={{ color: "#555", marginBottom: "15px" }}>at {job.company}</h4>
          
          <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
              <p><strong>📍 Location:</strong> {job.location}</p>
              <p><strong>💰 Salary:</strong> {job.salary}</p>
              <p><strong>🕒 Type:</strong> {job.type}</p>
          </div>
          
          <hr style={{ border: "0", borderTop: "1px solid #eee", margin: "20px 0" }} />
          <p style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>{job.description}</p>
      </div>

      <div className="card" style={{ textAlign: "center", border: "2px dashed #007bff" }}>
        <h3>Ready to Apply?</h3>
        <p style={{marginBottom: "15px"}}>Upload your Resume (PDF only)</p>
        <form onSubmit={handleApply}>
            <input type="file" accept=".pdf" onChange={handleFileChange} required />
            <button type="submit" style={{ marginTop: "10px", background: "#007bff", color: "white" }}>
                Submit Application
            </button>
        </form>
      </div>
    </div>
  );
}

export default JobDetails;
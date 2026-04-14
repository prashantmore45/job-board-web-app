import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/auth/profile", formData);
      
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);
      
      alert("Profile Updated Successfully!");
      
      if (res.data.role === 'employer') {
        navigate("/employer-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (error) {
      alert("Update Failed.");
    }
  };

  return (
    <div className="form-box">
      <button onClick={() => navigate(-1)} style={{ background: "transparent", color: "#6c757d", border: "1px solid #6c757d", width: "auto", padding: "5px 10px", marginBottom: "20px" }}>← Back</button>
      
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label style={{ textAlign: "left", display: "block", marginBottom: "5px" }}>Full Name</label>
        <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
        />

        <label style={{ textAlign: "left", display: "block", marginBottom: "5px" }}>Email Address</label>
        <input 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
        />

        <button type="submit" style={{ background: "#ffc107", color: "#000", fontWeight: "bold" }}>
            Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;
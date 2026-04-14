import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate", 
  });

  useEffect(() => {
    if (location.state && location.state.role) {
      setFormData((prev) => ({ ...prev, role: location.state.role }));
    }
  }, [location.state]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="form-box">
      <h2 style={{textAlign: "center", marginBottom: "20px"}}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        
        <div style={{ margin: "15px 0" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>I am a:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="candidate">Job Seeker (Candidate)</option>
            <option value="employer">Employer (Hiring)</option>
          </select>
        </div>

        <button type="submit" style={{background: "#007bff", color: "white"}}>Register</button>
      </form>
      <p style={{marginTop: "15px", textAlign: "center"}}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
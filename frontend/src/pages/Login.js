import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", formData);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role); 
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.role === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="form-box">
      <h2 style={{textAlign: "center", marginBottom: "20px"}}>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" style={{background: "#007bff", color: "white"}}>Login</button>
      </form>
      <p style={{marginTop: "15px", textAlign: "center"}}>
        New here? <Link to="/register">Create an Account</Link>
      </p>
    </div>
  );
}

export default Login;
import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto glass-panel p-8 md:p-10 rounded-3xl mt-12 mb-12 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Please sign in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
          <input 
            name="email" 
            type="email" 
            placeholder="you@example.com" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all mt-6"
        >
          Sign In
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          New here? <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition">Create an Account</Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Login;
import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate", 
  });
  const [showPassword, setShowPassword] = useState(false);

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto glass-panel p-8 md:p-10 rounded-3xl mt-12 mb-12 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Account</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Join us and start your journey</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
          <input 
            name="name" 
            placeholder="John Doe" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
          />
        </div>
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
          <div className="relative">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              onChange={handleChange} 
              required 
              className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-primary-600 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0a10.05 10.05 0 015.71-2.583m0 0A10.05 10.05 0 0121.543 12c-1.275 4.057-5.064 7-9.542 7" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
        </div>
        
        <div className="pt-2">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">I am a:</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-colors ${formData.role === 'candidate' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={handleChange} className="hidden" />
              <span className="font-bold">Job Seeker</span>
            </label>
            <label className={`cursor-pointer border-2 rounded-xl p-3 text-center transition-colors ${formData.role === 'employer' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
              <input type="radio" name="role" value="employer" checked={formData.role === 'employer'} onChange={handleChange} className="hidden" />
              <span className="font-bold">Employer</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-3.5 px-4 mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all"
        >
          Register
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>
          Already have an account? <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Register;
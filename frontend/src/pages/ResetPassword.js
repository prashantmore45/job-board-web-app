import { useState } from "react";
import API from "../services/api";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await API.put(`/auth/reset-password/${token}`, { password });
      
      setMessage("Password reset successfully. Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token.");
    } finally {
      setLoading(false);
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
          <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reset Password</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create a new secure password.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {message && (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium border border-green-200 dark:border-green-800">
            {message}
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
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

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
          <input 
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="••••••••" 
            required 
            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all mt-6"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 relative z-10">
        <p>
          <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition">Back to Login</Link>
        </p>
      </div>
    </motion.div>
  );
}

export default ResetPassword;

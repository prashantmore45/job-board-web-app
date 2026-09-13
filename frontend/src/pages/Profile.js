import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    skills: "",
    experience: "",
    bio: "",
    portfolioUrl: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          skills: res.data.skills ? res.data.skills.join(", ") : "",
          experience: res.data.experience || "",
          bio: res.data.bio || "",
          portfolioUrl: res.data.portfolioUrl || ""
        });
      } catch (error) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First update base profile (name/email) which returns new token
      const authRes = await API.put("/auth/profile", { name: formData.name, email: formData.email });
      
      localStorage.setItem("user", JSON.stringify(authRes.data));
      localStorage.setItem("token", authRes.data.token);
      
      // Then update candidate-specific profile data if they are a candidate
      if (user.role === 'candidate') {
        await API.put("/users/profile", {
          skills: formData.skills,
          experience: formData.experience,
          bio: formData.bio,
          portfolioUrl: formData.portfolioUrl
        });
      }
      
      alert("Profile Updated Successfully!");
      
      if (authRes.data.role === 'employer') {
        navigate("/employer-dashboard");
      } else {
        navigate("/candidate-dashboard");
      }
    } catch (error) {
      alert("Update Failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 mt-12"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-slate-600 dark:text-slate-400 hover:text-primary-600 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back
      </button>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Edit Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Update your personal information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <input 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
          />
        </div>

        {user.role === 'candidate' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
              <input 
                name="skills" 
                value={formData.skills} 
                onChange={handleChange} 
                placeholder="React, Node.js, Python"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience (Years/Details)</label>
              <input 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange} 
                placeholder="e.g. 5 Years in Web Development"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Portfolio or GitHub URL</label>
              <input 
                name="portfolioUrl" 
                type="url"
                value={formData.portfolioUrl} 
                onChange={handleChange} 
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                rows="3"
                placeholder="A short summary about yourself..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition resize-none"
              ></textarea>
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-md transition-colors"
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );
}

export default Profile;
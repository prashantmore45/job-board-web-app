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
    portfolioUrl: "",
    companyName: "",
    companyWebsite: "",
    companyLocation: "",
    companyDescription: ""
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
          portfolioUrl: res.data.portfolioUrl || "",
          companyName: res.data.companyName || "",
          companyWebsite: res.data.companyWebsite || "",
          companyLocation: res.data.companyLocation || "",
          companyDescription: res.data.companyDescription || ""
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
      
      // Then update specific profile data based on role
      if (user.role === 'candidate') {
        await API.put("/users/profile", {
          skills: formData.skills,
          experience: formData.experience,
          bio: formData.bio,
          portfolioUrl: formData.portfolioUrl
        });
      } else if (user.role === 'employer') {
        await API.put("/users/profile", {
          companyName: formData.companyName,
          companyWebsite: formData.companyWebsite,
          companyLocation: formData.companyLocation,
          companyDescription: formData.companyDescription
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
      className="max-w-xl mx-auto glass-panel p-8 md:p-10 rounded-3xl mt-12 mb-12 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>
      </div>

      <div className="text-center mb-10 relative z-10">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-md">
          <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Update your personal information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
          <input 
            name="name" 
            value={formData.name} 
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
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
          />
        </div>

        {user.role === 'candidate' && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Skills (comma separated)</label>
              <input 
                name="skills" 
                value={formData.skills} 
                onChange={handleChange} 
                placeholder="React, Node.js, Python"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Experience (Years/Details)</label>
              <input 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange} 
                placeholder="e.g. 5 Years in Web Development"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Portfolio or GitHub URL</label>
              <input 
                name="portfolioUrl" 
                type="url"
                value={formData.portfolioUrl} 
                onChange={handleChange} 
                placeholder="https://github.com/yourusername"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                rows="3"
                placeholder="A short summary about yourself..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all resize-none"
              ></textarea>
            </div>
          </>
        )}

        {user.role === 'employer' && (
          <>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
              <input 
                name="companyName" 
                value={formData.companyName} 
                onChange={handleChange} 
                placeholder="e.g. Acme Corp"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Website</label>
              <input 
                name="companyWebsite" 
                type="url"
                value={formData.companyWebsite} 
                onChange={handleChange} 
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Location</label>
              <input 
                name="companyLocation" 
                value={formData.companyLocation} 
                onChange={handleChange} 
                placeholder="e.g. San Francisco, CA"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Description</label>
              <textarea 
                name="companyDescription" 
                value={formData.companyDescription} 
                onChange={handleChange} 
                rows="4"
                placeholder="What does your company do? Why should people work here?"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all resize-none"
              ></textarea>
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all mt-6"
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );
}

export default Profile;
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    type: "Full-time",
    workType: "On-site"
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax)
      };
      await API.post("/jobs", payload);
      alert("Job Posted Successfully!");
      navigate("/employer-dashboard");
    } catch (error) {
      alert("Failed to post job.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto glass-panel p-8 md:p-10 rounded-2xl mt-8 mb-12"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Post a New Job</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Find the perfect candidate by providing clear role details.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Title</label>
            <input 
              name="title" 
              placeholder="e.g. Senior React Developer" 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
            <input 
              name="company" 
              placeholder="e.g. TechCorp Inc." 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
              <input 
                name="location" 
                placeholder="e.g. New York, NY" 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Min Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span>
                  <input 
                    type="number"
                    name="salaryMin" 
                    placeholder="e.g. 100000" 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Max Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span>
                  <input 
                    type="number"
                    name="salaryMax" 
                    placeholder="e.g. 150000" 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Employment Type</label>
            <select 
              name="type" 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Work Type</label>
            <select 
              name="workType" 
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all"
            >
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Description</label>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 pb-12 transition-all">
            <ReactQuill 
              theme="snow"
              value={formData.description} 
              onChange={handleDescriptionChange}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="h-64 dark:text-white border-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button 
            type="submit" 
            className="w-full sm:w-2/3 py-4 px-4 border border-transparent rounded-xl shadow-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-bold transition-all"
          >
            Post Job to Board
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/employer-dashboard")} 
            className="w-full sm:w-1/3 py-4 px-4 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default PostJob;
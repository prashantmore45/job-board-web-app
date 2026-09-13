import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setFormData({
            title: res.data.title,
            company: res.data.company,
            location: res.data.location,
            salaryMin: res.data.salaryMin || "",
            salaryMax: res.data.salaryMax || "",
            description: res.data.description,
            type: res.data.type,
            workType: res.data.workType || "On-site"
        });
        setLoading(false);
      } catch (error) {
        alert("Error fetching job details");
        navigate("/employer-dashboard");
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDescriptionChange = (content) => {
    setFormData({ ...formData, description: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax)
      };
      await API.put(`/jobs/${id}`, payload);
      alert("Job Updated Successfully!");
      navigate("/employer-dashboard");
    } catch (error) {
      alert("Failed to update job.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto glass-panel p-8 md:p-12 rounded-3xl mt-8 mb-12 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="text-center mb-10 relative z-10">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
          <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Job Posting</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">Update the details of your opportunity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Title <span className="text-red-500">*</span></label>
            <input 
              name="title" 
              placeholder="e.g. Senior Frontend Developer" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name <span className="text-red-500">*</span></label>
            <input 
              name="company" 
              placeholder="e.g. TechCorp Inc." 
              value={formData.company} 
              onChange={handleChange} 
              required 
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all font-medium"
            />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Location <span className="text-red-500">*</span></label>
              <input 
                name="location" 
                placeholder="e.g. Remote, NY" 
                value={formData.location} 
                onChange={handleChange} 
                required 
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Min Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">$</span>
                  <input 
                    type="number"
                    name="salaryMin" 
                    placeholder="100,000" 
                    value={formData.salaryMin}
                    onChange={handleChange} 
                    required 
                    className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Max Salary</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">$</span>
                  <input 
                    type="number"
                    name="salaryMax" 
                    placeholder="150,000" 
                    value={formData.salaryMax}
                    onChange={handleChange} 
                    required 
                    className="w-full pl-8 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Employment Type</label>
            <select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all font-medium appearance-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Work Type</label>
            <select 
              name="workType" 
              value={formData.workType} 
              onChange={handleChange}
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white transition-all font-medium appearance-none"
            >
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Description <span className="text-red-500">*</span></label>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
            <ReactQuill 
              theme="snow" 
              value={formData.description} 
              onChange={handleDescriptionChange}
              className="h-64 dark:text-white [&>.ql-toolbar]:border-0 [&>.ql-toolbar]:border-b [&>.ql-toolbar]:border-slate-200 [&>.ql-toolbar]:dark:border-slate-700 [&>.ql-container]:border-0"
            />
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <button 
            type="submit" 
            className="flex-1 py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center"
          >
            Update Job
          </button>
          <button 
            type="button" 
            onClick={() => navigate("/employer-dashboard")} 
            className="flex-1 py-4 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl shadow-sm transition-all text-center"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default EditJob;
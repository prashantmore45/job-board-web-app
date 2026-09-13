import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error("Failed to load job");
      }
    };
    
    const fetchSavedStatus = async () => {
      try {
        const res = await API.get('/users/saved-jobs');
        setIsSaved(res.data.some(savedJob => savedJob._id === id));
      } catch (error) {
        console.error("Failed to fetch saved jobs");
      }
    };

    fetchJob();
    fetchSavedStatus();
  }, [id]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const toggleBookmark = async () => {
    try {
      const res = await API.post(`/users/save-job/${id}`);
      setIsSaved(res.data.isSaved);
    } catch (error) {
      console.error("Failed to toggle bookmark");
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await API.post(`/application/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application Sent Successfully! 🚀");
      navigate("/candidate-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Application Failed");
    }
  };

  if (!job) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-slate-600 dark:text-slate-400 hover:text-primary-600 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Jobs
        </button>
        
        <button 
          onClick={toggleBookmark}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            isSaved 
              ? "bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          {isSaved ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
              Saved
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              Save Job
            </>
          )}
        </button>
      </div>
      
      <div className="glass-panel rounded-2xl overflow-hidden mb-12">
        <div className="p-8 border-b border-slate-200/50 dark:border-slate-700/50 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">{job.title}</h1>
          <h2 className="text-xl md:text-2xl text-primary-600 dark:text-primary-400 font-bold mb-8 relative z-10">at {job.company}</h2>
          
          <div className="flex flex-wrap gap-4 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-xl relative z-10">
            <div className="flex items-center text-slate-700 dark:text-slate-300">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mr-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              </span>
              <span className="font-bold mr-2">Location:</span> {job.location} ({job.workType || 'On-site'})
            </div>
            <div className="flex items-center text-slate-700 dark:text-slate-300">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mr-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              <span className="font-bold mr-2">Salary:</span> ${job.salaryMin ? job.salaryMin.toLocaleString() : 'N/A'} - ${job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}
            </div>
            <div className="flex items-center text-slate-700 dark:text-slate-300">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 mr-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              <span className="font-bold mr-2">Type:</span> {job.type}
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Job Description</h3>
          <div 
            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(job.description) }}
          />
        </div>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass-panel border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-2xl p-8 text-center"
      >
        <h3 className="text-2xl font-bold text-primary-800 dark:text-primary-400 mb-2">Ready to Apply?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Upload your Resume (PDF only)</p>
        
        <form onSubmit={handleApply} className="max-w-md mx-auto">
          <div className="flex items-center justify-center w-full mb-6">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-slate-500 dark:text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">PDF ONLY (MAX. 5MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" accept=".pdf" onChange={handleFileChange} required />
            </label>
          </div>
          {resume && <p className="text-sm text-primary-600 font-medium mb-4">Selected file: {resume.name}</p>}
          <button 
            type="submit" 
            className="w-full px-6 py-4 text-base font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md transition-all"
          >
            Submit Application
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default JobDetails;
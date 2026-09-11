import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function EmployerDashboard() {
  const navigate = useNavigate();
  const [myJobs, setMyJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        const userJobs = res.data.filter(job => job.postedBy === user._id);
        setMyJobs(userJobs);
      } catch (error) {
        console.error("Error fetching jobs");
      }
    };
    fetchJobs();
  }, [user._id]);

  const handleDelete = async (jobId) => {
    try {
      await API.delete(`/jobs/${jobId}`);
      setMyJobs(myJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Employer Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your job postings and applicants.</p>
        </div>
        <button 
          onClick={() => navigate("/post-job")}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Post a New Job
        </button>
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Your Posted Jobs</h3>
      
      {myJobs.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg">You haven't posted any jobs yet.</p>
          <button onClick={() => navigate("/post-job")} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">Create your first job posting →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myJobs.map((job, index) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-l-4 border-l-primary-500 border border-slate-100 dark:border-slate-700 p-6 flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">{job.location}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">{job.type}</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <button 
                  onClick={() => navigate(`/applications/${job._id}`)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  View Applicants
                </button>

                <div className="flex gap-3">
                  <button 
                      onClick={() => navigate(`/edit-job/${job._id}`)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit
                  </button>
                  <button 
                      onClick={() => handleDelete(job._id)}
                      className="flex-1 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard; 
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SavedJobs() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await API.get('/users/saved-jobs');
        setSavedJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const removeBookmark = async (e, jobId) => {
    e.stopPropagation();
    try {
      await API.post(`/users/save-job/${jobId}`);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error("Failed to remove bookmark");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 flex items-center">
        <button 
          onClick={() => navigate("/candidate-dashboard")} 
          className="mr-4 text-slate-500 hover:text-primary-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center">
            <svg className="w-8 h-8 mr-3 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
            Saved Jobs
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Jobs you've bookmarked for later.</p>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center mt-8">
          <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">You haven't saved any jobs yet.</p>
          <button 
            onClick={() => navigate("/candidate-dashboard")} 
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map((job, index) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full group cursor-pointer relative overflow-hidden"
              onClick={() => navigate(`/job/${job._id}`)}
            >
              {/* Decorative background glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

              <button 
                onClick={(e) => removeBookmark(e, job._id)}
                className="absolute top-4 right-4 p-2 text-primary-500 hover:text-red-500 transition-colors z-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full shadow-sm"
                title="Remove bookmark"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
              </button>

              <div className="pr-10 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md mb-4">
                  {job.company.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">{job.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{job.company}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">{job.type}</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">{job.workType || 'On-site'}</span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ${job.salaryMin ? job.salaryMin.toLocaleString() : 'N/A'} - ${job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between relative z-10">
                <span className="text-sm text-slate-400 font-medium">Saved</span>
                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm group-hover:translate-x-1 transition-transform">Apply Now &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedJobs;

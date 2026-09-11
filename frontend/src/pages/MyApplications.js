import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        const res = await API.get("/application/my-applications");
        setApplications(res.data);
      } catch (error) {
        console.error("Failed to fetch applications");
      }
    };
    fetchMyApps();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8">
      <button 
        onClick={() => navigate("/candidate-dashboard")} 
        className="mb-6 flex items-center text-slate-600 dark:text-slate-400 hover:text-primary-600 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Jobs Feed
      </button>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">My Job Applications</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track the status of your applications.</p>
      </div>
      
      {applications.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg">You haven't applied to any jobs yet.</p>
          <button onClick={() => navigate("/candidate-dashboard")} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">Browse Jobs →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, index) => (
            <motion.div 
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-1">{app.job.title}</h3>
                <p className="text-slate-800 dark:text-slate-200 font-semibold">{app.job.company}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">📍 {app.job.location}</p>
                
                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Applied: {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className={`block w-full text-center py-2 rounded-lg font-bold uppercase text-sm ${
                  app.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {app.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;
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
        // Map legacy statuses for candidate view
        const mappedData = res.data.map(app => {
          let newStatus = app.status;
          if (newStatus === 'accepted') newStatus = 'offered';
          if (newStatus === 'pending') newStatus = 'applied';
          return { ...app, status: newStatus };
        });
        setApplications(mappedData);
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
              className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md mb-4">
                  {app.job.company.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">{app.job.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{app.job.company}</p>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 font-medium mb-4">
                  <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {app.job.location}
                </div>
                
                <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Applied: {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 relative z-10">
                <span className={`block w-full text-center py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs ${
                  app.status === 'offered' ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50' :
                  app.status === 'rejected' ? 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50' :
                  app.status === 'interviewing' ? 'bg-purple-100/80 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50' :
                  app.status === 'screening' ? 'bg-yellow-100/80 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/50' :
                  'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50'
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
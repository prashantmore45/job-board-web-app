import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

function ApplicationsList() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(`/application/${jobId}`);
        setApplications(res.data);
      } catch (error) {
        alert("Failed to fetch applications.");
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleStatus = async (appId, newStatus) => {
    try {
      await API.put(`/application/${appId}/status`, { status: newStatus });
      alert(`Candidate marked as ${newStatus}`);
      
      setApplications((prev) => 
        prev.map((app) => app._id === appId ? { ...app, status: newStatus } : app)
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <button 
        onClick={() => navigate("/employer-dashboard")} 
        className="mb-6 flex items-center text-slate-600 dark:text-slate-400 hover:text-primary-600 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </button>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Applicants for this Job</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage candidates.</p>
      </div>
      
      {applications.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-lg">No applications yet.</p>
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {app.applicant ? app.applicant.name : "Unknown Candidate (Deleted User)"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  {app.applicant ? app.applicant.email : "No Email Available"}
                </p>
                
                <div className="flex items-center mb-4">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mr-2">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                    app.status === "accepted" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                    app.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : 
                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <a 
                  href={`${(process.env.REACT_APP_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "")}/${app.resume.replace(/\\/g, "/")}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-center rounded-lg transition-colors"
                >
                  📄 Download Resume
                </a>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleStatus(app._id, "accepted")}
                    className="flex-1 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-400 font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    ✅ Accept
                  </button>
                  <button 
                    onClick={() => handleStatus(app._id, "rejected")}
                    className="flex-1 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 font-medium rounded-lg transition-colors flex items-center justify-center"
                  >
                    ❌ Reject
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

export default ApplicationsList;
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  
  const [search, setSearch] = useState({ 
    keyword: searchParams.get("keyword") || "", 
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    workType: searchParams.get("workType") || "",
    minSalary: searchParams.get("minSalary") || ""
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const keyword = searchParams.get("keyword") || "";
        const location = searchParams.get("location") || "";
        const type = searchParams.get("type") || "";
        const workType = searchParams.get("workType") || "";
        const minSalary = searchParams.get("minSalary") || "";
        
        const res = await API.get(`/jobs?keyword=${keyword}&location=${location}&type=${type}&workType=${workType}&minSalary=${minSalary}`);
        setJobs(res.data);
      } catch (error) {
        console.error("Failed to fetch jobs");
      }
    };
    
    const fetchSavedJobs = async () => {
      try {
        const res = await API.get('/users/saved-jobs');
        setSavedJobs(res.data.map(job => job._id));
      } catch (error) {
        console.error("Failed to fetch saved jobs");
      }
    };

    fetchJobs();
    fetchSavedJobs();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (search.keyword) query.set("keyword", search.keyword);
    if (search.location) query.set("location", search.location);
    if (search.type) query.set("type", search.type);
    if (search.workType) query.set("workType", search.workType);
    if (search.minSalary) query.set("minSalary", search.minSalary);
    
    navigate(`/candidate-dashboard?${query.toString()}`);
  };

  const handleClear = () => {
    setSearch({ keyword: "", location: "", type: "", workType: "", minSalary: "" });
    navigate("/candidate-dashboard");
  };

  const toggleBookmark = async (e, jobId) => {
    e.stopPropagation(); // prevent navigating to job details
    try {
      const res = await API.post(`/users/save-job/${jobId}`);
      if (res.data.isSaved) {
        setSavedJobs([...savedJobs, jobId]);
      } else {
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      }
    } catch (error) {
      console.error("Failed to toggle bookmark");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Job Feed</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Discover your next career opportunity.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/saved-jobs")} 
            className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold rounded-lg shadow-sm transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
            Saved Jobs
          </button>
          <button 
            onClick={() => navigate("/my-applications")} 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
            My Applications
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                placeholder="Job Title (e.g. React)..." 
                value={search.keyword}
                onChange={(e) => setSearch({...search, keyword: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="w-full md:flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <input 
                placeholder="Location (e.g. Remote)..." 
                value={search.location}
                onChange={(e) => setSearch({...search, location: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <select 
                value={search.type} 
                onChange={(e) => setSearch({...search, type: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">Any Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <select 
                value={search.workType} 
                onChange={(e) => setSearch({...search, workType: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="">Any Work Type</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">$</div>
              <input 
                type="number"
                placeholder="Min Salary..." 
                value={search.minSalary}
                onChange={(e) => setSearch({...search, minSalary: e.target.value})}
                className="w-full pl-8 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto mt-2">
            <button type="submit" className="flex-1 md:w-auto px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg shadow-sm transition-colors flex justify-center items-center">
              Search Jobs
            </button>
            
            {(searchParams.toString() !== "") && (
              <button 
                type="button" 
                onClick={handleClear} 
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors flex justify-center items-center"
              >
                Clear Filters
              </button>
            )}
          </div>
        </form>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center mt-8">
          <p className="text-slate-500 dark:text-slate-400 text-lg">No jobs found matching your search.</p>
          <button onClick={handleClear} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">Clear search filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-full transition-all duration-300 cursor-pointer relative group"
              onClick={() => navigate(`/job/${job._id}`)}
            >
              <button 
                onClick={(e) => toggleBookmark(e, job._id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary-500 transition-colors z-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full"
              >
                {savedJobs.includes(job._id) ? (
                  <svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                )}
              </button>

              <div className="pr-10">
                <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-1 line-clamp-1">{job.title}</h3>
                <p className="text-slate-800 dark:text-slate-200 font-semibold mb-3">{job.company}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md">{job.type}</span>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md">{job.workType || 'On-site'}</span>
                </div>

                <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ${job.salaryMin ? job.salaryMin.toLocaleString() : 'N/A'} - ${job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
              
              <button 
                  className="mt-6 w-full py-2.5 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-semibold rounded-lg shadow-sm transition-colors opacity-0 group-hover:opacity-100"
              >
                  View Details
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidateDashboard;
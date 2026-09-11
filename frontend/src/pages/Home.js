import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [search, setSearch] = useState({ keyword: "", location: "" });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get("/jobs");
        setFeaturedJobs(res.data.slice(0, 3)); 
      } catch (error) {
        console.error("Error fetching jobs");
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/candidate-dashboard?keyword=${search.keyword}&location=${search.location}`);
  };

  return (
    <div className="w-full">
      {/* Full Bleed Hero Section */}
      <div className="w-[100vw] relative left-1/2 -translate-x-1/2 -mt-8 pt-24 pb-20 px-4 bg-gradient-to-br from-primary-600 to-indigo-700 text-white text-center mb-16 shadow-inner">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Find Your Dream Job</h1>
          <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">Browse thousands of job openings from top companies and kickstart your career.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center items-center gap-3 w-full max-w-3xl mx-auto">
            <input 
              placeholder="Job Title or Keyword..." 
              value={search.keyword}
              onChange={(e) => setSearch({...search, keyword: e.target.value})}
              className="w-full md:w-1/3 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm"
            />
            <input 
              placeholder="Location..." 
              value={search.location}
              onChange={(e) => setSearch({...search, location: e.target.value})}
              className="w-full md:w-1/3 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-sm"
            />
            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg shadow-md transition-colors duration-200">
              Search Jobs
            </button>
          </form>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate("/register", { state: { role: "candidate" } })}
              className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg shadow-md hover:bg-slate-50 transition"
            >
              I'm a Job Seeker
            </button>
            <button 
              onClick={() => navigate("/register", { state: { role: "employer" } })}
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
            >
              I'm an Employer
            </button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-3xl">🔥</span>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Featured Jobs</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job, index) => (
            <motion.div 
              key={job._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between h-full transition-colors duration-300"
            >
              <div>
                <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-2">{job.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium">{job.company}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {job.location}
                </div>
              </div>
              
              <button 
                onClick={() => navigate("/login")} 
                className="mt-6 w-full py-2 bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg font-medium transition"
              >
                Login to Apply
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
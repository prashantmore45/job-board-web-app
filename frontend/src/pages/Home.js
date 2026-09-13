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
        const res = await API.get("/jobs?limit=6");
        setFeaturedJobs(res.data.jobs);
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
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 mesh-bg-light dark:mesh-bg overflow-hidden flex items-center">
        {/* Subtle decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/20 dark:bg-primary-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/30 backdrop-blur-sm text-primary-700 dark:text-primary-300 font-semibold text-sm tracking-wide uppercase">
                🚀 The New Standard in Hiring
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white leading-tight">
                Find Your Next Role In <br className="hidden md:block"/>
                <span className="text-gradient">Tech & Engineering</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg font-medium">
                Join thousands of professionals discovering life-changing opportunities at the world's most innovative companies.
              </p>
              
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl glass-panel p-2 rounded-2xl">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </span>
                  <input 
                    placeholder="Job title, keywords..." 
                    value={search.keyword}
                    onChange={(e) => setSearch({...search, keyword: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="relative w-full sm:w-48 flex-shrink-0">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  <input 
                    placeholder="Location" 
                    value={search.location}
                    onChange={(e) => setSearch({...search, location: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <button type="submit" className="w-full sm:w-auto py-3.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
                  Search
                </button>
              </form>
              
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span>Popular:</span>
                <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors px-3 py-1 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">Frontend</span>
                <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors px-3 py-1 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">Product Manager</span>
                <span className="hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors px-3 py-1 bg-white/50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">Remote</span>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-[2rem] transform rotate-3 scale-105"></div>
              <img 
                src="/hero.png" 
                alt="JobBoard Platform" 
                className="relative z-10 w-full h-auto object-cover rounded-[2rem] shadow-2xl border-4 border-white/50 dark:border-slate-800/50 backdrop-blur-sm transform transition-transform hover:-translate-y-2 duration-500"
                onError={(e) => { e.target.style.display = 'none'; }} // Hide if hero.png not found
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="w-full py-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <h2 className="text-2xl font-bold font-serif">Google</h2>
            <h2 className="text-2xl font-bold tracking-tighter">stripe</h2>
            <h2 className="text-2xl font-bold italic">Spotify</h2>
            <h2 className="text-2xl font-bold">Netflix</h2>
            <h2 className="text-2xl font-extrabold tracking-widest">AIRBNB</h2>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How JobBoard Works</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 text-lg">We've streamlined the hiring process. Whether you're looking for your next big opportunity or searching for top talent, it takes just three simple steps.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Create a Profile</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sign up in seconds. Build a stunning profile highlighting your skills, experience, and portfolio.</p>
            </div>
            <div className="flex flex-col items-center relative">
              <div className="hidden md:block absolute top-8 -left-8 w-24 border-t-2 border-dashed border-slate-300 dark:border-slate-700"></div>
              <div className="hidden md:block absolute top-8 -right-8 w-24 border-t-2 border-dashed border-slate-300 dark:border-slate-700"></div>
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-sm z-10 relative">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. Find Matches</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use our advanced filters to find the perfect roles. Save jobs or apply directly with one click.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Get Hired</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Track your applications in real-time. Ace your interviews and land your dream job.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="w-full py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Featured Opportunities</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Hand-picked roles from top companies hiring right now.</p>
            </div>
            <button 
              onClick={() => navigate("/candidate-dashboard")}
              className="hidden md:flex items-center text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 transition"
            >
              View all jobs <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <motion.div 
                key={job._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => navigate("/login")}
                className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full group cursor-pointer relative overflow-hidden"
              >
                {/* Decorative background glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {job.company.charAt(0)}
                    </div>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{job.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">{job.company}</p>
                  
                  <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {job.location} &bull; {job.workType || 'On-site'}
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      ${job.salaryMin ? job.salaryMin.toLocaleString() : 'N/A'} - ${job.salaryMax ? job.salaryMax.toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-sm text-slate-400 font-medium">Posted recently</span>
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-sm group-hover:translate-x-1 transition-transform">Apply Now &rarr;</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button 
            onClick={() => navigate("/candidate-dashboard")}
            className="md:hidden mt-8 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl transition"
          >
            View all jobs
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full relative py-24 bg-primary-900 text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to transform your career?</h2>
          <p className="text-xl text-primary-200 mb-10 max-w-2xl mx-auto">Join JobBoard today. Whether you are hiring top talent or looking for your next big break, we have you covered.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate("/register", { state: { role: "candidate" } })}
              className="px-8 py-4 bg-white text-primary-900 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all transform hover:-translate-y-1"
            >
              Find a Job
            </button>
            <button 
              onClick={() => navigate("/register", { state: { role: "employer" } })}
              className="px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white font-bold rounded-xl transition-all"
            >
              Post a Job
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
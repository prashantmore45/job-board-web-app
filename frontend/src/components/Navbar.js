import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ theme, toggleTheme, notifications = [], setNotifications }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply dark mode class to html element
  useEffect(() => {
    // We get theme from props now, but keep local fallback if needed
  }, [theme]);

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Job</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">Board</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-10">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Home</Link>
            
            {user ? (
              <>
                {user.role === 'employer' ? (
                  <Link to="/employer-dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Dashboard</Link>
                ) : (
                  <Link to="/candidate-dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Find Jobs</Link>
                )}
                
                {user.role === 'candidate' && (
                  <div className="relative group cursor-pointer mr-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                    
                    {notifications.length > 0 && (
                      <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                        <div className="p-4 border-b border-slate-100/50 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                          <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">Notifications</h3>
                          <button onClick={() => setNotifications && setNotifications([])} className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">Clear All</button>
                        </div>
                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                          {notifications.map((n, i) => (
                            <div 
                              key={i} 
                              onClick={() => {
                                setNotifications(prev => prev.map((item, idx) => idx === i ? { ...item, isRead: true } : item));
                                navigate("/my-applications");
                              }}
                              className={`p-4 border-b border-slate-100/50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-sm cursor-pointer transition-colors ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <p className={`text-slate-700 dark:text-slate-300 ${!n.isRead ? 'font-bold' : 'font-medium'}`}>
                                  Status updated to <span className="font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-tight">{n.status}</span> for 
                                  <span className="font-bold"> {n.jobTitle}</span> at {n.company}
                                </p>
                                {!n.isRead && (
                                  <span className="w-2.5 h-2.5 rounded-full bg-primary-600 flex-shrink-0 mt-1.5 ml-3 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-2 flex items-center font-bold uppercase tracking-wider">
                                <span className="text-primary-600 dark:text-primary-400 hover:underline">View application &rarr;</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="relative group cursor-pointer ml-2">
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-slate-800 group-hover:ring-primary-200 dark:group-hover:ring-primary-900 transition-all">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>

                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100/50 dark:border-slate-700/50">
                      <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{user.name}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                    </div>
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        My Profile
                      </Link>
                      {user.role === 'candidate' && (
                        <>
                          <Link to="/my-applications" className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            Applications
                          </Link>
                          <Link to="/saved-jobs" className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            Saved Jobs
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="py-2 border-t border-slate-100/50 dark:border-slate-700/50">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition mr-2">Login</Link>
                <button 
                  onClick={() => navigate("/register")}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all"
                >
                  Register
                </button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-6">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            <button onClick={toggleMenu} className="text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none">
              <span className="text-2xl">{menuOpen ? "✖" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>Home</Link>
            
            {user ? (
              <>
                {user.role === 'employer' ? (
                  <Link to="/employer-dashboard" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/candidate-dashboard" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>Find Jobs</Link>
                    <Link to="/my-applications" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>My Applications</Link>
                    <Link to="/saved-jobs" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>Saved Jobs</Link>
                  </>
                )}
                <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                <div className="px-3 py-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{user.name}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>My Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>Login</Link>
                <button onClick={() => {toggleMenu(); navigate("/register")}} className="w-full text-left px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">Register</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
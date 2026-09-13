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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Job</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">Board</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Home</Link>
            
            {user ? (
              <>
                {user.role === 'employer' ? (
                  <Link to="/employer-dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Dashboard</Link>
                ) : (
                  <Link to="/candidate-dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Jobs Feed</Link>
                )}
                
                <Link to="/profile" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Profile</Link>
                
                <span className="font-semibold text-primary-600 dark:text-primary-400 ml-2">Hi, {user.name.split(" ")[0]}</span>
                
                {user.role === 'candidate' && (
                  <div className="relative group cursor-pointer">
                    <span className="text-xl">🔔</span>
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {notifications.filter(n => !n.isRead).length}
                      </span>
                    )}
                    
                    {notifications.length > 0 && (
                      <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Notifications</h3>
                          <button onClick={() => setNotifications && setNotifications([])} className="text-xs text-primary-600 hover:underline">Clear</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((n, i) => (
                            <div 
                              key={i} 
                              onClick={() => {
                                setNotifications(prev => prev.map((item, idx) => idx === i ? { ...item, isRead: true } : item));
                                navigate("/my-applications");
                              }}
                              className={`p-3 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-sm cursor-pointer transition-colors ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <p className={`text-slate-700 dark:text-slate-300 ${!n.isRead ? 'font-semibold' : ''}`}>
                                  Status updated to <span className="font-bold text-primary-600 dark:text-primary-400 uppercase">{n.status}</span> for 
                                  <span className="font-medium"> {n.jobTitle}</span> at {n.company}
                                </p>
                                {!n.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-primary-600 flex-shrink-0 mt-1 ml-2"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 flex items-center">
                                <span>View application &rarr;</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/30 transition ml-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition">Login</Link>
                <button 
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow transition"
                >
                  Register
                </button>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? "☀️" : "🌙"}
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
                  <Link to="/candidate-dashboard" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>Jobs Feed</Link>
                )}
                <Link to="/profile" className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md" onClick={toggleMenu}>Profile</Link>
                <span className="block px-3 py-2 text-base font-semibold text-primary-600 dark:text-primary-400">Hi, {user.name.split(" ")[0]}</span>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-base font-medium text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">Logout</button>
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
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";
import ApplicationsList from "./pages/ApplicationsList";
import MyApplications from "./pages/MyApplications";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";

function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/employer-dashboard" element={<PrivateRoute role="employer"><EmployerDashboard /></PrivateRoute>} />
            <Route path="/post-job" element={<PrivateRoute role="employer"><PostJob /></PrivateRoute>} />
            <Route path="/edit-job/:id" element={<PrivateRoute role="employer"><EditJob /></PrivateRoute>} />
            <Route path="/applications/:jobId" element={<PrivateRoute role="employer"><ApplicationsList /></PrivateRoute>} />

            <Route path="/candidate-dashboard" element={<PrivateRoute role="candidate"><CandidateDashboard /></PrivateRoute>} />
            <Route path="/my-applications" element={<PrivateRoute role="candidate"><MyApplications /></PrivateRoute>} />
            <Route path="/saved-jobs" element={<PrivateRoute role="candidate"><SavedJobs /></PrivateRoute>} />
            
            <Route path="/job/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
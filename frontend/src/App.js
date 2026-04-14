import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import "./App.css";

// Page Imports
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmployerDashboard from "./pages/EmployerDashboard";
import CandidateDashboard from "./pages/CandidateDashboard";
import PostJob from "./pages/PostJob";
import JobDetails from "./pages/JobDetails";
import ApplicationsList from "./pages/ApplicationsList";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import MyApplications from "./pages/MyApplications"; 
import ProtectedRoute from "./components/ProtectedRoute";
import EditJob from "./pages/EditJob";



function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar /> 

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/employer-dashboard" element={<ProtectedRoute><EmployerDashboard /></ProtectedRoute>} />
            <Route path="/candidate-dashboard" element={<ProtectedRoute><CandidateDashboard /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
            <Route path="/job/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
            <Route path="/applications/:jobId" element={<ProtectedRoute><ApplicationsList /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
            <Route path="/edit-job/:id" element={<ProtectedRoute><EditJob /></ProtectedRoute>} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
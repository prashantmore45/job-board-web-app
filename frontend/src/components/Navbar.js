import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        Job<span style={{ color: "#333" }}>Board</span>
      </div>

      <div className="mobile-menu-icon" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-item" onClick={toggleMenu}>Home</Link>
        
        {user ? (
          <>
            {user.role === 'employer' ? (
              <Link to="/employer-dashboard" className="nav-item" onClick={toggleMenu}>Dashboard</Link>
            ) : (
              <Link to="/candidate-dashboard" className="nav-item" onClick={toggleMenu}>Jobs Feed</Link>
            )}
            
            <Link to="/profile" className="nav-item" onClick={toggleMenu}>Profile</Link>
            
            <span className="user-greeting">Hi, {user.name.split(" ")[0]}</span>
            <button className="btn-nav btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item" onClick={toggleMenu}>Login</Link>
            <button className="btn-nav btn-primary" onClick={() => {toggleMenu(); navigate("/register")}}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
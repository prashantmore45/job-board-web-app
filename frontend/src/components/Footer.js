function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} JobBoard. All rights reserved.</p>
      <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>
        Connect with top employers and find your dream job today.
      </p>
    </footer>
  );
}

export default Footer;
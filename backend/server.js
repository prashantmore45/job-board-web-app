const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const fs = require('fs');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Make the "uploads" folder accessible to the frontend
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes 
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/application", require("./routes/appRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Job Board Server running on port ${PORT}`));
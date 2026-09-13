const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  role: { 
    type: String, 
    enum: ['employer', 'candidate'], 
    default: 'candidate' 
  },
  
  resume: { type: String, default: "" },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  // Candidate Profile Fields
  skills: [{ type: String }],
  experience: { type: String, default: "" },
  bio: { type: String, default: "" },
  portfolioUrl: { type: String, default: "" },
  
  // Employer Profile Fields
  companyName: { type: String, default: "" },
  companyWebsite: { type: String, default: "" },
  companyLocation: { type: String, default: "" },
  companyDescription: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
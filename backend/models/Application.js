const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Job", 
    required: true 
  },
  applicant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  resume: { type: String, required: true }, // Stores the file path (e.g., "uploads/resume-123.pdf")
  status: { 
    type: String, 
    enum: ['applied', 'accepted', 'rejected'], 
    default: 'applied' 
  }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
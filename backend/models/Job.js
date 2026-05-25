const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  company: { type: String, required: true, minlength: 2 },
  location: { type: String, required: true, minlength: 2 },
  description: { type: String, required: true, minlength: 10 },
  salary: { type: String, required: true, minlength: 1 },
  type: { type: String, default: "Full-time" }, // Full-time, Part-time, Contract
  
  // Link the job to the Employer who posted it
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
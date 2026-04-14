const Application = require("../models/Application");
const Job = require("../models/Job"); 
const User = require("../models/User"); 
const sendEmail = require("../utils/emailService"); 

// Apply for a job (Candidate only)

const applyForJob = async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ message: "Only Candidates can apply." });
  }
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a resume." });
  }

  try {
    const { jobId } = req.params;

    const existingApp = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied." });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: req.file.path
    });
  
    const jobDetails = await Job.findById(jobId).populate("postedBy", "email name");
    
    if (jobDetails && jobDetails.postedBy) {
      const employerEmail = jobDetails.postedBy.email;
      const subject = `New Application for ${jobDetails.title}`;
      const message = `Hello ${jobDetails.postedBy.name},\n\nA new candidate (${req.user.name}) has just applied for your job post: "${jobDetails.title}".\n\nLogin to your dashboard to review their resume.\n\nBest,\nJob Board Team`;

      await sendEmail(employerEmail, subject, message);
    }

    res.status(201).json({ message: "Application successful", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Application failed" });
  }
};


/* Get all applications for a specific job (Employer only) & @route   GET /api/application/:jobId */

const getJobApplications = async (req, res) => {

  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


/* Get applications for the logged-in Candidate & @route   GET /api/application/my-applications */

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location"); 
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


/* Update application status (Employer only) &  @route PUT /api/application/:id/status */

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application marked as ${status}`, application });
  } catch (error) {
    console.error("❌ STATUS UPDATE ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus };
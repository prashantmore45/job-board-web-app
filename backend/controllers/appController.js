const Application = require("../models/Application");
const Job = require("../models/Job");
const sendEmail = require("../utils/emailService");
const { isValidObjectId } = require("../utils/validators");

const ALLOWED_STATUSES = ["applied", "accepted", "rejected"];

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

    if (!isValidObjectId(jobId)) {
      return res.status(404).json({ message: "Job not found" });
    }

    const jobDetails = await Job.findById(jobId).populate("postedBy", "email name");
    if (!jobDetails) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApp = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied." });
    }

    // Store a stable, web-relative path. multer now writes to an absolute
    // directory, so req.file.path is absolute and must not be persisted.
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: `uploads/${req.file.filename}`
    });

    if (jobDetails.postedBy) {
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
    const { jobId } = req.params;

    if (!isValidObjectId(jobId)) {
      return res.status(404).json({ message: "Job not found" });
    }

    // An employer may only read applications for jobs they posted. Without this
    // check any employer account could dump every applicant on the platform.
    const job = await Job.findById(jobId).select("postedBy");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }

    const applications = await Application.find({ job: jobId })
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
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    const { status } = req.body;

    if (typeof status !== "string" || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Application not found" });
    }

    const application = await Application.findById(req.params.id).populate("job", "postedBy");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Only the employer who posted the job may change an application's status.
    if (!application.job || application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.json({ message: `Application marked as ${status}`, application });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus };

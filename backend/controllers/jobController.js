const Job = require("../models/Job");
const { escapeRegex, isValidObjectId } = require("../utils/validators");

// Only these fields may ever be written from a request body. Anything else
// (notably postedBy) is dropped, so ownership cannot be reassigned.
const JOB_FIELDS = ["title", "company", "location", "description", "salary", "type"];

const pickJobFields = (body) => {
  const out = {};
  for (const field of JOB_FIELDS) {
    if (body[field] !== undefined) out[field] = body[field];
  }
  return out;
};

/* Fetch jobs with search (optional) & @route   GET /api/jobs?keyword=React&location=Remote */

const getJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    let query = {};

    // Input is escaped before it reaches $regex: unescaped user input lets a
    // crafted pattern such as (a+)+$ pin the database CPU (ReDoS).
    if (typeof keyword === "string" && keyword.trim()) {
      query.title = { $regex: escapeRegex(keyword.trim()), $options: "i" };
    }

    if (typeof location === "string" && location.trim()) {
      query.location = { $regex: escapeRegex(location.trim()), $options: "i" };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


/* Get single job details & @route   GET /api/jobs/:id */

const getJobById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: "Job not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


/* Create a new job (Employer only) & @route   POST /api/jobs */

const createJob = async (req, res) => {
  const { title, company, location, description, salary, type } = req.body;

  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: "Access denied. Only Employers can post jobs." });
  }

  // Validate job fields
  if (typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({ message: "Job title must be at least 3 characters long." });
  }
  if (typeof company !== "string" || company.trim().length < 2) {
    return res.status(400).json({ message: "Company name must be at least 2 characters long." });
  }
  if (typeof location !== "string" || location.trim().length < 2) {
    return res.status(400).json({ message: "Location must be at least 2 characters long." });
  }
  if (typeof description !== "string" || description.trim().length < 10) {
    return res.status(400).json({ message: "Description must be at least 10 characters long." });
  }
  if (typeof salary !== "string" || salary.trim().length < 1) {
    return res.status(400).json({ message: "Salary information is required." });
  }

  try {
    const job = new Job({
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
      salary: salary.trim(),
      type,
      postedBy: req.user._id
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to create job" });
  }
};


/* Delete a job & @route  DELETE /api/jobs/:id */

const deleteJob = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


/*Update a job & @route PUT /api/jobs/:id */

const updateJob = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Job not found" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this job" });
    }

    // Whitelist the payload and run schema validators, so an edit can no longer
    // reassign postedBy or write values that would fail on create.
    const updates = pickJobFields(req.body);

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json(updatedJob);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getJobs, getJobById, createJob, deleteJob, updateJob };

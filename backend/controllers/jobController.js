const Job = require("../models/Job");

/* Fetch jobs with search (optional) & @route   GET /api/jobs?keyword=React&location=Remote */

const getJobs = async (req, res) => {
  try {
    const { keyword, location } = req.query;

    let query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" }; 
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
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
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: "Job title must be at least 3 characters long." });
  }
  if (!company || company.trim().length < 2) {
    return res.status(400).json({ message: "Company name must be at least 2 characters long." });
  }
  if (!location || location.trim().length < 2) {
    return res.status(400).json({ message: "Location must be at least 2 characters long." });
  }
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: "Description must be at least 10 characters long." });
  }
  if (!salary || salary.trim().length < 1) {
    return res.status(400).json({ message: "Salary information is required." });
  }

  try {
    const job = new Job({
      title,
      company,
      location,
      description,
      salary,
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
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true, 
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getJobs, getJobById, createJob, deleteJob, updateJob };
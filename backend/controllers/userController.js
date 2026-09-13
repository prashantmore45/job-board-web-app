const User = require("../models/User");
const { isValidObjectId } = require("../utils/validators");

/* Get Saved Jobs & @route   GET /api/users/saved-jobs */
const getSavedJobs = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: "Access denied." });
    }

    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Toggle Save Job & @route   POST /api/users/save-job/:id */
const toggleSaveJob = async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: "Access denied." });
    }

    const jobId = req.params.id;
    if (!isValidObjectId(jobId)) {
      return res.status(404).json({ message: "Invalid job ID" });
    }

    const user = await User.findById(req.user._id);

    const isSaved = user.savedJobs.some(id => id.toString() === jobId.toString());

    if (isSaved) {
      // Remove job
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId.toString());
    } else {
      // Add job
      user.savedJobs.push(jobId);
    }

    await user.save();
    res.json({ savedJobs: user.savedJobs, isSaved: !isSaved });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Get User Profile & @route   GET /api/users/profile */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -savedJobs");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Update User Profile & @route   PUT /api/users/profile */
const updateProfile = async (req, res) => {
  try {
    const { name, skills, experience, bio, portfolioUrl } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (experience !== undefined) user.experience = experience;
    if (bio !== undefined) user.bio = bio;
    if (portfolioUrl !== undefined) user.portfolioUrl = portfolioUrl;
    
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getSavedJobs, toggleSaveJob, getProfile, updateProfile };

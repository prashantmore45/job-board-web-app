const express = require("express");
const { getSavedJobs, toggleSaveJob, getProfile, updateProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/saved-jobs", protect, getSavedJobs);
router.post("/save-job/:id", protect, toggleSaveJob);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;

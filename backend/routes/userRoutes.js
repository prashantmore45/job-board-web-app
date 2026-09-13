const express = require("express");
const { getSavedJobs, toggleSaveJob } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/saved-jobs", protect, getSavedJobs);
router.post("/save-job/:id", protect, toggleSaveJob);

module.exports = router;

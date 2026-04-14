const express = require("express");
const router = express.Router();
const { getJobs, getJobById, createJob, deleteJob, updateJob } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");


router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.delete("/:id", protect, deleteJob);
router.put("/:id", protect, updateJob);

module.exports = router;
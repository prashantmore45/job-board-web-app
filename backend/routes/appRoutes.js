const express = require("express");
const router = express.Router();
const { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus } = require("../controllers/appController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/my-applications", protect, getMyApplications);

router.post("/:jobId", protect, upload.single("resume"), applyForJob);

router.get("/:jobId", protect, getJobApplications);

router.put("/:id/status", protect, updateApplicationStatus);

module.exports = router;
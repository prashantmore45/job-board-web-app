const multer = require("multer");
const path = require("path");

// Configure where to save the files
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // Save in the 'uploads' folder
  },
  filename(req, file, cb) {
    // Rename file to: resume-USERID-TIMESTAMP.pdf
    cb(null, `resume-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter to accept only PDFs 
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed!"), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
  // fileFilter: fileFilter 
});

module.exports = upload;
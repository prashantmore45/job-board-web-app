const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(req, file, cb) {
    // The extension is hard-coded to .pdf rather than taken from the upload.
    // express.static picks Content-Type from the extension, so an attacker-
    // controlled extension (.html, .svg) would be served as executable content.
    // A random suffix also stops resume URLs from being guessed by timestamp.
    const unique = crypto.randomBytes(8).toString("hex");
    cb(null, `resume-${Date.now()}-${unique}.pdf`);
  },
});

// Accept PDFs only. Checks both the declared MIME type and the original
// extension; some browsers send application/octet-stream for PDFs.
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const okMime =
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/octet-stream";

  if (ext === ".pdf" && okMime) {
    return cb(null, true);
  }
  return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "resume"));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter,
});

module.exports = upload;
module.exports.UPLOAD_DIR = UPLOAD_DIR;

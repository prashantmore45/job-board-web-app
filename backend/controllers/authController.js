const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { escapeRegex, isNonEmptyString } = require("../utils/validators");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const normalizeEmail = (email) => email.trim().toLowerCase();

// Existing accounts were stored with whatever casing the user typed, so an
// exact lookup is tried first (uses the unique index) and only falls back to a
// case-insensitive match when nothing is found. New accounts are stored lowercase.
const findUserByEmail = async (rawEmail) => {
  const trimmed = rawEmail.trim();

  const exact = await User.findOne({ email: trimmed });
  if (exact) return exact;

  const lowered = normalizeEmail(rawEmail);
  if (lowered !== trimmed) {
    const lower = await User.findOne({ email: lowered });
    if (lower) return lower;
  }

  return User.findOne({
    email: new RegExp("^" + escapeRegex(trimmed) + "$", "i"),
  });
};

/* Register new user & @route   POST /api/auth/register */

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Reject non-string values so Mongo query operators cannot be smuggled in.
    if (!isNonEmptyString(name)) {
      return res.status(400).json({ message: "Name is required." });
    }
    if (!isNonEmptyString(email) || !EMAIL_PATTERN.test(email.trim())) {
      return res.status(400).json({ message: "A valid email address is required." });
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      });
    }
    if (role !== undefined && role !== "candidate" && role !== "employer") {
      return res.status(400).json({ message: "Invalid role." });
    }

    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizeEmail(email),
      password: hashedPassword,
      role: role || 'candidate'
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Registration failed" });
  }
};


/* Login user & @route   POST /api/auth/login */

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isNonEmptyString(email) || typeof password !== "string") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = await findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};


/* Update user profile & @route   PUT /api/auth/profile */

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email } = req.body;

    if (name !== undefined) {
      if (!isNonEmptyString(name)) {
        return res.status(400).json({ message: "Name cannot be empty." });
      }
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (!isNonEmptyString(email) || !EMAIL_PATTERN.test(email.trim())) {
        return res.status(400).json({ message: "A valid email address is required." });
      }

      const nextEmail = normalizeEmail(email);
      if (nextEmail !== user.email.toLowerCase()) {
        const taken = await findUserByEmail(nextEmail);
        if (taken && taken._id.toString() !== user._id.toString()) {
          return res.status(400).json({ message: "That email is already in use." });
        }
      }
      user.email = nextEmail;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "That email is already in use." });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile };

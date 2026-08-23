/* Small shared helpers for input hardening. */

// Escape regex metacharacters so user input can never act as a regex operator
// (prevents ReDoS and unintended pattern matching in search queries).
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Mongo query operators can be smuggled in via JSON bodies (e.g. { "$gt": "" }).
// Every value we put into a query filter must be a plain string.
const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

module.exports = { escapeRegex, isNonEmptyString, isValidObjectId };

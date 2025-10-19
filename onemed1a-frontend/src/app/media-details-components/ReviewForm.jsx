"use client";

import { useState, useCallback } from "react";
import PropTypes from "prop-types";

const MIN_CHARS = 10;
const MAX_CHARS = 2000;

/**
 * ReviewForm component for creating or editing a review.
 * Validates length (10-2,000 chars) and provides character counter.
 *
 * @param {Object} props
 * @param {string} props.initialValue - Initial review text (for editing)
 * @param {function} props.onSave - Callback when Save is clicked: (reviewText) => Promise<void>
 * @param {function} props.onCancel - Callback when Cancel is clicked
 * @param {boolean} props.disabled - Whether the form is disabled (e.g., during save)
 * @param {string} props.className - Additional CSS classes
 */
export default function ReviewForm({
  initialValue = "",
  onSave,
  onCancel,
  disabled = false,
  className = "",
}) {
  const [reviewText, setReviewText] = useState(initialValue);
  const [error, setError] = useState("");

  const charCount = reviewText.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleSave = useCallback(async () => {
    if (!isValid) {
      setError(
        `Review must be between ${MIN_CHARS} and ${MAX_CHARS} characters.`
      );
      return;
    }
    setError("");
    try {
      await onSave(reviewText);
    } catch (err) {
      setError("Failed to save review. Please try again.");
    }
  }, [reviewText, isValid, onSave]);

  const handleCancel = useCallback(() => {
    setReviewText(initialValue);
    setError("");
    onCancel?.();
  }, [initialValue, onCancel]);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block">
        <span className="text-gray-900 font-semibold text-lg">Your Review</span>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          disabled={disabled}
          placeholder="Share your thoughts about this media (10-2,000 characters)..."
          className={`mt-2 block w-full rounded-md border px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          rows={6}
        />
      </label>

      {/* Character counter */}
      <div className="flex items-center justify-between text-sm">
        <span
          className={`font-medium ${
            charCount < MIN_CHARS
              ? "text-gray-500"
              : charCount > MAX_CHARS
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {charCount} / {MAX_CHARS} characters
          {charCount < MIN_CHARS && ` (minimum ${MIN_CHARS})`}
        </span>
      </div>

      {/* Error message */}
      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={disabled || !isValid}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {disabled ? "Saving..." : "Save Review"}
        </button>
        <button
          onClick={handleCancel}
          disabled={disabled}
          className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

ReviewForm.propTypes = {
  initialValue: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

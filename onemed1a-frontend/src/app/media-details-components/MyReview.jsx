"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import ReviewForm from "./ReviewForm";

/**
 * MyReview component displays the user's existing review with Edit and Delete actions.
 * When editing, it shows the ReviewForm inline.
 *
 * @param {Object} props
 * @param {string} props.reviewText - The user's review text
 * @param {function} props.onEdit - Callback when review is edited: (newText) => Promise<void>
 * @param {function} props.onDelete - Callback when review is deleted: () => Promise<void>
 * @param {boolean} props.disabled - Whether actions are disabled (e.g., during API call)
 * @param {string} props.className - Additional CSS classes
 */
export default function MyReview({
  reviewText,
  onEdit,
  onDelete,
  disabled = false,
  className = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveEdit = async (newText) => {
    try {
      await onEdit(newText);
      setIsEditing(false);
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your review? This cannot be undone."
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      setIsDeleting(false);
      throw err;
    }
  };

  if (isEditing) {
    return (
      <div className={className}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Edit Your Review
        </h3>
        <ReviewForm
          initialValue={reviewText}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Your Review</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={disabled || isDeleting}
            className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={disabled || isDeleting}
            className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {reviewText}
        </p>
      </div>
    </div>
  );
}

MyReview.propTypes = {
  reviewText: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

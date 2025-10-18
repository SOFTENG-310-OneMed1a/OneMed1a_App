"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import ReviewForm from "./ReviewForm";
import MyReview from "./MyReview";
import Toast from "./Toast";
import { uppsertMediaStatus } from "@/api/mediaStatusApi";

/**
 * ReviewSection component manages the complete review functionality.
 * Shows either the review form (if no review) or the existing review with edit/delete.
 *
 * @param {Object} props
 * @param {string} props.userId - Current user ID (required for auth check)
 * @param {string} props.mediaId - Media item ID
 * @param {string} props.mediaType - Media type (MOVIE, TV, MUSIC, BOOKS)
 * @param {string} props.initialReviewText - Existing review text (if any)
 * @param {string} props.statusId - Existing UserMediaStatus ID (needed for updates)
 * @param {string} props.currentStatus - Current media status (e.g., "COMPLETED")
 * @param {number} props.currentRating - Current rating (1-5)
 * @param {string} props.className - Additional CSS classes
 */
export default function ReviewSection({
  userId,
  mediaId,
  mediaType,
  initialReviewText = "",
  statusId = null,
  currentStatus = null,
  currentRating = null,
  className = "",
}) {
  const router = useRouter();
  const [reviewText, setReviewText] = useState(initialReviewText);
  const [showForm, setShowForm] = useState(!initialReviewText);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, [userId, router]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  /**
   * Save or update review via the existing UserMediaStatus endpoint.
   * Uses optimistic updates with rollback on error.
   */
  const handleSaveReview = useCallback(
    async (newReviewText) => {
      if (!userId) {
        router.push("/login");
        return;
      }

      // Optimistic update
      const previousText = reviewText;
      setReviewText(newReviewText);
      setShowForm(false);
      setLoading(true);

      try {
        // Use the existing upsert endpoint - it handles both create and update
        await uppsertMediaStatus({
          id: statusId, // null for new, or existing ID
          userId,
          mediaId,
          status: currentStatus || "COMPLETED", // Default to COMPLETED if not set
          rating: currentRating, // Preserve existing rating
          reviewText: newReviewText,
        });

        showToast("Review saved successfully!", "success");
      } catch (error) {
        // Rollback on error
        setReviewText(previousText);
        setShowForm(!previousText);
        showToast("Failed to save review. Please try again.", "error");
        console.error("Failed to save review:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [
      userId,
      mediaId,
      mediaType,
      statusId,
      currentStatus,
      currentRating,
      reviewText,
      router,
      showToast,
    ]
  );

  /**
   * Delete review by setting reviewText to empty string via upsert.
   */
  const handleDeleteReview = useCallback(async () => {
    if (!userId) {
      router.push("/login");
      return;
    }

    // Optimistic update
    const previousText = reviewText;
    setReviewText("");
    setShowForm(true);
    setLoading(true);

    try {
      // Clear the review by setting it to empty string
      await uppsertMediaStatus({
        id: statusId,
        userId,
        mediaId,
        status: currentStatus || "COMPLETED",
        rating: currentRating, // Preserve rating
        reviewText: "", // Clear review
      });

      showToast("Review deleted successfully!", "success");
    } catch (error) {
      // Rollback on error
      setReviewText(previousText);
      setShowForm(false);
      showToast("Failed to delete review. Please try again.", "error");
      console.error("Failed to delete review:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [
    userId,
    mediaId,
    mediaType,
    statusId,
    currentStatus,
    currentRating,
    reviewText,
    router,
    showToast,
  ]);

  // Don't render if not authenticated (redirect handles this)
  if (!userId) {
    return null;
  }

  return (
    <div className={className}>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      {showForm ? (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Write a Review
          </h3>
          <ReviewForm
            initialValue={reviewText}
            onSave={handleSaveReview}
            onCancel={() => {
              if (reviewText) {
                setShowForm(false);
              }
            }}
            disabled={loading}
          />
        </div>
      ) : (
        reviewText && (
          <MyReview
            reviewText={reviewText}
            onEdit={handleSaveReview}
            onDelete={handleDeleteReview}
            disabled={loading}
          />
        )
      )}

      {/* Show "Add Review" button if review exists and form is hidden */}
      {!showForm && reviewText && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
        >
          + Add Another Review
        </button>
      )}
    </div>
  );
}

ReviewSection.propTypes = {
  userId: PropTypes.string,
  mediaId: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  initialReviewText: PropTypes.string,
  statusId: PropTypes.string,
  currentStatus: PropTypes.string,
  currentRating: PropTypes.number,
  className: PropTypes.string,
};

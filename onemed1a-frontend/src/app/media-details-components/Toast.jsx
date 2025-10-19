"use client";

import { useEffect } from "react";

/**
 * Toast notification component for displaying success and error messages.
 * Auto-dismisses after the specified duration.
 *
 * @param {Object} props
 * @param {string} props.message - Message to display
 * @param {string} props.type - Type of toast: "success" or "error"
 * @param {function} props.onClose - Callback when toast is dismissed
 * @param {number} props.duration - Duration in ms before auto-dismiss (default: 3000)
 */
export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const icon = type === "success" ? "✓" : "✕";

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}
      >
        <span className="text-xl font-bold">{icon}</span>
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold text-xl"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

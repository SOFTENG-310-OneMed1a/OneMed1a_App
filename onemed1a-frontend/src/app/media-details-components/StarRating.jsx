"use client";
import { useEffect, useMemo, useState } from "react";

export default function StarRating({
                                       label = "Edit Your Rating",
                                       value = 0,                     // initial/controlled value (1–5)
                                       onChange = (v) => console.log("Rating changed:", v),
                                       updatedAt,                     // Date | string; if omitted, shows today's date
                                       disabled = false,
                                       className = "",
                                   }) {
    const [rating, setRating] = useState(value);
    const [hover, setHover] = useState(0);

    useEffect(() => setRating(value), [value]);

    const display = hover || rating;

    const lastUpdated = useMemo(() => {
        const d = updatedAt ? new Date(updatedAt) : new Date();
        // Format similar to your mock: DD/MM/YYYY
        return d.toLocaleDateString("en-NZ");
    }, [updatedAt]);

    const setAndNotify = (n) => {
        if (disabled) return;
        setRating(n);
        onChange?.(n);
    };

    const handleKeyDown = (e) => {
        if (disabled) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            const next = Math.min(5, rating + 1);
            setAndNotify(next);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            const next = Math.max(1, rating - 1);
            setAndNotify(next);
        }
    };

    return (
        <section
            className={`px-4 py-4 ${className}`}
            aria-label={label}
        >
            <h3 className="mb-3 text-sm font-semibold text-neutral-900">{label}</h3>

            <div className="flex items-center gap-3">
                <div
                    className="flex items-center gap-2"
                    role="radiogroup"
                    aria-label="Star rating"
                    onKeyDown={handleKeyDown}
                >
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            role="radio"
                            aria-checked={rating === n}
                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                            disabled={disabled}
                            className={`h-8 w-8 cursor-pointer rounded outline-none transition ${
                                disabled ? "opacity-60" : "hover:scale-[1.06]"
                            } focus:ring-2 focus:ring-neutral-400`}
                            onMouseEnter={() => setHover(n)}
                            onMouseLeave={() => setHover(0)}
                            onFocus={() => setHover(n)}
                            onBlur={() => setHover(0)}
                            onClick={() => setAndNotify(n)}
                        >
                            <Star filled={n <= display} />
                        </button>
                    ))}
                </div>

                <span className="ml-auto text-xs text-neutral-500">
          Last updated {lastUpdated}
        </span>
            </div>
        </section>
    );
}

/* SVG star with yellow fill when active */
function Star({ filled }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`h-full w-full ${filled ? "fill-yellow-400" : "fill-transparent"} stroke-yellow-400`}
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M12 3.6l2.59 5.25 5.79.84-4.19 4.08.99 5.77L12 17.98 6.82 19.54l.99-5.77L3.62 9.69l5.79-.84L12 3.6z" />
        </svg>
    );
}

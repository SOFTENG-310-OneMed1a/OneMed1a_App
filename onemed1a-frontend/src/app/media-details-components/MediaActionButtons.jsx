"use client";

export default function MediaActionButtons({
                                                primaryLabel = "Add To Collection",
                                                secondaryLabel = "Plan to Watch",
                                                onPrimary = () => console.log("Add To Collection clicked"),
                                                onSecondary = () => console.log("Plan to Watch clicked"),
                                                disabled = false,
                                                className = "",
                                            }) {
    const baseBtn =
        "rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-medium text-neutral-100 " +
        "ring-1 ring-neutral-800 shadow-sm transition " +
        "hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 " +
        "disabled:opacity-60 disabled:cursor-not-allowed";

    return (
        <section className={`px-4 py-5 ${className}`}>
            <div className="flex items-center justify-center gap-4">
                <button
                    type="button"
                    className={baseBtn}
                    onClick={onPrimary}
                    disabled={disabled}
                    aria-label={primaryLabel}
                >
                    {primaryLabel}
                </button>
                <button
                    type="button"
                    className={baseBtn}
                    onClick={onSecondary}
                    disabled={disabled}
                    aria-label={secondaryLabel}
                >
                    {secondaryLabel}
                </button>
            </div>
        </section>
    );
}

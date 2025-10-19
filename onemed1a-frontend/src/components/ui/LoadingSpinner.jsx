'use client';
import Image from 'next/image';

export default function LoadingSpinner({
  message = 'Loading...',
  overlay = true,
  scope = 'viewport', // 'viewport' | 'container'
}) {
  const inner = (
    <div className="flex flex-col items-center justify-center">
      {/* Pumping logo */}
      <div className="animate-pump">
        <Image
          src="/Favicon.png"
          alt="Loading logo"
          width={100}
          height={100}
          className="drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]"
        />
      </div>

      {/* Loading text */}
      <p className="mt-4 text-lg font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse">
        {message}
      </p>
    </div>
  );

  if (!overlay) return inner;

  const overlayClass =
    scope === 'container' ? 'absolute inset-0' : 'fixed inset-0';

  return (
    <div
      className={`${overlayClass} z-50 grid place-items-center bg-black/70`}
    >
      {inner}
    </div>
  );
}

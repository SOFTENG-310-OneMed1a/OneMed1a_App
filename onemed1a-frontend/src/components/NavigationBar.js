"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";
import Logo from "./Logo";
import MediaNavigation from "./MediaNavigation";
import SearchBar from "./SearchBar";

/**
 * NavigationBar component for the application layout.
 * Only shows logo on authentication routes (login, signup).
 * @returns NavigationBar component that includes the logo, media navigation tabs, search bar, and recommendations link.
 */
export default function NavigationBar() {
  const pathname = usePathname() || "/";
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-6">
        {/* Logo (always visible) */}
        <div className="flex-shrink-0">
          <Logo isAuth={isAuthRoute} />
        </div>

        {/* Only show the rest of the navigation bar if not on auth routes */}
        {!isAuthRoute && (
          <>
            {/* SearchBar */}
            <div className="flex-1 flex justify-center">
              <SearchBar />
            </div>

            {/* MediaNavigation */}
            <div className="flex-shrink-0 flex items-center">
              <MediaNavigation />
            </div>

            {/* Recommendations Link */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link
                href="/recommendations"
                className="px-4 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-full bg-red-600 text-white hover:bg-red-700 whitespace-nowrap"
              >
                Recommendations
              </Link>
            </div>

            {/* Profile */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/profile" className="hover-red">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="black"
                  className="size-10 hover:stroke-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

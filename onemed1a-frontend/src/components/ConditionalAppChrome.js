'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';
import MediaNavigation from './MediaNavigation';
import SearchBar from './SearchBar';

export default function ConditionalAppChrome() {
  const pathname = usePathname() || '/';
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');
  if (isAuthRoute) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-neutral-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Logo />
        </div>

        <div className="flex-grow flex justify-center">
          <MediaNavigation />
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="w-48 md:w-64">
            <SearchBar />
          </div>
          <Link
            href="/recommendations"
            className="px-4 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-full bg-red-600 text-white hover:bg-red-700 whitespace-nowrap"
          >
            Recommendations
          </Link>
        </div>
      </div>
    </header>
  );
}
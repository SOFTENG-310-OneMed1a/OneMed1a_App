"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";

export default function MediaNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabs = [
    { name: "Movies", href: "/movie" },
    { name: "TV", href: "/tv" },
    { name: "Books", href: "/books" },
    { name: "Audio", href: "/audio" },
  ];

  const rightTab = { name: "Recommendations", href: "/recommendations" };

  // Restore q from URL so the input reflects current filter
  const initialQ = searchParams?.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    // keep input in sync if URL changes externally
    setQ(searchParams?.get("q") ?? "");
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <nav className="w-full flex items-center justify-between" role="navigation" aria-label="Media categories">
        {/* Empty div for left spacing */}
        <div className="flex-1"></div>
        
        {/* Center tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {tabs.map((t) => {
            const active = pathname?.startsWith(t.href);
            return (
              <Link
                key={t.name}
                href={t.href + (q ? `?q=${encodeURIComponent(q)}` : "")}
                aria-current={active ? "page" : undefined}
                className={`px-4 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-full transition-colors
                  ${active ? "bg-blue-600 text-white" : "bg-red-600 text-white hover:bg-red-700"}`}
              >
                {t.name}
              </Link>
            );
          })}
        </div>

        {/* Right tab */}
        <div className="flex-1 flex justify-end">
          <Link
            href={rightTab.href + (q ? `?q=${encodeURIComponent(q)}` : "")}
            aria-current={pathname?.startsWith(rightTab.href) ? "page" : undefined}
            className={`px-4 py-1.5 text-sm font-semibold uppercase tracking-wide rounded-full transition-colors
              ${pathname?.startsWith(rightTab.href) ? "bg-blue-600 text-white" : "bg-red-600 text-white hover:bg-red-700"}`}
          >
            {rightTab.name}
          </Link>
        </div>
      </nav>

      {/* Search bar */}
      <SearchBar />
    </div>
  );
}

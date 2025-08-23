"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";

export default function MediaNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabs = [
    { name: "Movies", href: "/movie" },
    { name: "TV", href: "/tv" },
    { name: "Books", href: "/books" },
    { name: "Audio", href: "/audio" },
  ];

  // Restore q from URL so the input reflects current filter
  const initialQ = searchParams?.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    // keep input in sync if URL changes externally
    setQ(searchParams?.get("q") ?? "");
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <nav className="flex flex-wrap justify-center gap-3" role="navigation" aria-label="Media categories">
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
      </nav>

      {/* Search bar */}
        <SearchBar />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function MediaNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only the four media tabs live here (centered)
  const tabs = [
    { name: "Movies", href: "/movie" },
    { name: "TV", href: "/tv" },
    { name: "Books", href: "/books" },
    { name: "Audio", href: "/audio" },
  ];

  // Persist current q param on tab switches
  const initialQ = searchParams?.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  useEffect(() => {
    setQ(searchParams?.get("q") ?? "");
  }, [searchParams]);

  return (
    <nav className="flex items-center justify-center" role="navigation" aria-label="Media categories">
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
    </nav>
  );
}
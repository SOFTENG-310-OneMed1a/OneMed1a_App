import Link from "next/link";

export default function MediaNav() {
  const tabs = [
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tvshows" },
    { name: "Books", href: "/books" },
    { name: "Music", href: "/music" },
  ];

  return (
    <nav className="flex gap-4 bg-gray-100 p-4 rounded">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className="px-3 py-1 rounded hover:bg-gray-300 transition font-medium"
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}

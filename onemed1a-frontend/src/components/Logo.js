"use client"; // needed if you're on Next.js App Router
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Logo component that changes appearance based on hover state (black to red).
 */
export default function Logo({ isAuth }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block"
    >
      <Image
        src={hovered ? "/Logo (red).png" : "/Logo (black).png"} // Logo changes color on hover
        alt="OneMedia Logo"
        width={180}
        height={60}
        priority
      />
    </Link>
  );
}

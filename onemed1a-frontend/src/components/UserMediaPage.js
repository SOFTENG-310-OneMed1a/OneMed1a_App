"use client";

import { useEffect, useState } from "react";
import MediaGrid from "@/components/MediaGrid";
import { pickCover, fetchJSON } from "@/lib/mediaUtils";

/**
 * UserMediaPage component for displaying user's media collection (inside profile).
 * Used in dynamic routes for different media types (e.g., movies, tv, music, books).
 */
export default function UserMediaPage({ mediaType }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      const cookieUserId = document.cookie
        .split("; ")
        .find((c) => c.startsWith("userId="))
        ?.split("=")[1];

      if (!cookieUserId) return;

      // Fetch user media for the given type
      const rawMedia = await fetchJSON(
        `/api/v1/usermedia/user/${cookieUserId}?type=${mediaType.toUpperCase()}`
      );

      // Map raw media to display items
      const mapped = rawMedia.map((m) => {
        const posterPath =
          m.media.tmdbPosterPath ?? m.media.posterUrl ?? m.media.coverUrl;
        const backdropPath =
          m.media.tmdbBackdropPath ?? m.media.backdropUrl ?? m.media.coverUrl;

        const type = mediaType.toLowerCase();
        const id = m.media.mediaId ?? m.id;

        return {
          id: m.id,
          externalMediaId: m.media.mediaId,
          coverUrl: pickCover(posterPath, backdropPath, "w342", "w780"),
          posterUrl: m.media.posterUrl,
          title: m.media.title,
          year: m.media.releaseDate?.split("-")[0],
          type,
          rating: m.rating,
          href: `/collection/${type}/${id}`, // dynamic link
        };
      });

      setItems(mapped);
      setLoading(false);
    }

    loadMedia();
  }, [mediaType]);

  // Callback to remove an item locally after deletion
  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Render loading or empty states
  if (loading) return <p>Loading your {mediaType}...</p>;
  if (items.length === 0) return <p>No {mediaType} saved yet.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Your {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
      </h1>
      <MediaGrid items={items} onRemove={handleRemove} />
    </div>
  );
}

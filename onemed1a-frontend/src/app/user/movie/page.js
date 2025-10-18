"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { pickCover, fetchJSON } from "@/lib/mediaUtils";
import MediaGrid from "@/components/MediaGrid";

export default function UserMoviesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      const cookieUserId = document.cookie
        .split("; ")
        .find((c) => c.startsWith("userId="))
        ?.split("=")[1];

      if (!cookieUserId) return;

      const movies = await fetchJSON(
        `/api/v1/usermedia/user/${cookieUserId}?type=MOVIE`
      );

      const mapped = movies.map((m) => {
        const posterPath = m.media.tmdbPosterPath ?? m.media.posterUrl;
        const backdropPath = m.media.tmdbBackdropPath ?? m.media.backdropUrl;
        return {
          id: m.id,
          externalMediaId: m.media.mediaId,
          coverUrl: pickCover(posterPath, backdropPath, "w342", "w780"),
          posterUrl: m.media.posterUrl,
          title: m.media.title,
          year: m.media.releaseDate?.split("-")[0],
          type: "movie",
          rating: m.rating,
          href: `/movie/${m.media.mediaId}`,
        };
      });

      setItems(mapped);
      setLoading(false);
    }

    loadMovies();
  }, []);

  if (loading) return <p>Loading your movies...</p>;
  if (items.length === 0) return <p>No movies saved yet.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Movies</h1>
      <MediaGrid items={items} />
    </div>
  );
}

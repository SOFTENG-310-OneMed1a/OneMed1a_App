"use client";

import { useEffect, useState } from "react";
import MediaGrid from "@/components/MediaGrid";
import { pickCover, fetchJSON } from "@/lib/mediaUtils";

export default function UserMediaPage({ mediaType }) {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      // Get access token from cookies
      const accessToken = document.cookie
        .split("; ")
        .find((c) => c.startsWith("access_token="))
        ?.split("=")[1];

      if (!accessToken) {
        console.log("No access token found");
        setLoading(false);
        return;
      }

      const cookieHeader = `access_token=${accessToken}`;

      try {
        // Get user profile -> userId
        const profile = await fetchJSON("/api/v1/getprofile", {
          headers: { cookie: cookieHeader },
        });

        if (!profile?.id) {
          console.log("No user profile found");
          setLoading(false);
          return;
        }

        const uid = profile.id;
        setUserId(uid);

        console.log("Loading media for user:", uid, "type:", mediaType);

        // Fetch user media
        const rawMedia = await fetchJSON(
          `/api/v1/usermedia/user/${uid}?type=${mediaType.toUpperCase()}`
        );

        console.log("Raw media data:", rawMedia);

        // Map raw media to display items
        const mapped = rawMedia.map((m) => {
          const posterPath =
            m.media.tmdbPosterPath ?? m.media.posterUrl ?? m.media.coverUrl;
          const backdropPath =
            m.media.tmdbBackdropPath ?? m.media.backdropUrl ?? m.media.coverUrl;

          const type = mediaType.toUpperCase();
          const id = m.media.mediaId ?? m.id;

          return {
            id: m.id, // user media status id
            externalMediaId: m.media.mediaId, // external id
            coverUrl: pickCover(posterPath, backdropPath, "w342", "w780"),
            posterUrl: m.media.posterUrl,
            title: m.media.title,
            year: m.media.releaseDate?.split("-")[0],
            type,
            rating: m.rating,
            href: `/collection/${type}/${id}`,
          };
        });

        console.log("Mapped items:", mapped);
        setItems(mapped);
      } catch (error) {
        console.error("Error loading media:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, [mediaType]);

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) return <p>Loading your {mediaType}...</p>;
  if (items.length === 0) return <p>No {mediaType} saved yet.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Your {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
      </h1>
      {userId && (
        <MediaGrid items={items} onRemove={handleRemove} userId={userId} />
      )}
    </div>
  );
}

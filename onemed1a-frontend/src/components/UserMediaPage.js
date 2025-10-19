import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MediaGrid from "@/components/MediaGrid";
import { pickCover, fetchJSON } from "@/lib/mediaUtils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UserMediaPage({ mediaType }) {
  const cookieStore = await cookies();
  const accessTokenCookie = cookieStore.get("access_token");

  if (!accessTokenCookie) {
    redirect("/login");
  }

  const API_BASE = process.env.API_BASE || "http://localhost:8080";
  const cookieHeader = `access_token=${accessTokenCookie.value}`;

  // Fetch profile
  const res = await fetch(`${API_BASE}/api/v1/getprofile`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) redirect("/login");

  const profile = await res.json();
  const userId = profile?.id;
  if (!userId) redirect("/login");

  // Fetch user-specific media
  const rawMedia = await fetchJSON(
    `/api/v1/usermedia/user/${userId}?type=${mediaType.toUpperCase()}`
  );

  const items = rawMedia.map((m) => {
    const tmdbBase = "https://image.tmdb.org/t/p/";

    const posterPath =
      m.media.tmdbPosterPath ?? m.media.posterUrl ?? m.media.coverUrl ?? null;

    const backdropPath =
      m.media.tmdbBackdropPath ?? m.media.backdropUrl ?? null;

    // Normalize both poster and backdrop
    const normalize = (path, size) => {
      if (!path) return null;
      if (path.startsWith("http")) return path;
      if (path.startsWith("/")) return `${tmdbBase}${size}${path}`;
      return `${tmdbBase}${size}/${path}`;
    };

    const normalizedPoster = normalize(posterPath, "w342");
    const normalizedBackdrop = normalize(backdropPath, "w780");

    return {
      id: m.id,
      externalMediaId: m.media.mediaId,
      coverUrl: pickCover(normalizedPoster, normalizedBackdrop),
      title: m.media.title,
      year: m.media.releaseDate?.split("-")[0],
      type: mediaType.toUpperCase(),
      rating: m.rating,
      href: `/collection/${mediaType}/${m.media.mediaId}`,
    };
  });

  console.log("Example item:", JSON.stringify(items[0], null, 2));

  if (items.length === 0) return <p>No {mediaType} saved yet.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Your {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}
      </h1>
      <MediaGrid items={items} userId={userId} />
    </div>
  );
}

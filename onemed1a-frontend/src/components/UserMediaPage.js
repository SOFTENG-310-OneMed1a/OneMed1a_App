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
    const posterPath =
      m.media.tmdbPosterPath || m.media.posterUrl || m.media.coverUrl;
    const normalizedPoster = posterPath?.startsWith("http")
      ? posterPath
      : `https://image.tmdb.org/t/p/w342${posterPath}`;

    const backdropPath = m.media.tmdbBackdropPath;

    return {
      id: m.id,
      externalMediaId: m.media.mediaId,
      coverUrl: pickCover(normalizedPoster, backdropPath, "w342", "w780"),
      title: m.media.title,
      year: m.media.releaseDate?.split("-")[0],
      type: mediaType.toUpperCase(),
      rating: m.rating,
      href: `/collection/${mediaType}/${m.media.mediaId}`,
    };
  });

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

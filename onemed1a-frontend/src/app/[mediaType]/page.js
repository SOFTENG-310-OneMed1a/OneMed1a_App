import MediaGrid from "@/components/MediaGrid";
import { getUserMediaByUserId } from "@/api/mediaAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/";

// Accept only singular paths
const normalizeTypeKey = (t = "") => {
  const key = String(t).toLowerCase();
  if (key === "movie") return "movie";
  if (key === "tv") return "tv";
  if (key === "music" || key === "audio") return "music"; // TO DO: standardise to either "music" or "audio" to avoid confusion. I would reccomend "audio" if DB entries include podcasts
  if (key === "books" || key === "book") return "books";
  return key;
};

// Map route key -> backend media type
const typeMap = {
  movie: "MOVIE",
  tv: "TV",
  music: "MUSIC",
  book: "BOOKS",
};

const toYear = (dateStr) =>
  dateStr ? Number(String(dateStr).slice(0, 4)) : undefined;

function isFullUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}
function withSize(path, size) {
  if (!path) return null;
  if (isFullUrl(path)) return path;
  const p = String(path).startsWith("/") ? String(path) : `/${path}`;
  return `${TMDB_IMG_BASE}${size}${p}`;
}
function pickCover(
  posterPath,
  backdropPath,
  posterSize = "w342",
  backdropSize = "w780"
) {
  return (
    withSize(posterPath, posterSize) ||
    withSize(backdropPath, backdropSize) ||
    "/next.svg"
  );
}

/**
 * Media page, showing grid of media items for a given media type (i.e. movie, tv, music, books).
 * @param {{ params: { id: string } }} props
 */
export default async function MediaPage({ params }) {
  const { mediaType: rawMediaType } = params;
  const mediaTypeKey = normalizeTypeKey(rawMediaType);
  const wantedType = typeMap[mediaTypeKey];

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) redirect("/");

  let raw = [];
  try {
    raw = (await getUserMediaByUserId(userId)) ?? [];
  } catch (e) {
    console.error("Failed to load user media:", e);
  }

  // 1) Try the user's library first
  // NOT WORKING - TO DO: figure out if we need this, and if so fix or remove
  let items = raw
    .filter((ums) => ums?.media?.type === wantedType)
    .map((ums) => {
      const m = ums.media ?? {};
      return {
        id: m.mediaId ?? ums.id,
        title: m.title ?? "",
        coverUrl: pickCover(m.posterUrl, m.backdropUrl),
        year: toYear(m.releaseDate),
        type: (m.type || "").toLowerCase(),
        status: ums.status,
        href: `/collection/${(m.type || "").toLowerCase()}/${
          m.mediaId ?? ums.id
        }`,
      };
    });

  // 2) If empty, fallback to discover so the page always shows posters
  if (
    items.length === 0 &&
    (mediaTypeKey === "movie" ||
      mediaTypeKey === "tv" ||
      mediaTypeKey === "music" ||
      mediaTypeKey === "books")
  ) {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";
      let url;
      if (mediaTypeKey === "tv") {
        url = `${base}/api/v1/externalMediaData/tv`;
      } else if (mediaTypeKey === "music") {
        url = `${base}/api/v1/externalMediaData/music`;
      } else if (mediaTypeKey === "books") {
        url = `${base}/api/v1/externalMediaData/books`;
      } else {
        url = `${base}/api/v1/externalMediaData/movies`;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        items = Array.isArray(data)
          ? data.map((m) => ({
              id: m.mediaId || m.externalMediaId || m.id,
              title: m.title ?? "Untitled",
              type: (m.type || "").toLowerCase(),
              year: (m.releaseDate || "").slice(0, 4) || undefined,
              rating: m.rating || undefined,
              coverUrl: pickCover(m.posterUrl, m.backdropUrl),
              href: `/collection/${(m.type || "").toLowerCase()}/${
                m.mediaId || m.externalMediaId || m.id
              }`,
            }))
          : [];
      } else {
        console.error("Discover fetch failed:", res.status, await res.text());
      }
    } catch (e) {
      console.error("Discover fetch error:", e);
    }
  }

  return (
    <div className="p-4">
      <MediaGrid items={items} />
    </div>
  );
}

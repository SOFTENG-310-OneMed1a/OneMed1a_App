import MediaNav from "@/components/MediaNavigation";
import MediaGrid from "@/components/MediaGrid";
import { getUserMediaByUserId } from "@/api/mediaAPI";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/";

const typeMap = {
  movie: "MOVIE",
  tv: "TV",
  music: "MUSIC",
  books: "BOOKS",
};

const pickCover = (posterPath, backdropPath, size = "w342") =>
    posterPath ? `${TMDB_IMG_BASE}${size}${posterPath}` :
        (backdropPath ? `${TMDB_IMG_BASE}${size}${backdropPath}` : "/next.svg");

const toYear = (dateStr) => (dateStr ? Number(String(dateStr).slice(0, 4)) : undefined);

export default async function MediaPage({ params }) {
  const { mediaType } = await params;

  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) redirect("/");

  let raw = [];
  try {
    raw = (await getUserMediaByUserId(userId)) ?? [];
  } catch (e) {
    console.error("Failed to load user media:", e);
  }

  // Normalize to [{ id, title, coverUrl, year }]
  const items = raw
      .filter((ums) => ums?.media?.type === typeMap[mediaType])
      .map((ums) => ({
        id: ums.media?.mediaId ?? ums.id, // prefer the media's UUID
        title: ums.media?.title ?? "",
        coverUrl: pickCover(ums.media?.posterUrl, ums.media?.backdropUrl),
        year: toYear(ums.media?.releaseDate),
        type: ums.media?.type.toLowerCase(),
      }));

  return (
      <div className="p-4">
        <MediaNav />
        <h1 className="text-2xl font-bold my-4">{String(mediaType).toUpperCase()}</h1>
        <MediaGrid items={items} />
      </div>
  );
}

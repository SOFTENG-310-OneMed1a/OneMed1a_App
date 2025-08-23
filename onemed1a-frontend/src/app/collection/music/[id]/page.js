// app/music/[id]/page.js
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import BackgroundImage from "@/app/media-details-components/BackgroundImage";
import PosterImage from "@/app/media-details-components/PosterImage";
import StarRating from "@/app/media-details-components/StarRating";
import CollectionDropdown from "@/app/media-details-components/CollectionDropdown";
import Divider from "@/app/media-details-components/Divider";
import { getMediaById } from "@/api/mediaClient";

async function getMusic(id) {
    try {
        const song = await getMediaById(id);
        return song; 
    } catch (error) {
        console.error("Error fetching song:", error);
        return null;
    }
}

export default async function MusicPage({ params }) {
    const { id } = await params;
    const album = await getMusic(id);
    if (!album) notFound();

 // Get userId from cookies 
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value || "9fa78e4f-c4d7-4f5e-88b0-cf96dfcce170";

  // Get current status for dropdown (placeholder)
  const currentStatus = await getUserMediaStatus(userId, album.mediaId);

  // Placeholder function for user media status
async function getUserMediaStatus(userId, mediaId) {
  // some kind of API call to get user's media status
  return "Not Added";
}

    return (
        <main className="min-h-screen bg-gray-100 text-gray-900">
            <BackgroundImage src={album.backdropUrl} alt={`${album.title} backdrop`} />

            <div className="mx-auto w-full max-w-6xl px-4 pb-20">
                {/* Back button */}
                <div className="pt-8 mb-8">
                    <a
                        href="/music"
                        className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-600"
                    >
                        <span className="text-2xl">←</span>
                    </a>
                </div>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Artwork */}
                    <div className="flex-shrink-0 lg:w-80">
                        <PosterImage
                            src={album.posterUrl}
                            alt={`${album.title} cover`}
                            className="w-full lg:w-80 rounded-lg"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {/* Title and basic info */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold mb-2 text-gray-900">{album.title}</h1>

                            <div className="text-gray-600 mb-3">
                                {/* Artists */}
                                {album.artists?.length ? (
                                    <div className="text-lg">{album.artists.join(", ")}</div>
                                ) : null}

                                {/* Meta row */}
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    {album.releaseDate && <span>{album.releaseDate}</span>}
                                    {album.duration && <span>• {album.duration}</span>}
                                    {album.label && <span>• Label: {album.label}</span>}
                                </div>
                            </div>

                            {/* Genre pills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(album.genres || []).map((genre) => (
                                    <span
                                        key={genre}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                                    >
                    {genre}
                  </span>
                                ))}
                            </div>
                        </div>

                        {/* Description - hidden on mobile, shown on desktop */}
                        <div className="hidden lg:block">
                            <p className="text-gray-700 leading-relaxed">
                                {album.description || "No description available."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description - mobile */}
                <div className="lg:hidden mt-8">
                    <p className="text-gray-700 leading-relaxed">
                        {album.description || "No description available."}
                    </p>
                </div>

                {/* Track list */}
                <div className="mt-8">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
                        Track List
                    </h3>
                    <ol className="divide-y divide-gray-200 rounded-lg bg-white ring-1 ring-gray-200">
                        {(album.tracks || []).map((t) => (
                            <li
                                key={t.no}
                                className="flex items-center justify-between px-4 py-3 text-sm"
                            >
                <span className="text-gray-900">
                  {t.no}. {t.title}
                </span>
                                <span className="text-gray-500">{t.length}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <Divider />

                <StarRating value={4} />

                <Divider />

                  <div className="mt-4">
                              <CollectionDropdown
                                currentStatus="Not Added"
                                verb="Listen"
                                verb2="Listening"
                                userId={userId}
                                mediaId={album.mediaId}
                                mediaType={album.type}
                                            // onChange={(newStatus) => {
            //   console.log("User changed status to:", newStatus);
            //   // TODO: call backend API to save new status
            // }}
                              />
                            </div>
                          </div>
        </main>
    );
}

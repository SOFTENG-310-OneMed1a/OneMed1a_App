// app/tvshows/[id]/page.js
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import BackgroundImage from "@/app/media-details-components/BackgroundImage";
import PosterImage from "@/app/media-details-components/PosterImage";
import StarRating from "@/app/media-details-components/StarRating";
import CollectionDropdown from "@/app/media-details-components/CollectionDropdown";
import Divider from "@/app/media-details-components/Divider";

/** -------------------------------------------------------
 * Toggle placeholder rendering:
 *  - true  = always show the placeholder TV show below
 *  - false = fetch real data from backend (requires API env)
 * ------------------------------------------------------ */
const USE_PLACEHOLDER = true;

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getTvShow(id) {
    if (USE_PLACEHOLDER) {
        return {
            mediaId: "tv-placeholder-id",
            externalMediaId: "119051",
            type: "TV",
            title: "Wednesday",
            firstAirYear: "2022",
            seasons: 1,
            episodes: 8,
            network: "Netflix",
            genres: ["Mystery", "Comedy", "Fantasy"],
            description:
                "Smart, sarcastic, and a little dead inside, Wednesday Addams investigates mysteries at Nevermore Academy while navigating new friendships and old grudges.",
            posterUrl: "/tv-poster.jpg",     // replace with your asset or remote URL
            backdropUrl: "/tv-backdrop.jpg", // replace with your asset or remote URL
            createdAt: new Date().toISOString(),
            rating: 4.6,
            cast: [
                "Jenna Ortega (Wednesday)",
                "Emma Myers (Enid)",
                "Gwendoline Christie (Larissa Weems)",
                "Luis Guzmán (Gomez)"
            ],
        };
    }

    // const res = await fetch(`${API_BASE}/media/${id}`, { cache: "no-store" });
    // if (res.status === 404) return null;
    // if (!res.ok) throw new Error("Failed to fetch TV show");
    // return res.json();
}

export default async function TvShowPage({ params }) {
    const show = await getTvShow(params.id);
    if (!show) notFound();

 // Get userId from cookies 
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value || "9fa78e4f-c4d7-4f5e-88b0-cf96dfcce170";

  // Get current status for dropdown (placeholder)
  const currentStatus = await getUserMediaStatus(userId, show.mediaId);

  // Placeholder function for user media status
async function getUserMediaStatus(userId, mediaId) {
  // some kind of API call to get user's media status
  return "Not Added";
}

    return (
        <main className="min-h-screen bg-gray-100 text-gray-900">
            <BackgroundImage src={show.backdropUrl} alt={`${show.title} backdrop`} />

            <div className="mx-auto w-full max-w-6xl px-4 pb-20">
                {/* Back button */}
                <div className="pt-8 mb-8">
                    <a
                        href="/tvshows"
                        className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-600"
                    >
                        <span className="text-2xl">←</span>
                    </a>
                </div>

                {/* Main content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Poster */}
                    <div className="flex-shrink-0 lg:w-80">
                        <PosterImage
                            src={show.posterUrl}
                            alt={`${show.title} poster`}
                            className="w-full lg:w-80 rounded-lg"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {/* Title and basic info */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold mb-2 text-gray-900">{show.title}</h1>
                            <div className="text-gray-600 mb-3">
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    {show.firstAirYear && <span>{show.firstAirYear}</span>}
                                    {show.seasons != null && (
                                        <span>• {show.seasons} season{show.seasons === 1 ? "" : "s"}</span>
                                    )}
                                    {show.episodes != null && <span>• {show.episodes} episodes</span>}
                                    {show.network && <span>• Network: {show.network}</span>}
                                </div>
                            </div>

                            {/* Cast */}
                            {show.cast?.length ? (
                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">Cast:</div>
                                    <div className="text-sm text-gray-600">
                                        {show.cast.join(", ")}
                                    </div>
                                </div>
                            ) : null}

                            {/* Genre pills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(show.genres || []).map((genre) => (
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
                                {show.description || "No synopsis available."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description - shown on mobile only, under everything */}
                <div className="lg:hidden mt-8">
                    <p className="text-gray-700 leading-relaxed">
                        {show.description || "No synopsis available."}
                    </p>
                </div>

                <Divider />

                <StarRating value={4} />

                <Divider />

                  <div className="mt-4">
                              <CollectionDropdown
                                currentStatus="Not Added"
                                verb="Watch"
                                verb2="Watching"
                                userId={userId}
                                mediaId={show.mediaId}
                                mediaType={show.type}
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

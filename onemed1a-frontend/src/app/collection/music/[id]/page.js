// app/music/[id]/page.js
import { notFound } from "next/navigation";
import BackgroundImage from "@/app/media-details-components/BackgroundImage";
import PosterImage from "@/app/media-details-components/PosterImage";
import StarRating from "@/app/media-details-components/StarRating";
import MediaActionButtons from "@/app/media-details-components/MediaActionButtons";
import Divider from "@/app/media-details-components/Divider";

/** -------------------------------------------------------
 * Toggle placeholder rendering:
 *  - true  = always show the placeholder album below
 *  - false = fetch real data from backend (requires API env)
 * ------------------------------------------------------ */
const USE_PLACEHOLDER = true;

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getMusic(id) {
    if (USE_PLACEHOLDER) {
        return {
            mediaId: "music-placeholder-id",
            externalMediaId: "fake-album-042",
            type: "MUSIC",
            title: "Aurora Echoes",
            artists: ["Midnight Static", "Luna Verse"], // fake artists
            releaseDate: "2024",
            duration: "48 min",
            label: "Nebula Fields",
            genres: ["Synthwave", "Dream Pop"],
            description:
                "An atmospheric concept album that drifts between city lights and stargazed silence, blending shimmering pads, soft vocals, and analog pulses.",
            posterUrl: "/backdrop.JPG",      // your local placeholder asset
            backdropUrl: "/poster.JPG",    // your local placeholder asset
            createdAt: new Date().toISOString(),
            rating: 4.5,
            tracks: [
                { no: 1, title: "Neon Lullaby", length: "3:42" },
                { no: 2, title: "Saturn’s Carousel", length: "4:10" },
                { no: 3, title: "Polaris Bloom", length: "5:01" },
                { no: 4, title: "Velvet Orbit", length: "4:26" },
                { no: 5, title: "Moonlit Transit", length: "3:58" },
                { no: 6, title: "Glass Comet", length: "4:45" },
                { no: 7, title: "Afterlight Garden", length: "5:37" },
                { no: 8, title: "Echoes of Aurora", length: "6:12" },
            ],
        };
    }

    // const res = await fetch(`${API_BASE}/media/${id}`, { cache: "no-store" });
    // if (res.status === 404) return null;
    // if (!res.ok) throw new Error("Failed to fetch album");
    // return res.json();
}

export default async function MusicPage({ params }) {
    const album = await getMusic(params.id);
    if (!album) notFound();

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
                            userId={userId}
                            mediaId={album.mediaId}
                            mediaType={album.type}
                            currentStatus={currentStatus}
                            verb="Listen"
                            verb2="Listening"
                          />
                        </div>
                      </div>
        </main>
    );
}
// app/movies/[id]/page.js
import { notFound } from "next/navigation";
import BackgroundImage from "@/app/media-details-components/BackgroundImage";
import PosterImage from "@/app/media-details-components/PosterImage";
import StarRating from "@/app/media-details-components/StarRating";
import MediaActionButtons from "@/app/media-details-components/MediaActionButtons";
import Divider from "@/app/media-details-components/Divider";

/** -------------------------------------------------------
 * Toggle placeholder rendering:
 *  - true  = always show the placeholder movie below
 *  - false = fetch real data from backend (requires API env)
 * ------------------------------------------------------ */
const USE_PLACEHOLDER = true;

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL; // e.g. https://api.yourdomain.com

async function getMovie(id) {
    if (USE_PLACEHOLDER) {
        // Placeholder data matching the screenshot
        return {
            mediaId: "placeholder-id",
            externalMediaId: "129",
            type: "MOVIE",
            title: "Spirited Away",
            director: "Hayao Miyazaki",
            releaseDate: "2001",
            runtime: "125 min",
            studio: "Studio Ghibli",
            genres: ["Animation", "Family"],
            description:
                "Spirited Away is a Japanese animated film by Hayao Miyazaki that follows a young girl, Chihiro, who becomes trapped in a magical world. As her parents are transformed into pigs, she must work in a mysterious bathhouse for spirits to find a way to free them and return to the human world. The film explores themes of courage, identity, and transformation.",
            posterUrl: "/poster.JPG",
            backdropUrl: "/backdrop.JPG",
            createdAt: new Date().toISOString(),
            runtimeMinutes: 125,
            rating: 4.7,
            cast: ["Rumi Hiiragi (Sen)", "Miyu Irino", "Mari Natsuki (Yubaba)", "Takashi Naito (Akio)"]
        };
    }

    const res = await fetch(`${API_BASE}/media/${id}`, { cache: "no-store" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch movie");
    return res.json();
}

export default async function MoviePage({ params }) {
    const movie = await getMovie(params.id);
    if (!movie) notFound();

    return (
        <main className="min-h-screen bg-gray-100 text-gray-900">
            <BackgroundImage src={movie.backdropUrl} alt={`${movie.title} backdrop`} />

            <div className="mx-auto w-full max-w-6xl px-4 pb-20">
                {/* Back button */}
                <div className="pt-8 mb-8">
                    <a
                        href="/movies"
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
                            src={movie.posterUrl}
                            alt={`${movie.title} poster`}
                            className="w-full lg:w-80 rounded-lg"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {/* Title and basic info */}
                        <div className="mb-6">
                            <h1 className="text-4xl font-bold mb-2 text-gray-900">{movie.title}</h1>
                            <div className="text-gray-600 mb-3">
                                {movie.director && <div className="text-lg">{movie.director}</div>}
                                <div className="flex items-center gap-4 text-sm">
                                    {movie.runtime && <span>{movie.runtime}</span>}
                                    {movie.releaseDate && <span>• {movie.releaseDate}</span>}
                                    {movie.studio && <span>• Produced By: {movie.studio}</span>}
                                </div>
                            </div>

                            {/* Cast */}
                            {movie.cast && (
                                <div className="mb-4">
                                    <div className="text-gray-500 text-sm mb-1">Cast:</div>
                                    <div className="text-sm text-gray-600">
                                        {movie.cast.join(", ")}
                                    </div>
                                </div>
                            )}

                            {/* Genre pills */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(movie.genres || []).map((genre) => (
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
                                {movie.description || "No synopsis available."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description - shown on mobile only, under everything */}
                <div className="lg:hidden mt-8">
                    <p className="text-gray-700 leading-relaxed">
                        {movie.description || "No synopsis available."}
                    </p>
                </div>

                <Divider/>

                <StarRating
                    value={5}
                />

                <Divider/>

                <MediaActionButtons/>

            </div>
        </main>
    );
}
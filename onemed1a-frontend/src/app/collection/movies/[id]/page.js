// app/movies/[id]/page.js
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import BackgroundImage from "@/app/media-details-components/BackgroundImage";
import PosterImage from "@/app/media-details-components/PosterImage";
import StarRating from "@/app/media-details-components/StarRating";
import CollectionDropdown from "@/app/media-details-components/CollectionDropdown";
import Divider from "@/app/media-details-components/Divider";

/** -------------------------------------------------------
 * Toggle placeholder rendering:
 *  - true  = always show the placeholder movie below
 *  - false = fetch real data from backend (requires API env)
 * ------------------------------------------------------ */
const USE_PLACEHOLDER = true;

// Placeholder function for fetching a movie
async function getMovie(id) {
  if (USE_PLACEHOLDER) {
    return {
      mediaId: "placeholder-id",
      type: "MOVIE",
      title: "Spirited Away",
      director: "Hayao Miyazaki",
      releaseDate: "2001",
      runtime: "125 min",
      studio: "Studio Ghibli",
      genres: ["Animation", "Family"],
      description:
        "Spirited Away is a Japanese animated film by Hayao Miyazaki that follows a young girl, Chihiro, who becomes trapped in a magical world...",
      posterUrl: "/poster.JPG",
      backdropUrl: "/backdrop.JPG",
      cast: ["Rumi Hiiragi (Sen)", "Miyu Irino", "Mari Natsuki (Yubaba)", "Takashi Naito (Akio)"],
    };
  }
  // Replace with real API call if needed
  return null;
}

export default async function MoviePage({ params }) {
  const movie = await getMovie(params.id);
  if (!movie) notFound();

  // Get userId from cookies 
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value || "9fa78e4f-c4d7-4f5e-88b0-cf96dfcce170";

  // Get current status for dropdown (placeholder)
  const currentStatus = await getUserMediaStatus(userId, movie.mediaId);

  // Placeholder function for user media status
async function getUserMediaStatus(userId, mediaId) {
  // some kind of API call to get user's media status
  return "Not Added";
}

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <BackgroundImage src={movie.backdropUrl} alt={`${movie.title} backdrop`} />

      <div className="mx-auto w-full max-w-6xl px-4 pb-20">
        {/* Back button */}
        <div className="pt-8 mb-8">
          <a href="/movies" className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-600">
            <span className="text-2xl">←</span>
          </a>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 lg:w-80">
            <PosterImage src={movie.posterUrl} alt={`${movie.title} poster`} className="w-full lg:w-80 rounded-lg" />
          </div>

          {/* Content */}
          <div className="flex-1">
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
                  <div className="text-sm text-gray-600">{movie.cast.join(", ")}</div>
                </div>
              )}

              {/* Genre pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(movie.genres || []).map((genre) => (
                  <span key={genre} className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Description - desktop only */}
            <div className="hidden lg:block">
              <p className="text-gray-700 leading-relaxed">{movie.description || "No synopsis available."}</p>
            </div>
          </div>
        </div>

        {/* Description - mobile only */}
        <div className="lg:hidden mt-8">
          <p className="text-gray-700 leading-relaxed">{movie.description || "No synopsis available."}</p>
        </div>

        <Divider />

        <StarRating value={5} />

        <Divider />

        {/* Collection Dropdown */}
        <div className="mt-4">
          <CollectionDropdown
            currentStatus={currentStatus}
            verb="Watch"
            verb2="Watching"
            userId={userId}
            mediaId={movie.mediaId}
            mediaType={movie.type}
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

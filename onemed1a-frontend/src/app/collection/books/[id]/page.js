// app/books/[id]/page.js
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import BackgroundImage from "@/app/media-details-components/BackgroundImage";
import PosterImage from "@/app/media-details-components/PosterImage";
import StarRating from "@/app/media-details-components/StarRating";
import CollectionDropdown from "@/app/media-details-components/CollectionDropdown";
import Divider from "@/app/media-details-components/Divider";

const USE_PLACEHOLDER = true;
// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getBook(id) {
  if (USE_PLACEHOLDER) {
    return {
      mediaId: "book-placeholder-id",
      externalMediaId: "ISBN_9780547928227",
      type: "BOOKS",
      title: "The Hobbit",
      authors: ["J. R. R. Tolkien"],
      releaseDate: "1937",
      publisher: "George Allen & Unwin",
      pageCount: 310,
      isbn: "978-0547928227",
      genres: ["Fantasy", "Adventure"],
      description:
        "Bilbo Baggins, a comfort-loving hobbit, is whisked away on a quest to reclaim a lost Dwarven kingdom from the dragon Smaug. Along the way he discovers courage, wit, and a mysterious ring that will shape Middle-earth’s fate.",
      posterUrl: "/book-cover.jpg",
      backdropUrl: "/book-backdrop.jpg",
      createdAt: new Date().toISOString(),
      rating: 4.8,
    };
  }

  // const res = await fetch(`${API_BASE}/media/${id}`, { cache: "no-store" });
  // if (res.status === 404) return null;
  // if (!res.ok) throw new Error("Failed to fetch book");
  // return res.json();
}

export default async function BookPage({ params }) {
  const book = await getBook(params.id);
  if (!book) notFound();

  // Get userId from cookies 
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value || "9fa78e4f-c4d7-4f5e-88b0-cf96dfcce170";
  
    // Get current status for dropdown (placeholder)
    const currentStatus = await getUserMediaStatus(userId, book.mediaId);
  
    // Placeholder function for user media status
  async function getUserMediaStatus(userId, mediaId) {
    // some kind of API call to get user's media status
    return "Not Added";
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <BackgroundImage src={book.backdropUrl} alt={`${book.title} backdrop`} />

      <div className="mx-auto w-full max-w-6xl px-4 pb-20">
        {/* Back button */}
        <div className="pt-8 mb-8">
          <a
            href="/books"
            className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-600"
          >
            <span className="text-2xl">←</span>
          </a>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cover */}
          <div className="flex-shrink-0 lg:w-80">
            <PosterImage
              src={book.posterUrl}
              alt={`${book.title} cover`}
              className="w-full lg:w-80 rounded-lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Title and basic info */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                {book.title}
              </h1>

              <div className="text-gray-600 mb-3">
                {/* Authors */}
                {book.authors?.length ? (
                  <div className="text-lg">{book.authors.join(", ")}</div>
                ) : null}

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {book.releaseDate && <span>{book.releaseDate}</span>}
                  {book.pageCount != null && (
                    <span>• {book.pageCount} pages</span>
                  )}
                  {book.publisher && <span>• Publisher: {book.publisher}</span>}
                  {book.isbn && <span>• ISBN: {book.isbn}</span>}
                </div>
              </div>

              {/* Genre pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(book.genres || []).map((genre) => (
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
                {book.description || "No synopsis available."}
              </p>
            </div>
          </div>
        </div>

        {/* Description - shown on mobile only */}
        <div className="lg:hidden mt-8">
          <p className="text-gray-700 leading-relaxed">
            {book.description || "No synopsis available."}
          </p>
        </div>

        <Divider />

        <StarRating value={5} />

        <Divider />

        <div className="mt-4">
          <CollectionDropdown
            currentStatus="Not Added"
            verb="Read"
            verb2="Reading"
            userId={userId}
            mediaId={book.mediaId}
            mediaType={book.type}
          // onChange={(newStatus) => {
      //   console.log("User changed status to:", newStatus);
      //   // placeholder for API call to save the change
      // }}
          />
        </div>
      </div>
    </main>
  );
}

// app/books/[id]/page.js
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import BackgroundImage from "@/app/media-details-components/BackgroundImage";
import PosterImage from "@/app/media-details-components/PosterImage";
import StarRating from "@/app/media-details-components/StarRating";
import CollectionDropdown from "@/app/media-details-components/CollectionDropdown";
import Divider from "@/app/media-details-components/Divider";

const USE_PLACEHOLDER = true;

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
      description: "Bilbo Baggins, a comfort-loving hobbit...",
      posterUrl: "/book-cover.jpg",
      backdropUrl: "/book-backdrop.jpg",
      createdAt: new Date().toISOString(),
      rating: 4.8,
    };
  }
}

async function getUserMediaStatus(userId, mediaId) {
  // TODO: replace with real API call
  return "Not Added";
}

export default async function BookPage({ params }) {
  const book = await getBook(params.id);
  if (!book) notFound();

  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value || "9fa78e4f-c4d7-4f5e-88b0-cf96dfcce170";

  const currentStatus = await getUserMediaStatus(userId, book.mediaId);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <BackgroundImage src={book.backdropUrl} alt={`${book.title} backdrop`} />
      <div className="mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="pt-8 mb-8">
          <a href="/books" className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-600">
            <span className="text-2xl">←</span>
          </a>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0 lg:w-80">
            <PosterImage src={book.posterUrl} alt={`${book.title} cover`} className="w-full lg:w-80 rounded-lg" />
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">{book.title}</h1>
              <div className="text-gray-600 mb-3">
                {book.authors?.length && <div className="text-lg">{book.authors.join(", ")}</div>}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {book.releaseDate && <span>{book.releaseDate}</span>}
                  {book.pageCount != null && <span>• {book.pageCount} pages</span>}
                  {book.publisher && <span>• Publisher: {book.publisher}</span>}
                  {book.isbn && <span>• ISBN: {book.isbn}</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {(book.genres || []).map((genre) => (
                  <span key={genre} className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <p className="text-gray-700 leading-relaxed">{book.description || "No synopsis available."}</p>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-8">
          <p className="text-gray-700 leading-relaxed">{book.description || "No synopsis available."}</p>
        </div>

        <Divider />
        <StarRating value={5} />
        <Divider />

        <div className="mt-4">
          <CollectionDropdown
            userId={userId}
            mediaId={book.mediaId}
            mediaType={book.type}
            currentStatus={currentStatus}
            verb="Read"
            verb2="Reading"
          />
        </div>
      </div>
    </main>
  );
}

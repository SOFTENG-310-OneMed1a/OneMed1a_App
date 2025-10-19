import UserMediaPage from "@/components/UserMediaPage";

/**
 * UserMediaPage component to display user's saved media items of a specific type.
 * Type is passed as a prop (e.g., "movie", "tv", "music", "books").
 */
export default async function Page({ params }) {
  const { mediaType } = await params; // "movie", "tv", "music", "books"
  return <UserMediaPage mediaType={mediaType} />;
}

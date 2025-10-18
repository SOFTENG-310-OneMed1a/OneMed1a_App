import UserMediaPage from "@/components/UserMediaPage";

export default function Page({ params }) {
  const { mediaType } = params; // "movie", "tv", "music", "books"
  return <UserMediaPage mediaType={mediaType} />;
}

// src/app/user/[mediaType]/page.js
import UserMediaPage from "@/components/UserMediaPage";

export default async function Page({ params }) {
  const { mediaType } = await params; // "movie", "tv", "music", "books"
  return <UserMediaPage mediaType={mediaType} />;
}

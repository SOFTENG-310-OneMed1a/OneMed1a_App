import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MediaGrid from "@/components/MediaGrid";
import {
  normalizeTypeKey,
  typeMap,
  toYear,
  pickCover,
  fetchJSON,
} from "@/lib/mediaUtils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MediaPage({ params }) {
  const { mediaType: rawMediaType } = await params; // no need to await params here
  const mediaTypeKey = normalizeTypeKey(rawMediaType);

  const cookieStore = await cookies();
  const accessTokenCookie = await cookieStore.get("access_token");

  if (!accessTokenCookie) {
    redirect("/login");
  }

  // Build cookie header for fetch
  const cookieHeader = `access_token=${accessTokenCookie.value}`;

  // Fetch user profile from backend, forwarding cookies
  const res = await fetch(
    `${process.env.API_BASE || "http://localhost:8080"}/api/v1/getprofile`,
    {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    redirect("/login");
  }

  const profile = await res.json();

  const userId = profile?.id;
  if (!userId) {
    redirect("/login");
  }

  const raw = await fetchJSON(`/api/v1/usermedia/user/${userId}`);

  let external = [];
  if (["movie", "tv", "music", "books"].includes(mediaTypeKey)) {
    const path = `/api/v1/externalMediaData/${
      mediaTypeKey === "movie" ? "movies" : mediaTypeKey
    }`;
    external = await fetchJSON(path);
  }

  // Build external items
  const externalMap = new Map();
  const aliasMap = new Map();
  const externalItems = external.map((m) => {
    const idKey = m.mediaId || m.externalMediaId || m.id;
    const canonical = String(idKey);
    const item = {
      id: canonical,
      title: m.title ?? "Untitled",
      type: (m.type || "").toLowerCase(),
      year: (m.releaseDate || "").slice(0, 4) || undefined,
      rating: m.rating ?? undefined,
      coverUrl: pickCover(m.posterUrl, m.backdropUrl),
      href: `/collection/${(m.type || "").toLowerCase()}/${canonical}`,
      _raw: m,
    };
    externalMap.set(canonical, item);
    if (m.externalMediaId) aliasMap.set(String(m.externalMediaId), canonical);
    if (m.mediaId) aliasMap.set(String(m.mediaId), canonical);
    return item;
  });

  // Merge tracked statuses
  const itemsMap = new Map();
  for (const it of externalItems) itemsMap.set(String(it.id), { ...it });

  for (const ums of raw.filter((ums) => ums?.media?.type === wantedType)) {
    const m = ums.media ?? {};
    const umsInternal = m.mediaId ? String(m.mediaId) : null;
    const umsExternal = m.externalMediaId ? String(m.externalMediaId) : null;

    let canonical =
      umsInternal && itemsMap.has(umsInternal)
        ? umsInternal
        : umsExternal && aliasMap.has(umsExternal)
        ? aliasMap.get(umsExternal)
        : umsExternal && itemsMap.has(umsExternal)
        ? umsExternal
        : umsInternal && aliasMap.has(umsInternal)
        ? aliasMap.get(umsInternal)
        : null;

    if (!canonical) {
      // fallback by title+year
      const titleKey = (m.title || "").trim().toLowerCase();
      const yearKey = toYear(m.releaseDate);
      if (titleKey) {
        for (const [extId, extItem] of externalMap.entries()) {
          const extTitle = (extItem.title || "").trim().toLowerCase();
          const extYear = extItem.year;
          if (
            extTitle === titleKey &&
            (!yearKey || String(extYear) === String(yearKey))
          ) {
            canonical = extId;
            break;
          }
        }
      }
    }

    if (!canonical)
      canonical = String(m.mediaId || m.externalMediaId || ums.id);

    const base = itemsMap.get(canonical) || externalMap.get(canonical) || {};
    itemsMap.set(canonical, {
      ...base,
      status: ums.status,
      rating: ums.rating ?? base.rating,
      href: `/collection/${(m.type || "").toLowerCase()}/${
        m.mediaId ?? ums.id
      }`,
    });
    if (umsExternal) aliasMap.set(umsExternal, canonical);
    if (umsInternal) aliasMap.set(umsInternal, canonical);
  }

  const items = [
    ...externalItems.map((it) => itemsMap.get(it.id)),
    ...Array.from(itemsMap.entries())
      .filter(([k]) => !externalMap.has(k))
      .map(([_, v]) => v),
  ];

  console.log(items.map((item) => item.coverUrl));
  console.log(items.map((item) => item.posterUrl));

  return (
    <div className="p-4">
      <MediaGrid items={items} />
    </div>
  );
}

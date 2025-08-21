import React from "react";
import MediaNav from "@/components/MediaNavigation";
import MediaGrid from "@/components/MediaGrid";
import SearchBar from "@/components/SearchBar";
import PropTypes from "prop-types";

const mediaData = {
  movies: [
    { id: 1, title: "Inception", coverUrl: "/next.svg", year: 2010 },
    { id: 2, title: "Interstellar", coverUrl: "/next.svg", year: 2014 },
  ],
  tvshows: [
    { id: 3, title: "Breaking Bad", coverUrl: "/next.svg", year: 2008 },
    { id: 4, title: "Dark", coverUrl: "/next.svg", year: 2017 },
  ],
  music: [
    { id: 5, title: "Abbey Road", coverUrl: "/next.svg", year: 1969 },
    { id: 6, title: "Dark Side of the Moon", coverUrl: "/next.svg", year: 1973 },
    { id: 7, title: "Thriller", coverUrl: "/next.svg", year: 1982 },
  ],
  books: [
    { id: 8, title: "1984", coverUrl: "/next.svg", year: 1949 },
    { id: 9, title: "Brave New World", coverUrl: "/next.svg", year: 1932 },
    { id: 10, title: "Fahrenheit 451", coverUrl: "/next.svg", year: 1953 },
  ],
};

export default function MediaPage({ params }) {
  const resolvedParams = React.use(params);
  const { mediaType } = resolvedParams;

  const items = mediaData[mediaType] || [];

  const allItems = Object.entries(mediaData).flatMap(([category, arr]) =>
    arr.map(item => ({ ...item, category }))
  );

  return (
    <div className="p-4">
      <MediaNav />
      <h1 className="text-2xl font-bold my-4">{mediaType.toUpperCase()}</h1>

      <div className="mb-4">
        <SearchBar items={allItems} />
      </div>

      <MediaGrid items={items} />
    </div>
  );
}

MediaPage.propTypes = {
  params: PropTypes.shape({
    mediaType: PropTypes.string.isRequired,
  }).isRequired,
};

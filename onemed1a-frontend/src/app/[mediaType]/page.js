import MediaNav from "@/components/MediaNavigation";
import MediaGrid from "@/components/MediaGrid";
import PropTypes from "prop-types";

const mediaData = {
  movies: [
    { id: 1, title: "Inception", coverUrl: "/next.svg", year: 2010 },
    { id: 2, title: "Interstellar", coverUrl: "/next.svg", year: 2014 },
  ],
  tvshows: [
    { id: 1, title: "Breaking Bad", coverUrl: "/next.svg", year: 2008 },
    { id: 2, title: "Dark", coverUrl: "/next.svg", year: 2017 },
  ],
  music: [
  { id: 1, title: 'Abbey Road', coverUrl: '/next.svg', year: 1969 },
  { id: 2, title: 'Dark Side of the Moon', coverUrl: '/next.svg', year: 1973 },
  { id: 3, title: 'Thriller', coverUrl: '/next.svg', year: 1982 },
  ],
  books: [
  { id: 1, title: '1984', coverUrl: '/next.svg', year: 1949 },
  { id: 2, title: 'Brave New World', coverUrl: '/next.svg', year: 1932 },
  { id: 3, title: 'Fahrenheit 451', coverUrl: '/next.svg', year: 1953 },
  ],
};


export default function MediaPage({ params }) {
  const { mediaType } = params;
  const items = mediaData[mediaType] || [];

  return (
    <div className="p-4">
      <MediaNav />
      <h1 className="text-2xl font-bold my-4">{mediaType.toUpperCase()}</h1>
      <MediaGrid items={items} />
    </div>
  );
}

MediaPage.propTypes = {
  params: PropTypes.shape({
    mediaType: PropTypes.string.isRequired,
  }).isRequired,
};
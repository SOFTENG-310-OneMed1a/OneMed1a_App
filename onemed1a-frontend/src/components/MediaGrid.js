import Image from "next/image";
import PropTypes from "prop-types";

export default function MediaGrid({ items }) {
  if (!items.length) return <p>No items yet.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="p-2 bg-gray-100 rounded hover:shadow-lg transition"
        >
          <Image
            src={item.coverUrl || "/placeholder.png"}
            alt={item.title}
            width={150}
            height={200}
          />
          <h3 className="text-sm font-bold mt-2">{item.title}</h3>
          <p className="text-xs">{item.year}</p>
        </div>
      ))}
    </div>
  );
}

MediaGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      coverUrl: PropTypes.string,
      title: PropTypes.string.isRequired,
      year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

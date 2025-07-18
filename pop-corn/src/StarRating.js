import { useState } from "react";
import PropTypes from "prop-types";


const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const starContainerStyle = {
  display: "flex",
};

//this is used to contraint the type of props passed
Ratings.propTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
};

export default function Ratings({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  onSetRating,
  className = "",
  messages = [],
  defaultRating = 0
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRate, setTempRate] = useState(0);
  // passed to every star and updates the rating when any star is clicked according to the index of that star
  function handleRating(i) {
    setRating(i + 1);
    onSetRating(i + 1);
  }

  const ratingStyle = {
    lineHeight: "1",
    margin: 0,
    color: color,
    fontSize: `${size / 1.5}px`,
  };

  return (
    <div style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            handleRating={() => handleRating(i)}
            onHoverEnter={() => setTempRate(i + 1)}
            onHoverLeave={() => setTempRate(0)}
            full={tempRate ? tempRate >= i + 1 : rating >= i + 1}
            color={color}
            size={size}
            key={i}
          />
        ))}
      </div>
      <p style={ratingStyle}>
        {messages.length === maxRating
          ? messages[tempRate ? tempRate - 1 : rating - 1]
          : tempRate || rating || ""}
      </p>
    </div>
  );
}

function Star({ handleRating, full, onHoverEnter, onHoverLeave, color, size }) {
  const starStyles = {
    width: `${size}px`,
    height: `${size}px`,
    display: "block",
    color: color,
  };

  return (
    <div
      onClick={handleRating}
      style={starStyles}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </div>
  );
}

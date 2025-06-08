import { useState } from "react";

function Heart({ className = "", color }) {
  const [liked, setLiked] = useState(false);
  const style = {
    color: liked ? "darkred" : color || "inherit",
  };

  return (
    <i
      className={`fa-heart ${liked ? "fa-solid" : "fa-regular"} ${
        liked ? "card__heart--liked" : ""
      } ${className}`}
      style={style}
      onClick={() => setLiked(!liked)}
    ></i>
  );
}

export default Heart;

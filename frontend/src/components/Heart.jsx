import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Heart({ className = "", color, itemId, disabled = false }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!itemId) return;

    const visitorKey =
      localStorage.getItem("visitor_key") ||
      (() => {
        const key = uuidv4();
        localStorage.setItem("visitor_key", key);
        return key;
      })();

    const token = localStorage.getItem("token");

    const url = token
      ? `${process.env.REACT_APP_API_URL}/api/likes/${itemId}/like-status`
      : `${process.env.REACT_APP_API_URL}/api/likes/${itemId}/like-status?visitorKey=${visitorKey}`;

    fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        setLiked(data.liked);
        setCount(data.count);
      })
      .catch(console.error);
  }, [itemId]);

  const handleClick = async () => {
    if (disabled || !itemId) return;

    const token = localStorage.getItem("token");
    const visitorKey = !token ? localStorage.getItem("visitor_key") : null;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/likes/${itemId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(visitorKey ? { visitorKey } : {}),
        },
      );

      const data = await res.json();

      setLiked(data.liked);
      setCount(data.count);
    } catch (err) {
      console.error("like error:", err);
    }
  };

  return (
    <div className="card__heart--content">
      <div>
        <button
        className="card__heart--button"
          type="button"
          aria-label={liked ? "Retirer le like" : "Ajouter un like"}
          onClick={disabled ? undefined : handleClick}
          disabled={disabled}
        >
          <i
            aria-hidden="true"
            className={`fa-heart ${
              liked ? "fa-solid card__heart--liked" : "fa-regular"
            }`}
          />
        </button>

        <span>{count}</span>
      </div>

      {disabled && <small style={{ color }}>Connecte-toi pour liker</small>}
    </div>
  );
}

export default Heart;

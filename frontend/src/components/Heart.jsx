import { useEffect, useState } from "react";

function Heart({ className = "", color, itemId, disabled = false }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!itemId) return;

    const token = localStorage.getItem("token");

    const url = `${process.env.REACT_APP_API_URL}/api/likes/${itemId}/like-status`;

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
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/likes/${itemId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        <i
          className={`fa-heart ${
            liked ? "fa-solid card__heart--liked" : "fa-regular"
          } ${className} ${disabled ? "card__heart--disabled" : ""}`}
          style={{
            color: disabled ? "#aaa" : liked ? "darkred" : color || "inherit",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
          onClick={disabled ? undefined : handleClick}
        />

        <span>{count}</span>
      </div>

      {disabled && <small style={{ color }}>Connecte-toi pour liker</small>}
    </div>
  );
}

export default Heart;

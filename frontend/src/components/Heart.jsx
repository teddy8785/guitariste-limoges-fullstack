import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Heart({ className = "", color, initialCount = 0, itemId, itemType = "guitariste", variant="" }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!itemId) return;

    let visitorKey = localStorage.getItem("visitor_key");
    if (!visitorKey) {
      visitorKey = uuidv4();
      localStorage.setItem("visitor_key", visitorKey);
    }

    const likedKey = `liked_${itemType}_${itemId}`;
    setLiked(localStorage.getItem(likedKey) === "true");

    const backendUrl = "http://localhost:4000";
    const token = localStorage.getItem("token");

    fetch(
      `${backendUrl}/api/${itemType}s/${itemId}/like-status?visitorKey=${visitorKey}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    )
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          setCount(0);
          return;
        }
        try {
          const data = JSON.parse(text);
          if (typeof data.count === "number") setCount(data.count);
          if (typeof data.liked === "boolean") {
            setLiked(data.liked);
            if (data.liked) localStorage.setItem(likedKey, "true");
          }
        } catch (e) {
          console.error("Erreur parse JSON like-status :", e);
        }
      })
      .catch((err) => {
        console.error("Erreur récupération like-status :", err);
      });
  }, [itemId, itemType]);

  const handleClick = async () => {

     if (!itemId) {
    console.warn("itemId non défini, impossible d'envoyer le like");
    return;
  }
    const visitorKey = localStorage.getItem("visitor_key");

    try {
      const backendUrl = "http://localhost:4000";
      const res = await fetch(
        `${backendUrl}/api/${itemType}s/${itemId}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorKey }),
        }
      );

      const contentType = res.headers.get("content-type");

      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Réponse non JSON : " + text);
      }

      const data = await res.json();
      setLiked(data.liked);
      setCount(data.newCount);

      const likedKey = `liked_${itemType}_${itemId}`;

      if (data.liked) {
        localStorage.setItem(likedKey, "true");
      } else {
        localStorage.removeItem(likedKey);
      }
    } catch (err) {
      console.error("Erreur enregistrement like :", err);
    }
  };

  return (
    <div className="card__heart--content">
      <i
        className={`fa-heart ${liked ? "fa-solid" : "fa-regular"} ${
          liked ? "card__heart--liked" : ""
        } ${className}`}
        style={{ color: liked ? "darkred" : color || "inherit" }}
        onClick={handleClick}
      ></i>
      <span className={`${variant === "presentation" ? "presentation__count" : ""}`}>{count}</span>
    </div>
  );
}

export default Heart;
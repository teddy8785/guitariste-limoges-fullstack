import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setLikeStatus } from "../Store/likesSlice"; // ajuste le chemin selon ton projet

function Heart({ className = "", color, initialCount = 0, itemId, itemType = "guitariste", variant = "" }) {
  const dispatch = useDispatch();

  const likeState = useSelector(state => state.likes.items[itemId] || {});
  const liked = likeState.liked || false;
  const count = likeState.count ?? initialCount;

  useEffect(() => {
    if (!itemId) return;

    let visitorKey = localStorage.getItem("visitor_key");
    if (!visitorKey) {
      visitorKey = uuidv4();
      localStorage.setItem("visitor_key", visitorKey);
    }

    const backendUrl = "http://localhost:4000";
    const token = localStorage.getItem("token");

    fetch(`${backendUrl}/api/${itemType}s/${itemId}/like-status?visitorKey=${visitorKey}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(data => {
        dispatch(setLikeStatus({ itemId, liked: data.liked, count: data.count }));
      })
      .catch((err) => {
        console.error("Erreur récupération like-status :", err);
      });
  }, [itemId, itemType, dispatch]);

  const handleClick = async () => {
    if (!itemId) {
      console.warn("itemId non défini, impossible d'envoyer le like");
      return;
    }

    const visitorKey = localStorage.getItem("visitor_key");

    try {
      const backendUrl = "http://localhost:4000";
      const res = await fetch(`${backendUrl}/api/${itemType}s/${itemId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorKey }),
      });

      const data = await res.json();
      dispatch(setLikeStatus({ itemId, liked: data.liked, count: data.newCount }));
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
      <span className={`${variant === "presentation" ? "presentation__count" : ""}`}>
        {count}
      </span>
    </div>
  );
}

export default Heart;
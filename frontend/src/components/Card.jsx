import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { optimizeCloudinary } from "../hooks/OptimizeCoudinary";
import Heart from "./Heart";
import Report from "./Report";

export const defaultPhoto = `${process.env.PUBLIC_URL}/photos/sansphoto.webP`;

export const gestionErreurPhoto = (e) => {
  e.target.onerror = null;
  e.target.src = defaultPhoto;
};

function Card({
  itemId,
  slug,
  nom,
  photo,
  photoDown,
  audio,
  annonce,
  profileId,
  likeInfo,
  vip,
  onVipChange,
}) {
  const auth = useSelector((state) => state.auth);
  const isAdmin = useSelector((state) => state.auth.role === "admin");
  const isLogged = !!auth.token;

  const photoSrc = photo ? optimizeCloudinary(photo, 400) : defaultPhoto;

  const photoDownSrc = photoDown ? optimizeCloudinary(photoDown, 300) : null;

  const vipClass =
    vip === "gold"
      ? "card__vip--gold"
      : vip === "silver"
        ? "card__vip--silver"
        : "";

  return (
    <article className={`card ${vipClass}`}>
      {isAdmin && (
        <div className="card__adminVip" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`card__vipOption ${vip === "gold" ? "active-gold" : ""}`}
            onClick={() => onVipChange?.(profileId, "gold")}
          >
            🥇 Gold
          </button>

          <button
            type="button"
            className={`card__vipOption ${vip === "silver" ? "active-silver" : ""}`}
            onClick={() => onVipChange?.(profileId, "silver")}
          >
            🥈 Silver
          </button>

          <button
            type="button"
            className="card__vipOption"
            onClick={() => onVipChange?.(profileId, null)}
          >
            ❌ Normal
          </button>
        </div>
      )}

      <h3 className="card__name">{nom}</h3>

      <Heart
        itemId={itemId}
        itemType="guitaristes"
        disabled={!isLogged}
        liked={likeInfo?.liked}
        count={likeInfo?.count}
      />

      <Report profileId={profileId} />

      <NavLink className="card__link" to={`/artiste/${slug}`}>
        <picture>
          {photoDownSrc && (
            <source srcSet={photoDownSrc} media="(max-width: 768px)" />
          )}

          <img
            className="card__img"
            src={photoSrc}
            alt={nom}
            loading="lazy"
            decoding="async"
            onError={gestionErreurPhoto}
          />
        </picture>

        {audio && (
          <audio controls className="card__audio">
            <source src={audio} />
          </audio>
        )}
      </NavLink>

      {annonce && (
        <span
          className={`card__annonce ${isLogged ? "card__annonce--logged" : ""}`}
        >
          Annonce
        </span>
      )}
    </article>
  );
}

export default Card;

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
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
}) {
  const auth = useSelector((state) => state.auth);
  const isLogged = !!auth.token;

  const photoSrc = photo || defaultPhoto;

  const photoDownWebpSrc = photoDown
    ? photoDown.replace(/\.(jpg|jpeg|png)$/i, ".webp")
    : null;

  return (
    <article className="card">
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
          {photoDownWebpSrc && (
            <source
              srcSet={photoDownWebpSrc}
              type="image/webp"
              media="(max-width: 768px)"
            />
          )}

          <img
            className="card__img"
            src={photoSrc}
            alt={nom}
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

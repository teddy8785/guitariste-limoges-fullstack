import { NavLink } from "react-router-dom";

export const defaultPhoto = `${process.env.PUBLIC_URL}/photos/sansphoto.webP`;
export const gestionErreurPhoto = (e) => {
  e.target.onerror = null;
  e.target.src = defaultPhoto;
};

function Card({ slug, nom, photo, photoDown, audio, annonce }) {
  const backendUrl = "http://localhost:4000";
  
  const photoSrc = photo
    ? photo.startsWith("http")
      ? photo
      : `${backendUrl}/${photo}`
    : defaultPhoto;

  const photoDownSrc = photoDown
    ? photoDown.startsWith("http")
      ? photoDown
      : `${backendUrl}/${photoDown}`
    : null;

  const photoDownWebpSrc = photoDownSrc
    ? photoDownSrc.replace(/\.(jpg|jpeg|png)$/i, ".webp")
    : null;

  const picturesSources = (
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
        alt={
          nom
            ? `${nom} - Photo de l'artiste`
            : "Photo de l'artiste non disponible"
        }
        onError={gestionErreurPhoto}
      />
    </picture>
  );

  return (
    <article className="card">
      <p className="card__name">{nom}</p>
      <NavLink className="card__link" to={`/artiste/${slug}`}>
        {picturesSources}
        {audio && audio.length > 0 && (
          <audio
            controls
            className="card__audio"
            aria-label={`extrait musical de l'artiste nommé ${nom}`}
          >
            <source
              src={audio.startsWith("http") ? audio : `${backendUrl}/${audio}`}
            />
          </audio>
        )}
      </NavLink>
      {annonce && <span className="card__annonce">Annonce</span>}
    </article>
  );
}

export default Card;

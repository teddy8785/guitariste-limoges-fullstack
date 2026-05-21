import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import Heart from "../components/Heart";
import { gestionErreurPhoto } from "../components/Card";
import { useSelector } from "react-redux";

function Presentation({ type }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isSafeUrl = (url) => /^https?:\/\/[\w.-]+/i.test(url);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const userId =
    useSelector((state) => state.auth.userId) || localStorage.getItem("userId");
  const role =
    useSelector((state) => state.auth.role) || localStorage.getItem("role");
  const isAdmin = role === "admin";
  const backendUrl = `${process.env.REACT_APP_API_URL}`;

  useEffect(() => {
    if (post) {
      document.title = `${post.nom} | Guitaristes`;
    }
  }, [post]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    setIsLogged(!!token);

    fetch(`${process.env.REACT_APP_API_URL}/api/guitaristes/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Artiste non trouvé");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p>Chargement...</p>;

  if (error) return <Navigate to="/erreur" />;

  if (!post) return null;

  const isOwner = userId === post.userId;

  const deleteProfil = async () => {
    const confirmDelete = window.confirm("Supprimer ce profil ?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const url = isAdmin
      ? `${process.env.REACT_APP_API_URL}/api/admin/guitaristes/${post._id}`
      : `${process.env.REACT_APP_API_URL}/api/guitaristes/me`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Erreur suppression");

    alert("Profil supprimé !");
    navigate("/");
  };

  return (
    <div className="footer__bottom">
      <Header>
        <nav>
          <button
            className="header__button"
            onClick={() => {
              navigate("/");
            }}
          >
            Retour
          </button>
          {isLogged && (isOwner || isAdmin) && (
            <button
              className="header__button"
              onClick={() => navigate(`/profil/${post._id}`)}
            >
              Modifier ce profil
            </button>
          )}

          {isLogged && (isOwner || isAdmin) && (
            <button className="header__button" onClick={deleteProfil}>
              Supprimer ce profil
            </button>
          )}
        </nav>
        <h1 className="header__title--nom">{post.nom}</h1>
      </Header>
      <Main>
        {post.annonce && (
          <div className="presentation__annonce">
            <i className="fa-solid fa-bell presentation__bell--color"></i>
            {post.annonce}
          </div>
        )}
        {post._id && (
          <Heart
            className="card__heart presentation__heart"
            color="white"
            itemId={post._id}
            itemType={type}
            variant="presentation"
          />
        )}
        <section className="presentation">
          <>
            {post.photo && (
              <picture>
                {post.photoDown && (
                  <source
                    srcSet={post.photoDown}
                    type="image/webp"
                    media="(max-width: 767px)"
                  />
                )}
                <source
                  srcSet={post.photo}
                  type="image/jpeg"
                  media="(min-width: 768px)"
                />
                <img
                  className="presentation__image"
                  src={post.photo} // fallback
                  alt={post.nom}
                  onError={gestionErreurPhoto}
                />
              </picture>
            )}
            {post.audio && (
              <audio
                controls
                aria-label={`extrait musical de l'artiste nommé ${post.nom}`}
              >
                <source
                  src={
                    post.audio.startsWith("http")
                      ? post.audio
                      : `${backendUrl}/${post.audio}`
                  }
                />
              </audio>
            )}
            {(post.lienx ||
              post.lieninstagram ||
              post.lienyoutube ||
              post.mail) && (
              <div className="presentation__contactcontent">
                <h3>CONTACT</h3>
                <div className="presentation__contact">
                  {post.lienx && isSafeUrl(post.lienx) && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={post.lienx}
                    >
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  )}
                  {post.lieninstagram && isSafeUrl(post.lieninstagram) && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={post.lieninstagram}
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  )}
                  {post.lienyoutube && isSafeUrl(post.lienyoutube) && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={post.lienyoutube}
                    >
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  )}
                </div>
                <div>{post.mail && <p>{post.mail}</p>}</div>
              </div>
            )}
            {post.histoire && (
              <div className="presentation__histoire">
                <>
                  <h3>HISTOIRE</h3>
                  <p>{post.histoire}</p>
                </>
              </div>
            )}
          </>
        </section>
      </Main>
      <Footer />
    </div>
  );
}

export default Presentation;

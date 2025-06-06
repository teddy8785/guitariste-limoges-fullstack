import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { gestionErreurPhoto } from "../components/Card";

function Presentation() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isSafeUrl = (url) => /^https?:\/\/[\w.-]+/i.test(url);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role");
  const isAdmin = userRole === "admin";
  const backendUrl = "http://localhost:4000";

  useEffect(() => {
    if (post) {
      document.title = `${post.nom} | Guitaristes`;
    }
  }, [post]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    setIsLogged(!!token);

    fetch(`http://localhost:4000/api/guitaristes/slug/${slug}`)
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
    if (!token) {
      alert("Non connecté, token manquant.");
      return;
    }

    try {
      let url;
      if (isAdmin && post?._id) {
        url = `http://localhost:4000/api/admin/guitaristes/${post._id}`;
      } else {
        url = "http://localhost:4000/api/guitaristes/me";
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erreur suppression profil");

      alert("Profil supprimé !");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Erreur : " + err.message);
    }
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
            <i className="fa-solid fa-bell" style={{ color: "red" }}></i>
            {post.annonce}
          </div>
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

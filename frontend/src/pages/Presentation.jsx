import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { gestionErreurPhoto } from "../components/Card";

function Presentation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  // Supposons que l'ID utilisateur connecté est dans le localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    setIsLogged(!!token);

    fetch(`http://localhost:4000/api/guitaristes/${id}`)
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
  }, [id]);

  if (loading) return <p>Chargement...</p>;

  if (error) return <Navigate to="/Error/" />;

  if (!post) return null; // Sécurité

  const isOwner = userId === post.userId; // adapte selon ton backend

  return (
    <div className="footer__bottom">
      <Header>
        <nav>
          <button
            className="header__button"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Retour
          </button>
          {isLogged && isOwner && (
            <button
              className="header__button"
              onClick={() => navigate(`/edit/${id}`)}
              style={{ marginLeft: "1rem" }}
            >
              Modifier mon profil
            </button>
          )}
        </nav>
        <h1 className="header__title">{post.nom}</h1>
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
              <img
                className="presentation__image"
                src={`${process.env.PUBLIC_URL}/${post.photo}`}
                alt={post.nom}
                onError={gestionErreurPhoto}
              ></img>
            )}

            {(post.lienx ||
              post.lieninstagram ||
              post.lienyoutube ||
              post.mail) && (
              <div className="presentation__contactcontent">
                <h3>CONTACT</h3>
                <div className="presentation__contact">
                  {post.lienx && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={post.lienx}
                    >
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  )}
                  {post.lieninstagram && (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={post.lieninstagram}
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  )}
                  {post.lienyoutube && (
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
          </>
          {post.histoire && (
            <div className="presentation__histoire">
              <>
                <h3>HISTOIRE</h3>
                <p>{post.histoire}</p>
              </>
            </div>
          )}
        </section>
      </Main>
      <Footer />
    </div>
  );
}

export default Presentation;

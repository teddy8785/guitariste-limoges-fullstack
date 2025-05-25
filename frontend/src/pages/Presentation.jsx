import { Navigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import data from "../artistes.json";
import "../styles/presentation.css";
import { useEffect } from "react";
import { gestionErreurPhoto } from "../components/Card";

function Presentation() {
  const { id } = useParams();
  const post = data.find((artiste) => artiste.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return <Navigate to="/Error/" />;
  }

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

import Header from "../components/Header";
import Heroheader from "../components/Heroheader";
import Main from "../components/Main";
import Card from "../components/Card";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useEffect, useState } from "react";

function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [guitaristes, setGuitaristes] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem("token");
    setIsLogged(!!token);

    if (token) {
      fetch("http://localhost:4000/api/guitaristes/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Aucun profil trouvé");
          return res.json();
        })
        .then(() => setHasProfile(true))
        .catch(() => setHasProfile(false));
    } else {
      setHasProfile(false);
    }

    fetch("http://localhost:4000/api/guitaristes")
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement des guitaristes");
        return res.json();
      })
      .then((json) => setGuitaristes(json))
      .catch(console.error);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
  };

  const maxCards = 4;

  return (
    <div>
      <Header>
        <i className="fa-solid fa-bars" onClick={toggleMenu}></i>
        <button
          className="header__button--fixed header__button"
          onClick={toggleMenu}
        >
          MENU
        </button>
        <nav
          onClick={toggleMenu}
          className={`header__link--container ${
            isMenuOpen ? "" : "header__link--hidden"
          }`}
        >
          <div className="header__user">
            {isLogged ? (
              <>
                {!hasProfile && (
                  <NavLink className="header__link" to={`/profil`}>
                    Créer son profil
                  </NavLink>
                )}
                <button className="header__link" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink
                  className="header__link"
                  to={`/inscription`}
                  onClick={toggleMenu}
                >
                  S'inscrire
                </NavLink>
                <NavLink
                  className="header__link"
                  to={`/connexion`}
                  onClick={toggleMenu}
                >
                  Se connecter
                </NavLink>
              </>
            )}
          </div>
          <NavLink
            className="header__link"
            to={`/Gallery`}
            onClick={toggleMenu}
          >
            Voir tous les guitaristes
          </NavLink>
          <div className="header__ancre--container">
            <HashLink
              smooth
              to="#new"
              className="header__ancre"
              onClick={toggleMenu}
            >
              Nouveaux
            </HashLink>
            <HashLink
              smooth
              to="#contact"
              className="header__ancre"
              onClick={toggleMenu}
            >
              contact
            </HashLink>
          </div>
        </nav>
        <h1 className="header__title">GUITARISTES LIMOGES</h1>
      </Header>
      <Heroheader />
      <Main>
        <section id="new">
          <h2 className="main__title">NOUVEAUX</h2>
          <div className="main__gallery">
            {guitaristes
              .slice(-maxCards)
              .reverse()
              .map((post) => (
                <Card
                  key={post._id}
                  id={post._id}
                  nom={post.nom}
                  photo={post.photo}
                  photoDown={post.photoDown}
                  audio={post.audio}
                  annonce={post.annonce}
                />
              ))}
          </div>
        </section>
        <Contact />
      </Main>
      <Footer />
    </div>
  );
}

export default Index;

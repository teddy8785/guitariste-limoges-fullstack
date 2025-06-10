import Header from "../components/Header";
import Heroheader from "../components/Heroheader";
import Main from "../components/Main";
import Card from "../components/Card";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useEffect, useState } from "react";
import StatusIndicator from "../components/StatusIndicator";

function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [guitaristes, setGuitaristes] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [userSlug, setUserSlug] = useState(null);
  const [annonces, setAnnonces] = useState([]);

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
        .then((data) => {
          setHasProfile(true);
          setUserSlug(data.slug);
        })
        .catch(() => setHasProfile(false));
    } else {
      setHasProfile(false);
    }

    fetch("http://localhost:4000/api/guitaristes/recents")
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement des guitaristes");
        return res.json();
      })
      .then((data) => setGuitaristes(data))
      .catch(console.error);

    fetch("http://localhost:4000/api/guitaristes/annonces/recentes")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des annonces");
        return res.json();
      })
      .then((json) => setAnnonces(json))
      .catch(console.error);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("logout"));
    setIsLogged(false);
  };

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
        <StatusIndicator />
        <nav
          onClick={toggleMenu}
          className={`header__link--container ${
            isMenuOpen ? "" : "header__link--hidden"
          }`}
        >
          <div className="header__user">
            {isLogged ? (
              <>
                {hasProfile && userSlug ? (
                  <NavLink className="header__link" to={`/artiste/${userSlug}`}>
                    Mon profil
                  </NavLink>
                ) : (
                  <NavLink className="header__link" to={`/profil`}>
                    Créer son profil
                  </NavLink>
                )}
                <button
                  className="header__link header__link--logout"
                  onClick={handleLogout}
                >
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
            Voir tous les musiciens
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
              to="#annonce"
              className="header__ancre"
              onClick={toggleMenu}
            >
              annonces
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
          <h2 className="main__title">NOUVEAUX MUSICIENS</h2>
          <div className="main__new">
            {guitaristes.map((post) => (
              <Card
                key={post._id}
                itemId={post._id}
                slug={post.slug}
                nom={post.nom}
                photo={post.photo}
                photoDown={post.photoDown}
                audio={post.audio}
                annonce={post.annonce}
              />
            ))}
          </div>
        </section>
        <section id="annonce">
          <h2 className="main__title">NOUVELLES ANNONCES</h2>
          <div className="main__new">
            {annonces.map((post) => (
              <Card
                key={post._id}
                itemId={post._id}
                slug={post.slug}
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
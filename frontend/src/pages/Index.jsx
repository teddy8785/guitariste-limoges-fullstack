import Header from "../components/Header";
import Heroheader from "../components/Heroheader";
import Main from "../components/Main";
import Card from "../components/Card";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useCallback, useEffect, useState } from "react";
import StatusIndicator from "../components/StatusIndicator";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/authSlice";

function Index() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isLogged = !!token;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [guitaristes, setGuitaristes] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [userSlug, setUserSlug] = useState(null);
  const [annonces, setAnnonces] = useState([]);

  const [showWarning, setShowWarning] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch(logout()); // Mise à jour du store Redux
    window.dispatchEvent(new Event("logout"));
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (token) {
      fetch("http://localhost:4000/api/guitaristes/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            handleLogout();
            throw new Error("Token invalide");
          }
          if (!res.ok) throw new Error("Aucun profil trouvé");
          return res.json();
        })
        .then((data) => {
          if (data && data.slug) {
            setHasProfile(true);
            setUserSlug(data.slug);
          } else {
            setHasProfile(false);
            setUserSlug(null);
          }
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
  }, [token, handleLogout]); // Attention ici on dépend du token !

  useEffect(() => {
    const handleGlobalLogout = () => {
      // Plus besoin de setIsLogged ici, redux gère ça
    };
    window.addEventListener("logout", handleGlobalLogout);
    return () => window.removeEventListener("logout", handleGlobalLogout);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setDeleteMessage("Non connecté, impossible de supprimer le compte.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erreur suppression du compte");

      // Remplace le contenu de la modale
      setDeleteMessage(
        "Ton compte a été supprimé avec succès 😢. Merci d’avoir été parmi nous ! On espère te revoir bientôt !"
      );

      // Déconnexion automatique
      handleLogout();
    } catch (err) {
      console.error(err);
      setDeleteMessage("Erreur : " + err.message);
    }
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
                {isLogged && hasProfile && userSlug ? (
                  <>
                    <NavLink
                      className="header__link"
                      to={`/artiste/${userSlug}`}
                    >
                      Mon profil
                    </NavLink>
                    <button
                      className="header__link"
                      onClick={() => setShowWarning(true)}
                    >
                      Supprimer mon compte
                    </button>
                  </>
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
      {showWarning && (
        <div className="header__modal">
          <div className="header__modal--content">
            {!deleteMessage ? (
              <>
                <h2>⚠️ Suppression définitive</h2>
                <p>
                  Cette action supprimera ton compte et ton profil si tu as un.
                  <br />
                  Elle est <strong>irréversible</strong>. Veux-tu continuer ?
                </p>
                <button onClick={deleteAccount}>Oui, supprimer</button>
                <button onClick={() => setShowWarning(false)}>Annuler</button>
              </>
            ) : (
              <>
                <h2>🎉 Compte supprimé !</h2>
                <p>{deleteMessage}</p>
                <button onClick={() => setShowWarning(false)}>Fermer</button>
              </>
            )}
          </div>
        </div>
      )}
      <Heroheader />
      <Main>
        <section id="new">
          <h2 className="main__title">NOUVEAUX MUSICIENS</h2>
          <div className="main__new">
            {guitaristes.slice(0, 4).map((post) => (
              <Card
                key={post._id}
                itemId={post._id}
                slug={post.slug}
                nom={post.nom}
                photo={post.photo}
                photoDown={post.photoDown}
                audio={post.audio}
                annonce={post.annonce}
                profileId={post._id}
              />
            ))}
          </div>
        </section>
        <section id="annonce">
          <h2 className="main__title">NOUVELLES ANNONCES</h2>
          <div className="main__new">
            {annonces.slice(0, 4).map((post) => (
              <Card
                key={post._id}
                itemId={post._id}
                slug={post.slug}
                nom={post.nom}
                photo={post.photo}
                photoDown={post.photoDown}
                audio={post.audio}
                annonce={post.annonce}
                profileId={post._id}
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

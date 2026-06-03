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
import { useLikes } from "../hooks/useLikes";

function Index() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isLogged = !!token;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [guitaristes, setGuitaristes] = useState([]);
  const [annonces, setAnnonces] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [userSlug, setUserSlug] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // LIKE STATE CENTRALISÉ (IMPORTANT)
  const likesState = useLikes(guitaristes.length ? guitaristes : [], token);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      const start = Date.now();

      try {
        const [recentsRes, annoncesRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/guitaristes/recents`),
          fetch(
            `${process.env.REACT_APP_API_URL}/api/guitaristes/annonces/recentes`,
          ),
        ]);

        const recents = await recentsRes.json();
        const annonces = await annoncesRes.json();

        const elapsed = Date.now() - start;
        const minDelay = 600;

        const wait = Math.max(0, minDelay - elapsed);

        setTimeout(() => {
          if (!mounted) return;
          setGuitaristes(recents);
          setAnnonces(annonces);
          setLoading(false);
        }, wait);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    dispatch(logout());
  }, [dispatch]);

  // PROFILE
  useEffect(() => {
    if (!token) return setHasProfile(false);

    fetch(`${process.env.REACT_APP_API_URL}/api/guitaristes/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setHasProfile(!!data?.slug);
        setUserSlug(data?.slug || null);
      })
      .catch(() => setHasProfile(false));
  }, [token]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      setDeleteMessage("Compte supprimé avec succès 😢");
      handleLogout();
    } catch (err) {
      setDeleteMessage("Erreur suppression compte");
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
          className={`header__link--container ${isMenuOpen ? "" : "header__link--hidden"}`}
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

                <button className="header__link" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink className="header__link" to="/inscription">
                  S'inscrire
                </NavLink>
                <NavLink className="header__link" to="/connexion">
                  Se connecter
                </NavLink>
              </>
            )}
          </div>

          <NavLink className="header__link" to="/Gallery">
            Voir tous les musiciens
          </NavLink>

          <div className="header__ancre--container">
            <HashLink smooth to="#new" className="header__ancre">
              Nouveaux
            </HashLink>
            <HashLink smooth to="#annonce" className="header__ancre">
              Annonces
            </HashLink>
            <HashLink smooth to="#contact" className="header__ancre">
              Contact
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
                <h2>⚠️ Suppression</h2>
                <p>Action irréversible</p>
                <button onClick={deleteAccount}>Oui supprimer</button>
                <button onClick={() => setShowWarning(false)}>Annuler</button>
              </>
            ) : (
              <>
                <h2>Compte supprimé</h2>
                <p>{deleteMessage}</p>
              </>
            )}
          </div>
        </div>
      )}

      <Heroheader />

      <Main>
        <section id="new">
          <h2 className="main__title">NOUVEAUX MUSICIENS</h2>

          <div className={`main__new ${loading ? "is-loading" : ""}`}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="main__skeleton--card">
                    <div className="main__skeleton--img" />
                    <div className="main__skeleton--name" />
                    <div className="main__skeleton--line" />
                  </div>
                ))
              : guitaristes
                  .slice(0, 4)
                  .map((post) => (
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
                      type="like"
                      likeInfo={
                        likesState?.[post._id] || { liked: false, count: 0 }
                      }
                    />
                  ))}
          </div>
        </section>

        <section id="annonce">
          <h2 className="main__title">NOUVELLES ANNONCES</h2>

          <div className={`main__new ${loading ? "is-loading" : ""}`}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="main__skeleton--card">
                    <div className="main__skeleton--img" />
                    <div className="main__skeleton--name" />
                    <div className="main__skeleton--line" />
                  </div>
                ))
              : annonces
                  .slice(0, 4)
                  .map((post) => (
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
                      type="like"
                      likeInfo={
                        likesState?.[post._id] || { liked: false, count: 0 }
                      }
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

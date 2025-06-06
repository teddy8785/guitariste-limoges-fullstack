import Header from "../components/Header";
import Main from "../components/Main";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import { useEffect, useState, useMemo } from "react";

function Artistes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVille, setSelectedVille] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [onlyWithAnnonce, setOnlyWithAnnonce] = useState(false);
  const [onlyWithAudio, setOnlyWithAudio] = useState(false);
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [currentPage, setCurrentPages] = useState(1);
  const [data, setData] = useState([]);

  const maxCards = 20;

  useEffect(() => {
    fetch("http://localhost:4000/api/guitaristes")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement");
        return res.json();
      })
      .then((json) => {
        if (Array.isArray(json)) {
          setData(json);
        } else {
          console.error("Données inattendues:", json);
        }
      })
      .catch(console.error);
  }, []);

  // Extraire les villes uniques
  const allVilles = useMemo(() => {
    const villes = data.flatMap((artiste) => artiste.ville);
    return [...new Set(villes)].filter((v) => v && v.trim() !== "");
  }, [data]);

  // Extraire les styles uniques
  const allStyles = useMemo(() => {
    const styles = data.flatMap((artiste) => artiste.style);
    return [...new Set(styles)];
  }, [data]);

  // Extraire les instruments uniques
  const allInstruments = useMemo(() => {
    const instruments = data.flatMap((artiste) => artiste.instrument);
    return [...new Set(instruments)].filter((i) => i && i.trim() !== "");
  }, [data]);

  // Filtrage combiné par nom et style
  const cleanQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredData = useMemo(() => {
    return data.filter(
      (artiste) =>
        artiste.nom.toLocaleLowerCase().startsWith(cleanQuery) &&
        (selectedStyle === "" || artiste.style.includes(selectedStyle)) &&
        (selectedVille === "" || artiste.ville === selectedVille) &&
        (selectedInstrument === "" ||
          artiste.instrument.includes(selectedInstrument)) &&
        (!onlyWithAnnonce ||
          (artiste.annonce && artiste.annonce.trim() !== "")) &&
        (!onlyWithAudio || (artiste.audio && artiste.audio.trim() !== "")) &&
        (!onlyWithPhoto || (artiste.photo && artiste.photo.trim() !== ""))
    );
  }, [
    cleanQuery,
    selectedStyle,
    selectedVille,
    selectedInstrument,
    onlyWithAnnonce,
    onlyWithAudio,
    onlyWithPhoto,
    data,
  ]);

  const totalPages = Math.ceil(filteredData.length / maxCards);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * maxCards;
    const endIndex = startIndex + maxCards;
    return filteredData.slice(startIndex, endIndex);
  };

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPages(page);
      window.scrollTo(0, 0);
    }
  };

  const toggleResearch = () => {
    setIsResearchOpen(!isResearchOpen);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCurrentPages(1);
  }, [searchQuery, selectedStyle, selectedVille, selectedInstrument]);

  return (
    <div>
      <Header>
        <nav className="header__nav">
          <button
            className="header__button"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
            aria-label="retour à la page précédente"
          >
            Retour
          </button>
          <div className="header__research">
            <div>
              <label
                className={`header__input--research  ${
                  isResearchOpen
                    ? "header__checkboxAnnonce"
                    : "header__link--hidden"
                }`}
              >
                <input
                  type="checkbox"
                  checked={onlyWithPhoto}
                  onChange={(e) => setOnlyWithPhoto(e.target.checked)}
                />
                Afficher les profils avec photo
              </label>
              <label
                className={`header__input--research  ${
                  isResearchOpen
                    ? "header__checkboxAnnonce"
                    : "header__link--hidden"
                }`}
              >
                <input
                  type="checkbox"
                  checked={onlyWithAudio}
                  onChange={(e) => setOnlyWithAudio(e.target.checked)}
                />
                Afficher les profils avec audio
              </label>
              <label
                className={`header__input--research  ${
                  isResearchOpen
                    ? "header__checkboxAnnonce"
                    : "header__link--hidden"
                }`}
              >
                <input
                  type="checkbox"
                  checked={onlyWithAnnonce}
                  onChange={(e) => setOnlyWithAnnonce(e.target.checked)}
                />
                Afficher les profils avec une annonce
              </label>
            </div>
            <div className="header__research--flex">
              <button className="header__button" onClick={toggleResearch}>
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ color: "white" }}
                ></i>
              </button>
              <div className="header__nav--research">
                <input
                  type="text"
                  placeholder="par Nom"
                  className={`header__input--research ${
                    isResearchOpen ? "" : "header__link--hidden"
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                ></input>
                <select
                  className={`header__input--research ${
                    isResearchOpen ? "" : "header__link--hidden"
                  }`}
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  {selectedStyle === "" && (
                    <option value="" disabled hidden>
                      Par style
                    </option>
                  )}
                  <option value="">Tous les styles</option>
                  {allStyles.map((style, index) => (
                    <option key={index} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
                <select
                  className={`header__input--research ${
                    isResearchOpen ? "" : "header__link--hidden"
                  }`}
                  value={selectedInstrument}
                  onChange={(e) => setSelectedInstrument(e.target.value)}
                >
                  {selectedInstrument === "" && (
                    <option value="" disabled hidden>
                      Par instruments
                    </option>
                  )}
                  <option value="">Tous les instruments</option>
                  {allInstruments.map((instrument, index) => (
                    <option key={index} value={instrument}>
                      {instrument}
                    </option>
                  ))}
                </select>
                <select
                  className={`header__input--research ${
                    isResearchOpen ? "" : "header__link--hidden"
                  }`}
                  value={selectedVille}
                  onChange={(e) => setSelectedVille(e.target.value)}
                >
                  {selectedVille === "" && (
                    <option value="" disabled hidden>
                      Par ville
                    </option>
                  )}
                  <option value="">Toutes les villes</option>
                  {allVilles.map((ville, index) => (
                    <option key={index} value={ville}>
                      {ville}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </nav>
        <h1 className="header__title">GUITARISTES LIMOGES</h1>
      </Header>
      <Main>
        <h2 className="main__title">TOUS LES GUITARISTES</h2>
        {filteredData.length > 0 ? (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
            <div className="main__gallery">
              {getCurrentPageData().map((post) => (
                <Card
                  key={post._id}
                  slug={post.slug}
                  nom={post.nom}
                  photo={post.photo}
                  photoDown={post.photoDown}
                  audio={post.audio}
                  annonce={post.annonce}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </>
        ) : (
          <div className="main__empty">Aucun musicien trouvé</div>
        )}
      </Main>
      <Footer />
    </div>
  );
}

export default Artistes;

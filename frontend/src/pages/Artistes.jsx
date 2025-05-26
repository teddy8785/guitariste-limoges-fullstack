import Header from "../components/Header";
import Main from "../components/Main";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import { useEffect, useState, useMemo } from "react";

function Artistes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
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

  // Extraire les styles uniques
  const allStyles = useMemo(() => {
    const styles = data.flatMap((artiste) => artiste.style);
    return [...new Set(styles)];
  }, []);

  // Filtrage combiné par nom et style
  const cleanQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredData = useMemo(() => {
    return data.filter(
      (artiste) =>
        artiste.nom.toLocaleLowerCase().startsWith(cleanQuery) &&
        (selectedStyle === "" || artiste.style.includes(selectedStyle))
    );
  }, [cleanQuery, selectedStyle, data]);

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
  }, [searchQuery]);

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
            </div>
          </div>
        </nav>
        <h1 className="header__title">GUITARISTES LIMOGES</h1>
      </Header>
      <Main>
        <h2 className="main__title">TOUS LES GUITARISTES</h2>
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        )}
        <div className="main__gallery">
          {getCurrentPageData().map((post) => (
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
        {filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        )}
      </Main>
      <Footer />
    </div>
  );
}

export default Artistes;

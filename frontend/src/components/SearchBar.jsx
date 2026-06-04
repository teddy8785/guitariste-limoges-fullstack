import React, { useMemo } from "react";

function SearchBar({
  data = [],
  searchQuery,
  setSearchQuery,
  selectedVille,
  setSelectedVille,
  selectedStyle,
  setSelectedStyle,
  selectedInstrument,
  setSelectedInstrument,
  onlyWithAnnonce,
  setOnlyWithAnnonce,
  onlyWithAudio,
  setOnlyWithAudio,
  onlyWithPhoto,
  setOnlyWithPhoto,
  onlyReported,
  setOnlyReported,
  isResearchOpen,
  setIsResearchOpen,
  role,
  token,
  sortOrder,
  setSortOrder,
}) {
  const toggleResearch = () => setIsResearchOpen(!isResearchOpen);

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

  return (
    <div hidden={!isResearchOpen} className="header__research">
      <legend className="sr-only">Tri des résultats</legend>
      <div
        className={`header__input--research ${
          isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
        }`}
      >
        <div className="header__filters">
          <label htmlFor="sort-date">
            <input
              id="sort-date"
              type="checkbox"
              name="sort"
              value="dateDesc"
              checked={sortOrder === "dateDesc"}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            les plus récents
          </label>
          <label htmlFor="sort-likes">
            <input
              id="sort-likes"
              type="checkbox"
              name="sort"
              value="likesDesc"
              checked={sortOrder === "likesDesc"}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            les plus likés
          </label>
          <label htmlFor="sort-alpha-asc">
            <input
              id="sort-alpha-asc"
              type="checkbox"
              name="sort"
              value="alphaAsc"
              checked={sortOrder === "alphaAsc"}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            ordre alphabétique (A → Z)
          </label>
          <label htmlFor="sort-alpha-desc">
            <input
              id="sort-alpha-desc"
              type="checkbox"
              name="sort"
              value="alphaDesc"
              checked={sortOrder === "alphaDesc"}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            ordre alphabétique (Z → A)
          </label>
        </div>
      </div>
      <div className="header__filters">
        {token && role === "admin" && (
          <label
            htmlFor="only-reported"
            className={`header__input--research  ${
              isResearchOpen
                ? "header__checkboxAnnonce"
                : "header__link--hidden"
            }`}
          >
            <input
              id="only-reported"
              type="checkbox"
              checked={onlyReported}
              onChange={(e) => setOnlyReported(e.target.checked)}
            />
            Afficher uniquement les profils signalés
          </label>
        )}
        <label
          htmlFor="only-photo"
          className={`header__input--research  ${
            isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
          }`}
        >
          <input
            id="only-photo"
            type="checkbox"
            checked={onlyWithPhoto}
            onChange={(e) => setOnlyWithPhoto(e.target.checked)}
          />
          Afficher les profils avec photo
        </label>
        <label
          htmlFor="only-audio"
          className={`header__input--research  ${
            isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
          }`}
        >
          <input
            id="only-audio"
            type="checkbox"
            checked={onlyWithAudio}
            onChange={(e) => setOnlyWithAudio(e.target.checked)}
          />
          Afficher les profils avec audio
        </label>
        <label
          htmlFor="only-annonce"
          className={`header__input--research  ${
            isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
          }`}
        >
          <input
            id="only-annonce"
            type="checkbox"
            checked={onlyWithAnnonce}
            onChange={(e) => setOnlyWithAnnonce(e.target.checked)}
          />
          Afficher les profils avec une annonce
        </label>
      </div>
      <div className="header__research--flex">
        <button
          className="header__button"
          onClick={toggleResearch}
          aria-label="Ouvrir la recherche"
        >
          <i
            className="fa-solid fa-magnifying-glass"
            style={{ color: "white" }}
          ></i>
        </button>
        <div className="header__nav--research">
          <label htmlFor="search-name" className="sr-only">
            Recherche par nom
          </label>
          <input
            id="search-name"
            type="text"
            placeholder="par Nom"
            className={`header__input--research ${
              isResearchOpen ? "" : "header__link--hidden"
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label htmlFor="style-select" className="sr-only">
            Filtrer par style
          </label>
          <select
            id="style-select"
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
            {allStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          <label htmlFor="instrument-select" className="sr-only">
            Filtrer par instrument
          </label>
          <select
            className={`header__input--research ${
              isResearchOpen ? "" : "header__link--hidden"
            }`}
            id="instrument-select"
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
          >
            {selectedInstrument === "" && (
              <option value="" disabled hidden>
                Par instruments
              </option>
            )}
            <option value="">Tous les instruments</option>
            {allInstruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
          <label htmlFor="ville-select" className="sr-only">
            Filtrer par ville
          </label>
          <select
            id="ville-select"
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
            {allVilles.map((ville) => (
              <option key={ville} value={ville}>
                {ville}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;

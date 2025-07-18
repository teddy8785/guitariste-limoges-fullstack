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
    <div className="header__research">
      <div
        className={`header__input--research ${
          isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
        }`}
      >
        <label>
          <input
            type="checkbox"
            name="sort"
            value="dateDesc"
            checked={sortOrder === "dateDesc"}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          les plus récents
        </label>
        <label>
          <input
            type="checkbox"
            name="sort"
            value="likesDesc"
            checked={sortOrder === "likesDesc"}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          les plus likés
        </label>
        <label>
          <input
            type="checkbox"
            name="sort"
            value="alphaAsc"
            checked={sortOrder === "alphaAsc"}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          ordre alphabétique (A → Z)
        </label>
        <label>
          <input
            type="checkbox"
            name="sort"
            value="alphaDesc"
            checked={sortOrder === "alphaDesc"}
            onChange={(e) => setSortOrder(e.target.value)}
          />
          ordre alphabétique (Z → A)
        </label>
      </div>
      <div>
        {token && role === "admin" && (
          <label
            className={`header__input--research  ${
              isResearchOpen
                ? "header__checkboxAnnonce"
                : "header__link--hidden"
            }`}
          >
            <input
              type="checkbox"
              checked={onlyReported}
              onChange={(e) => setOnlyReported(e.target.checked)}
            />
            Afficher uniquement les profils signalés
          </label>
        )}
        <label
          className={`header__input--research  ${
            isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
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
            isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
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
            isResearchOpen ? "header__checkboxAnnonce" : "header__link--hidden"
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
          />
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
            {allStyles.map((style) => (
              <option key={style} value={style}>
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
            {allInstruments.map((instrument) => (
              <option key={instrument} value={instrument}>
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

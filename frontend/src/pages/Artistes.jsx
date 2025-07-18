import Header from "../components/Header";
import Main from "../components/Main";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function Artistes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVille, setSelectedVille] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [onlyWithAnnonce, setOnlyWithAnnonce] = useState(false);
  const [onlyWithAudio, setOnlyWithAudio] = useState(false);
  const [onlyWithPhoto, setOnlyWithPhoto] = useState(false);
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [onlyReported, setOnlyReported] = useState(false);
  const [reportedProfilesIds, setReportedProfilesIds] = useState(new Set());
  const [sortOrder, setSortOrder] = useState("");

  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
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

  useEffect(() => {
    if (role !== "admin") {
      setReportedProfilesIds(new Set());
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setReportedProfilesIds(new Set());
      return;
    }

    fetch("http://localhost:4000/api/report/admin/reported-profiles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Non autorisé");
        }
        return res.json();
      })
      .then((reportedProfiles) => {
        const ids = new Set(reportedProfiles.map((p) => p._id));
        setReportedProfilesIds(ids);
      })
      .catch(() => setReportedProfilesIds(new Set()));
  }, [role]);

  // Filtrage combiné par nom et style
  const cleanQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredData = useMemo(() => {
    return data
      .filter(
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
      )
      .filter((artiste) =>
        onlyReported ? reportedProfilesIds.has(artiste._id) : true
      );
  }, [
    cleanQuery,
    selectedStyle,
    selectedVille,
    selectedInstrument,
    onlyWithAnnonce,
    onlyWithAudio,
    onlyWithPhoto,
    onlyReported,
    reportedProfilesIds,
    data,
  ]);

  const totalPages = Math.ceil(filteredData.length / maxCards);

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * maxCards;
    const endIndex = startIndex + maxCards;
    return sortedData.slice(startIndex, endIndex);
  };
  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStyle, selectedVille, selectedInstrument]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const onlyReportedFromQuery = params.get("onlyReported") === "true";
    if (onlyReportedFromQuery) {
      setOnlyReported(true);
    }
  }, [location.search]);

  const sortedData = useMemo(() => {
    let sorted = [...filteredData];

    if (sortOrder === "likesDesc") {
      sorted.sort((a, b) => b.likes - a.likes);
    } else if (sortOrder === "likesAsc") {
      sorted.sort((a, b) => a.likes - b.likes);
    } else if (sortOrder === "dateDesc") {
      sorted.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      );
    } else if (sortOrder === "dateAsc") {
      sorted.sort(
        (a, b) =>
          new Date(a.updatedAt || a.createdAt) -
          new Date(b.updatedAt || b.createdAt)
      );
    } else if (sortOrder === "alphaAsc") {
      sorted.sort((a, b) =>
        a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" })
      );
    } else if (sortOrder === "alphaDesc") {
      sorted.sort((a, b) =>
        b.nom.localeCompare(a.nom, "fr", { sensitivity: "base" })
      );
    }
    return sorted;
  }, [filteredData, sortOrder]);

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
          <SearchBar
            data={data}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedVille={selectedVille}
            setSelectedVille={setSelectedVille}
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            selectedInstrument={selectedInstrument}
            setSelectedInstrument={setSelectedInstrument}
            onlyWithAnnonce={onlyWithAnnonce}
            setOnlyWithAnnonce={setOnlyWithAnnonce}
            onlyWithAudio={onlyWithAudio}
            setOnlyWithAudio={setOnlyWithAudio}
            onlyWithPhoto={onlyWithPhoto}
            setOnlyWithPhoto={setOnlyWithPhoto}
            isResearchOpen={isResearchOpen}
            setIsResearchOpen={setIsResearchOpen}
            onlyReported={onlyReported}
            setOnlyReported={setOnlyReported}
            role={role}
            token={token}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
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

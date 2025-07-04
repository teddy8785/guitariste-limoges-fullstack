import { useEffect, useState } from "react";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const Report = ({ profileId, userId }) => {
  const [reported, setReported] = useState(false);
  const [error, setError] = useState(null);
  const [visitorId, setVisitorId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  // Création/chargement visitorId si non connecté
  useEffect(() => {
    if (!userId) {
      const storedId = localStorage.getItem("visitorId");
      if (storedId) {
        setVisitorId(storedId);
      } else {
        const newId = generateUUID();
        localStorage.setItem("visitorId", newId);
        setVisitorId(newId);
      }
    } else {
      // Si connecté, ne plus utiliser visitorId
      setVisitorId(null);
    }
  }, [userId]);

  // Vérification si le profil a déjà été signalé
  useEffect(() => {
    if (!profileId) return;

    const checkStatus = async () => {
      try {
        let queryParams = new URLSearchParams({ profileId });
        const headers = { "Content-Type": "application/json" };

        if (userId) {
          const token = localStorage.getItem("token");
          if (token) headers["Authorization"] = `Bearer ${token}`;
          // Pas besoin d’ajouter userId dans les query params
        } else if (visitorId) {
          queryParams.append("visitorId", visitorId);
        } else {
          return; // Rien à faire si ni user ni visitor
        }

        const res = await fetch(
          `http://localhost:4000/api/report/status?${queryParams}`,
          { method: "GET", headers }
        );

        const data = await res.json();
        setReported(!!data.reported);
      } catch (err) {
        console.error("Erreur récupération statut signalement:", err);
      }
    };

    checkStatus();
  }, [profileId, userId, visitorId]);

  const openReportModal = () => {
    if (reported) return;
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReason("");
    setError(null);
  };

  const handleReport = async () => {
    if (!selectedReason) {
      setError("Veuillez sélectionner un motif.");
      return;
    }

    try {
      const bodyData = { profileId, reason: selectedReason };
      const headers = { "Content-Type": "application/json" };

      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else if (visitorId) {
        bodyData.visitorId = visitorId;
      } else {
        setError("Impossible de signaler : identifiant manquant.");
        return;
      }

      const res = await fetch("http://localhost:4000/api/report", {
        method: "POST",
        headers,
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Erreur lors du signalement");
        if (data.message === "Vous avez déjà signalé ce profil.") {
          setReported(true);
        }
      } else {
        setReported(true);
        setError(null);
        setShowModal(false); // Ferme la modale
      }
    } catch (err) {
      console.error("Erreur catch:", err);
      setError("Erreur réseau");
    }
  };

  return (
    <div className="card__report--container">
      {showModal && (
        <div className="card__modal">
          <div className="card__modal--choise">
            <select
              value={selectedReason}
              onChange={(e) => {
                setSelectedReason(e.target.value);
                if (error === "Veuillez sélectionner un motif.") {
                  setError(null);
                }
              }}
            >
              <option value="">-- Choisir un motif --</option>
              <option value="contenu inapproprié">Contenu inapproprié</option>
              <option value="Violation des droits d'auteur">Violation des droits d'auteur</option>
              <option value="faux profil">Faux profil</option>
              <option value="spam">Spam</option>
              <option value="autre">Autre</option>
            </select>
            {error === "Veuillez sélectionner un motif." && <p className="card__modal--msgError">{error}</p>}
          </div>
          <div className="card__modal--validate">
            <button onClick={handleReport}>Confirmer</button>
            <button onClick={closeModal}>Annuler</button>
          </div>
        </div>
      )}
      <div
        className={`card__report ${reported ? "reported" : ""}`}
        onClick={handleReport}
        style={{ cursor: reported ? "default" : "pointer" }}
      >
        <i
          className="fa-solid fa-flag"
          onClick={openReportModal}
          disabled={reported}
        ></i>
        <span className="card__report--tooltip">
          {reported ? "Déjà signalé" : "Signaler"}
        </span>
      </div>
    </div>
  );
};

export default Report;

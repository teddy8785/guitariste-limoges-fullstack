import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allInstruments, allStyles } from "../assets/data";
import ErrorDisplay from "./ErrorDisplay";

function CreateProfil({ onSubmit, initialData = {} }) {
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    ville: "",
    photo: null, // ici photo est un File ou null
    photoPreview: "", // string base64 pour preview
    photoDown: "",
    style: [],
    instrument: [],
    audio: "",
    audioPreview: "",
    audioDeleted: false,
    histoire: "",
    mail: "",
    lienx: "",
    lieninstagram: "",
    lienyoutube: "",
    annonce: "",
    copyrightAccepted: false,
  });

  const hasMedia = () => {
    // On considère qu'on a une photo valide si on a un fichier ou une preview non vide
    const photoExists =
      formData.photo instanceof File ||
      (formData.photoPreview && formData.photoPreview !== "");
    // On considère qu'on a un audio valide si on a un fichier ou une preview non vide
    const audioExists =
      formData.audio instanceof File ||
      (formData.audioPreview && formData.audioPreview !== "");
    return photoExists || audioExists;
  };
  const navigate = useNavigate();

  useEffect(() => {
    const sanitizeArray = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return val.split(",").map((v) => v.trim());
      return [];
    };

    setFormData({
      nom: initialData.nom || "",
      ville: initialData.ville || "",
      photo: null,
      photoPreview: initialData.photo || "",
      photoDown: initialData.photoDown || "",
      style: sanitizeArray(initialData.style),
      instrument: sanitizeArray(initialData.instrument),
      audio: initialData.audio || "",
      audioPreview: initialData.audio || "",
      audioDeleted: false,
      histoire: initialData.histoire || "",
      mail: initialData.mail || "",
      lienx: initialData.lienx || "",
      lieninstagram: initialData.lieninstagram || "",
      lienyoutube: initialData.lienyoutube || "",
      annonce: initialData.annonce || "",
      photoDeleted: false,
      copyrightAccepted: initialData.copyrightAccepted || false,
    });
  }, [initialData]);

  useEffect(() => {
    const photoExists =
      formData.photo instanceof File ||
      (formData.photoPreview && formData.photoPreview !== "");
    const audioExists =
      formData.audio instanceof File ||
      (formData.audioPreview && formData.audioPreview !== "");

    const mediaExists = photoExists || audioExists;

    if (!mediaExists) {
      // Si la case est cochée, on la décoche
      if (formData.copyrightAccepted) {
        setFormData((prev) => ({
          ...prev,
          copyrightAccepted: false,
        }));
      }
      // Si un message d'erreur est affiché, on le supprime
      if (error) {
        setError(null);
      }
    }
  }, [
    formData.photo,
    formData.photoPreview,
    formData.audio,
    formData.audioPreview,
    formData.copyrightAccepted,
    error,
  ]);

  useEffect(() => {
    if (formData.copyrightAccepted && error) {
      setError(null);
    }
  }, [formData.copyrightAccepted, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const audioUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        audio: file,
        audioPreview: audioUrl,
        audioDeleted: false,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (hasMedia() && !formData.copyrightAccepted) {
      setError(
        "Vous devez certifier que les droits d'auteur sont respectés pour la photo ou l'audio."
      );
      return;
    }

    const sanitizeArray = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === "string") return val.split(",").map((v) => v.trim());
      return [];
    };

    const payload = {
      ...formData,
      style: sanitizeArray(formData.style),
      instrument: sanitizeArray(formData.instrument),
      photo: formData.photo ? formData.photo : formData.photoPreview,
    };

    if (
      formData.audioDeleted &&
      typeof formData.audio === "string" &&
      formData.audio !== ""
    ) {
      payload.audioToDelete = formData.audio;
      payload.audio = null;
    }

    try {
      // ATTENTION ici on récupère le slug retourné par onSubmit
      const newSlug = await onSubmit(payload);

      if (newSlug) {
        navigate(`/artiste/${newSlug}`);
      } else if (initialData._id && initialData.slug) {
        // fallback si pas de nouveau slug
        navigate(`/artiste/${initialData.slug}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur submit profil:", error);
      alert(
        "Erreur lors de la mise à jour : " +
          (error.message || JSON.stringify(error))
      );
    }
  };

  return (
    <div className="header">
      <button className="header__button" onClick={() => navigate("/")}>
        Retour
      </button>

      <h2 className="form__title">Créer son profil</h2>

      <form className="form-profil form-profil__profil" onSubmit={handleSubmit}>
        <label className="form-profil__label">Nom:</label>
        <input
          className="form-profil__input"
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />

        <label className="form-profil__label">Ville:</label>
        <input
          className="form-profil__input"
          type="text"
          name="ville"
          value={formData.ville}
          onChange={handleChange}
        />

        <label className="form-profil__label">Photo (fichier local):</label>
        <input
          className="form-profil__input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        {formData.photoPreview && (
          <div className="form-profil__preview">
            <img
              className="form-profil__img"
              src={formData.photoPreview}
              alt="Aperçu"
            />
            <button
              className="form-profil__button form-profil__button--delete"
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  photoPreview: "", // on vide la photo preview
                  photo: null, // on supprime aussi le fichier sélectionné
                  photoDeleted: true, // on ajoute un flag pour signaler suppression
                  copyrightAccepted: false,
                }))
              }
            >
              Supprimer la photo
            </button>
          </div>
        )}

        <label className="form-profil__label">Audio (fichier local):</label>
        <input
          className="form-profil__input"
          type="file"
          name="audio"
          accept="audio/*"
          onChange={handleAudioChange}
        />

        {(formData.audioPreview || formData.audio) && (
          <div className="form-profil__preview">
            <audio controls src={formData.audioPreview}>
              Votre navigateur ne supporte pas l’élément audio.
            </audio>
            <button
              type="button"
              className="form-profil__button form-profil__button--delete"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  audio: "",
                  audioPreview: "",
                  audioDeleted: true,
                  copyrightAccepted: false,
                }))
              }
            >
              Supprimer l'audio
            </button>
          </div>
        )}

        <div className="form-profil__select">
          <label className="form-profil__label">Style(s) :</label>
          <div className="form-profil__input">
            {allStyles.map((style) => (
              <label key={style}>
                <input
                  type="checkbox"
                  value={style}
                  checked={formData.style.includes(style)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      style: isChecked
                        ? [...prev.style, value]
                        : prev.style.filter((s) => s !== value),
                    }));
                  }}
                />
                {style}
              </label>
            ))}
          </div>

          <label className="form-profil__label">Instrument(s):</label>
          <div className="form-profil__input">
            {allInstruments.map((instrument) => (
              <label key={instrument}>
                <input
                  type="checkbox"
                  value={instrument}
                  checked={formData.instrument.includes(instrument)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isChecked = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      instrument: isChecked
                        ? [...prev.instrument, value]
                        : prev.instrument.filter((s) => s !== value),
                    }));
                  }}
                />
                {instrument}
              </label>
            ))}
          </div>
        </div>

        <label className="form-profil__label">Histoire:</label>
        <textarea
          name="histoire"
          value={formData.histoire}
          onChange={handleChange}
        />

        <label className="form-profil__label">Email:</label>
        <input
          className="form-profil__input"
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
        />

        <label className="form-profil__label">Lien X (ex-Twitter):</label>
        <input
          className="form__input"
          type="text"
          name="lienx"
          value={formData.lienx}
          onChange={handleChange}
        />

        <label className="form-profil__label">Instagram:</label>
        <input
          className="form-profil__input"
          type="text"
          name="lieninstagram"
          value={formData.lieninstagram}
          onChange={handleChange}
        />

        <label className="form-profil__label">YouTube:</label>
        <input
          className="form-profil__input"
          type="text"
          name="lienyoutube"
          value={formData.lienyoutube}
          onChange={handleChange}
        />

        <label className="form-profil__label">Annonce:</label>
        <textarea
          name="annonce"
          value={formData.annonce}
          onChange={handleChange}
        />

        {hasMedia() && (
          <label className="form-profil__label">
            <input
              type="checkbox"
              name="copyrightAccepted"
              checked={formData.copyrightAccepted || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  copyrightAccepted: e.target.checked,
                }))
              }
            />
            Je certifie que les droits d'auteur des contenus publiés sont
            respectés
          </label>
        )}
        {error && <ErrorDisplay message={error} />}
        <button className="form-profil__button" type="submit">
          Valider
        </button>
      </form>
    </div>
  );
}

export default CreateProfil;

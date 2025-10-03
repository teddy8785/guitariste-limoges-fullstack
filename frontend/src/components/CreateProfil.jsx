import villes from "../assets/villes.json";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allInstruments, allStyles } from "../assets/data";
import ErrorDisplay from "./ErrorDisplay";

function CreateProfil({ onSubmit, initialData = {} }) {
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
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

  const YOUTUBE_REGEX = /^https:\/\/(www\.youtube\.com)\//;
  const X_REGEX = /^https:\/\/(x\.com)\//;
  const INSTAGRAM_REGEX = /^https:\/\/(www\.instagram\.com)\//;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors.general && Array.isArray(errors.general)) {
      // Créer un tableau filtré en enlevant seulement l'erreur liée au champ modifié
      let filteredErrors = errors.general.filter((msg) => {
        if (name === "lienx") return !msg.includes("Le lien X");
        if (name === "lieninstagram") return !msg.includes("Instagram");
        if (name === "lienyoutube") return !msg.includes("YouTube");
        if (name === "copyrightAccepted") {
          // supprimer uniquement l'erreur liée au copyright, pas les autres
          return !msg.toLowerCase().includes("droits d'auteur");
        }
        return true; // garder les autres erreurs
      });

      setErrors((prev) => ({
        ...prev,
        general: filteredErrors.length > 0 ? filteredErrors : undefined,
      }));
    }
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

  function removeCopyrightErrors(errors) {
    if (!errors.general) return errors;

    const filteredErrors = errors.general.filter(
      (msg) => !msg.toLowerCase().includes("droits d'auteur")
    );

    if (filteredErrors.length > 0) {
      return { ...errors, general: filteredErrors };
    } else {
      const { general, ...rest } = errors;
      return rest;
    }
  }

  const validateForm = () => {
    const errorMessages = [];

    if (formData.lienx && !X_REGEX.test(formData.lienx.trim())) {
      errorMessages.push("Le lien X doit commencer par https://x.com/");
    }

    if (
      formData.lieninstagram &&
      !INSTAGRAM_REGEX.test(formData.lieninstagram.trim())
    ) {
      errorMessages.push(
        "Le lien Instagram doit commencer par https://www.instagram.com/"
      );
    }

    if (
      formData.lienyoutube &&
      !YOUTUBE_REGEX.test(formData.lienyoutube.trim())
    ) {
      errorMessages.push(
        "Le lien YouTube doit commencer par https://www.youtube.com/"
      );
    }

    const photoExists =
      formData.photo instanceof File ||
      (formData.photoPreview && formData.photoPreview !== "");
    const audioExists =
      formData.audio instanceof File ||
      (formData.audioPreview && formData.audioPreview !== "");

    if (photoExists && audioExists && !formData.copyrightAccepted) {
      errorMessages.push(
        "Vous devez certifier que les droits d'auteur sont respectés pour la photo et l'audio."
      );
    } else if (photoExists && !audioExists && !formData.copyrightAccepted) {
      errorMessages.push(
        "Vous devez certifier que les droits d'auteur sont respectés pour la photo."
      );
    } else if (!photoExists && audioExists && !formData.copyrightAccepted) {
      errorMessages.push(
        "Vous devez certifier que les droits d'auteur sont respectés pour l'audio."
      );
    }

    const newErrors = {};
    if (errorMessages.length > 0) {
      newErrors.general = errorMessages;
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // On récupère la ville saisie et on la met en minuscule pour comparer
    const villeSaisie = formData.ville.trim().toLowerCase();

    // On cherche la version correcte dans le fichier villes.json
    const villeCorrecte = villes.find((v) => v.toLowerCase() === villeSaisie);

    if (!villeCorrecte) {
      const errorMessage = "La ville saisie n'existe pas.";
      setErrors((prev) => {
        const general = prev.general || [];
        if (!general.includes(errorMessage)) {
          return { ...prev, general: [...general, errorMessage] };
        }
        return prev;
      });
      return;
    }

    // Si on a trouvé la ville correcte, on remplace la saisie par celle du fichier
    setFormData((prev) => ({ ...prev, ville: villeCorrecte }));

    setErrors({});

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
      // on récupère le slug retourné par onSubmit
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

  function normalizeString(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // enlever accents
      .replace(/[\s-]/g, ""); // enlever espaces et tirets
  }

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
          autoComplete="off"
          onChange={(e) => {
            const value = e.target.value;
            setFormData((prev) => ({ ...prev, ville: value }));

            if (value.length > 0) {
              const filtered = villes.filter((v) =>
                normalizeString(v).startsWith(normalizeString(value))
              );
              setSuggestions(filtered);
            } else {
              setSuggestions([]);
            }
          }}
          onBlur={() => {
            if (suggestions.length > 0) {
              setFormData((prev) => ({ ...prev, ville: suggestions[0] }));
            }
            setTimeout(() => setSuggestions([]), 100);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <ul className="form-profil__suggestions-list">
            {suggestions.map((v, idx) => (
              <li
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault(); // pour ne pas perdre le focus
                  // mettre la version avec tirets dans l'input
                  setFormData((prev) => ({
                    ...prev,
                    ville: v.replace(/\s+/g, "-"),
                  }));
                  setSuggestions([]);
                }}
              >
                {v} {/* on affiche la ville avec espaces pour lisibilité */}
              </li>
            ))}
          </ul>
        )}

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
          placeholder="https://x.com/"
          value={formData.lienx}
          onChange={handleChange}
        />

        <label className="form-profil__label">Instagram:</label>
        <input
          className="form-profil__input"
          type="text"
          name="lieninstagram"
          placeholder="https://www.instagram.com/"
          value={formData.lieninstagram}
          onChange={handleChange}
        />

        <label className="form-profil__label">YouTube:</label>
        <input
          className="form-profil__input"
          type="text"
          name="lienyoutube"
          placeholder="https://www.youtube.com/"
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
              onChange={(e) => {
                const checked = e.target.checked;
                setFormData((prev) => ({
                  ...prev,
                  copyrightAccepted: checked,
                }));

                if (checked) {
                  setErrors((prev) => removeCopyrightErrors(prev));
                }
              }}
            />
            Je certifie que les droits d'auteur des contenus publiés sont
            respectés
          </label>
        )}
        {errors.general && <ErrorDisplay message={errors.general} />}
        <button className="form-profil__button" type="submit">
          Valider
        </button>
      </form>
    </div>
  );
}

export default CreateProfil;

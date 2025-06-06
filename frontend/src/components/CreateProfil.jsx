import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { allInstruments } from "../assets/data";
import { allStyles } from "../assets/data";

function CreateProfil({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    nom: "",
    ville: "",
    photo: null, // ici photo est un File ou null
    photoPreview: "", // string base64 pour preview
    photoDown: "",
    style: [],
    instrument: [],
    audio: "",
    histoire: "",
    mail: "",
    lienx: "",
    lieninstagram: "",
    lienyoutube: "",
    annonce: "",
  });

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
      histoire: initialData.histoire || "",
      mail: initialData.mail || "",
      lienx: initialData.lienx || "",
      lieninstagram: initialData.lieninstagram || "",
      lienyoutube: initialData.lienyoutube || "",
      annonce: initialData.annonce || "",
      photoDeleted: false,
    });
  }, [initialData]);

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
      setFormData((prev) => ({ ...prev, audio: file }));
      const audioUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, audioPreview: audioUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      await onSubmit(payload);
      if (initialData._id) {
        navigate(`/artiste/${initialData._id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    }
  };

  return (
    <div className="header">
      <button className="header__button" onClick={() => navigate("/")}>
        Retour
      </button>

      <h2 className="form__title">Créer son profil</h2>

      <form className="form form__profil" onSubmit={handleSubmit}>
        <label className="form__label">Nom:</label>
        <input
          className="form__input"
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />

        <label className="form__label">Ville:</label>
        <input
          className="form__input"
          type="text"
          name="ville"
          value={formData.ville}
          onChange={handleChange}
        />

        <label className="form__label">Photo (fichier local):</label>
        <input
          className="form__input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        {formData.photoPreview && (
          <div className="form__preview">
            <img
              className="form__img"
              src={formData.photoPreview}
              alt="Aperçu"
            />
            <button
              className="form__button form__button--delete"
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  photoPreview: "", // on vide la photo preview
                  photo: null, // on supprime aussi le fichier sélectionné
                  photoDeleted: true, // on ajoute un flag pour signaler suppression
                }))
              }
            >
              Supprimer la photo
            </button>
          </div>
        )}

        <label className="form__label">Audio (fichier local):</label>
        <input
          className="form__input"
          type="file"
          name="audio"
          accept="audio/*"
          onChange={handleAudioChange}
        />
        {formData.audio && (
          <div>
            <audio controls src={formData.audioPreview}>
              <source src={formData.audio} type="audio/mpeg" />
              Votre navigateur ne supporte pas l’élément audio.
            </audio>
          </div>
        )}

        <div className="form__select">
          <label className="form__label">Style(s) :</label>
          <div className="form__input">
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

          <label className="form__label">Instrument(s):</label>
          <div className="form__input">
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

        <label className="form__label">Histoire:</label>
        <textarea
          name="histoire"
          value={formData.histoire}
          onChange={handleChange}
        />

        <label className="form__label">Email:</label>
        <input
          className="form__input"
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
        />

        <label className="form__label">Lien X (ex-Twitter):</label>
        <input
          className="form__input"
          type="text"
          name="lienx"
          value={formData.lienx}
          onChange={handleChange}
        />

        <label className="form__label">Instagram:</label>
        <input
          className="form__input"
          type="text"
          name="lieninstagram"
          value={formData.lieninstagram}
          onChange={handleChange}
        />

        <label className="form__label">YouTube:</label>
        <input
          className="form__input"
          type="text"
          name="lienyoutube"
          value={formData.lienyoutube}
          onChange={handleChange}
        />

        <label className="form__label">Annonce:</label>
        <textarea
          name="annonce"
          value={formData.annonce}
          onChange={handleChange}
        />

        <button className="form__button" type="submit">
          Valider
        </button>
      </form>
    </div>
  );
}

export default CreateProfil;

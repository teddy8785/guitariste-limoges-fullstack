import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/createProfil.css";
import "../styles/header.css";

function CreateProfil({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    nom: "",
    ville: "",
    photo: null, // ici photo est un File ou null
    photoPreview: "", // string base64 pour preview
    photoDown: "",
    style: "",
    instrument: "",
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
    setFormData({
      nom: initialData.nom || "",
      ville: initialData.ville || "",
      photo: null,
      photoPreview: initialData.photo || "",
      photoDown: initialData.photoDown || "",
      style: initialData.style ? initialData.style.join(", ") : "",
      instrument: initialData.instrument ? initialData.instrument.join(", ") : "",
      audio: initialData.audio || "",
      histoire: initialData.histoire || "",
      mail: initialData.mail || "",
      lienx: initialData.lienx || "",
      lieninstagram: initialData.lieninstagram || "",
      lienyoutube: initialData.lienyoutube || "",
      annonce: initialData.annonce || "",
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

    const payload = {
      ...formData,
      style: formData.style.split(",").map((s) => s.trim()),
      instrument: formData.instrument.split(",").map((s) => s.trim()),
      // Si photo est null, on envoie la photoPreview (url existante) pour dire au backend de garder l'ancienne
      photo: formData.photo ? formData.photo : formData.photoPreview,
    };

    try {
      await onSubmit(payload);
      if (initialData._id) {
        navigate(`/artiste/${initialData._id}`);
      } else {
        navigate("/index");
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour : " + error.message);
    }
  };

  return (
    <div className="header">
      <button className="header__button" onClick={() => navigate("/index")}>
        Retour
      </button>

      <h2 className="form__title">Créer son profil</h2>

      <form className="form" onSubmit={handleSubmit}>
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
              src={formData.photoPreview}
              alt="Aperçu"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          </div>
        )}

        <label className="form__label">
          Style(s) (séparés par des virgules):
        </label>
        <input
          className="form__input"
          type="text"
          name="style"
          value={formData.style}
          onChange={handleChange}
        />

        <label className="form__label">
          Instrument(s) (séparés par des virgules):
        </label>
        <input
          className="form__input"
          type="text"
          name="instrument"
          value={formData.instrument}
          onChange={handleChange}
        />

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

        <button type="submit">Valider</button>
      </form>
    </div>
  );
}

export default CreateProfil;

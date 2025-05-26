import React, { useState } from "react";
import "../styles/createProfil.css";

function CreateProfil({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    nom: initialData.nom || "",
    photo: initialData.photo || "",
    photoDown: initialData.photoDown || "",
    style: initialData.style ? initialData.style.join(", ") : "",
    audio: initialData.audio || "",
    histoire: initialData.histoire || "",
    mail: initialData.mail || "",
    lienx: initialData.lienx || "",
    lieninstagram: initialData.lieninstagram || "",
    lienyoutube: initialData.lienyoutube || "",
    annonce: initialData.annonce || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      style: formData.style.split(",").map((s) => s.trim()),
    };

    onSubmit(payload);
  };

  return (
    <div>
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

        <label className="form__label">Photo (URL):</label>
        <input
          className="form__input"
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
        />

        <label className="form__label">Photo secondaire (URL):</label>
        <input
          className="form__input"
          type="text"
          name="photoDown"
          value={formData.photoDown}
          onChange={handleChange}
        />

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

        <label className="form__label">Audio (URL):</label>
        <input
          className="form__input"
          type="text"
          name="audio"
          value={formData.audio}
          onChange={handleChange}
        />

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

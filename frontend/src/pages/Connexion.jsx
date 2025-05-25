import React, { useState } from "react";
import "../styles/connexion.css";

function Connexion() {
  const [formData, setFormData] = useState({
    nom: "",
    photo: "",
    photoDown: "",
    style: "",
    audio: "",
    histoire: "",
    mail: "",
    lienx: "",
    lieninstagram: "",
    lienyoutube: "",
    annonce: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const dataToSend = {
    ...formData,
    style: formData.style.split(",").map((s) => s.trim()),
  };

  console.log("Données à envoyer :", dataToSend);

  fetch("http://localhost:4000/api/guitaristes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Erreur lors de la création du profil");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Profil créé avec succès", data);
      // Tu peux réinitialiser le formulaire ou afficher un message ici
      setFormData({
        nom: "",
        photo: "",
        photoDown: "",
        style: "",
        audio: "",
        histoire: "",
        mail: "",
        lienx: "",
        lieninstagram: "",
        lienyoutube: "",
        annonce: "",
      });
      alert("Profil créé avec succès !");
    })
    .catch((error) => {
      console.error(error);
      alert("Une erreur est survenue lors de la création du profil.");
    });
};
  return (
    <div>
      <h2>Créer un profil guitariste</h2>
      <form onSubmit={handleSubmit}>
        <label>Nom :</label>
        <input
          type="text"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />

        <label>Photo (URL) :</label>
        <input
          type="text"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
        />

        <label>PhotoDown (URL) :</label>
        <input
          type="text"
          name="photoDown"
          value={formData.photoDown}
          onChange={handleChange}
        />

        <label>Style (sépare par des virgules) :</label>
        <input
          type="text"
          name="style"
          value={formData.style}
          onChange={handleChange}
        />

        <label>Audio (URL) :</label>
        <input
          type="text"
          name="audio"
          value={formData.audio}
          onChange={handleChange}
        />

        <label>Histoire :</label>
        <textarea
          name="histoire"
          value={formData.histoire}
          onChange={handleChange}
        />

        <label>Email :</label>
        <input
          type="email"
          name="mail"
          value={formData.mail}
          onChange={handleChange}
        />

        <label>Lien site perso :</label>
        <input
          type="text"
          name="lienx"
          value={formData.lienx}
          onChange={handleChange}
        />

        <label>Lien Instagram :</label>
        <input
          type="text"
          name="lieninstagram"
          value={formData.lieninstagram}
          onChange={handleChange}
        />

        <label>Lien YouTube :</label>
        <input
          type="text"
          name="lienyoutube"
          value={formData.lienyoutube}
          onChange={handleChange}
        />

        <label>Annonce :</label>
        <textarea
          name="annonce"
          value={formData.annonce}
          onChange={handleChange}
        />

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default Connexion;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/connexion.css";

function Inscription() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors de l'inscription");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Inscription réussie :", data);
        alert("Inscription réussie !");
        // Ici tu peux stocker le token ou rediriger l'utilisateur
        // localStorage.setItem("token", data.token);
        navigate("/connexion");
      })
      .catch((error) => {
        console.error("Erreur :", error);
        alert("Échec de l'inscription. Vérifie tes identifiants.");
      });
  };

  return (
    <div>
      <h2 className="form__title">Inscription</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__label">Email :</label>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className="form__input"
          required
        />

        <label className="form__label">Mot de passe :</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="form__input"
          required
        />

        <button className="form__button" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Inscription;

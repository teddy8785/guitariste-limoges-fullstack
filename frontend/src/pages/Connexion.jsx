import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/connexion.css";

function Connexion() {
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

    fetch("http://localhost:4000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors de la connexion");
        }
        return res.json();
      })
      .then((data) => {
        // Stocker le token et userId
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        alert("Connexion réussie !");
        // Tu peux aussi rediriger ici si tu veux
        navigate("/");
      })
      .catch((error) => {
        console.error("Erreur :", error);
        alert("Échec de la connexion. Vérifie tes identifiants.");
      });
  };

  return (
    <div>
      <h2 className="form__title">Connexion</h2>
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
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Connexion;

import React, { useState } from "react";
import PasswordInput from "../components/PasswordInput";
import Footer from "../components/Footer";
import ErrorDisplay from "../components/ErrorDisplay";
import Main from "../components/Main";

function Inscription() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
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
        setSuccess(
          "Inscription réussie ! Vérifie ton email pour activer ton compte.",
        );
        setError("");

        localStorage.setItem("userId", data.userId);
      })
      .catch((error) => {
        console.error("Erreur :", error);
        setError("Inscription en attente d’activation ou email déjà utilisé.");
        setSuccess("");
      });
  };

  return (
    <div className="index">
      <h2 className="form__title">Inscription</h2>
      <Main>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label">Email :</label>
          <input
            type="email"
            name="email"
            placeholder="Votre adresse email"
            value={credentials.email}
            onChange={handleChange}
            className="form__input"
            required
          />

          <label className="form__label">Mot de passe :</label>
          <div className="form__input--container">
            <PasswordInput
              value={credentials.password}
              onChange={handleChange}
              name="password"
              placeholder="Votre mot de passe"
            />
          </div>
          <button className="form__button form__button--space" type="submit">
            S'inscrire
          </button>
        </form>
      </Main>
      <ErrorDisplay message={error} />
      <ErrorDisplay title="Succès" message={success} />
      <Footer />
    </div>
  );
}

export default Inscription;

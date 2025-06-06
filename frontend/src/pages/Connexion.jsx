import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import ErrorDisplay from "../components/ErrorDisplay";
import Footer from "../components/Footer";

function Connexion() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setErrorMessage(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/api/auth/login", {
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
        // Stocker le token et userId et le role
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage("Adresse mail ou Mot de passe erroné");
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
        <div className="form__input--container">
          <PasswordInput
            value={credentials.password}
            onChange={handleChange}
            name="password"
            placeholder="Votre mot de passe"
          />
        </div>
        <button className="form__button form__button--space" type="submit">
          Se connecter
        </button>
        {errorMessage && <ErrorDisplay message={errorMessage} />}
      </form>
        <Footer />
    </div>
  );
}

export default Connexion;

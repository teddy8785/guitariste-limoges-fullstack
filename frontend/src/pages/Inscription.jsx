import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../components/PasswordInput";
import Footer from "../components/Footer";
import { useDispatch } from "react-redux";
import { login } from "../Store/authSlice";

function Inscription() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:4000/api/auth/signup", {
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
        alert("Inscription réussie !");
        // Ici tu peux stocker le token ou rediriger l'utilisateur
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);
        dispatch(
          login({ token: data.token, userId: data.userId, role: data.role })
        );
        navigate("/profil");
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
      <Footer />
    </div>
  );
}

export default Inscription;

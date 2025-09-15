import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PasswordInput from "../components/PasswordInput";
import ErrorDisplay from "../components/ErrorDisplay";
import Footer from "../components/Footer";

// Import actions
import { login } from "../Store/authSlice";
import { fetchUserLikes } from "../Store/likesSlice";
// import { resetLikes } from "../Store/likesSlice";

function Connexion() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const text = await res.text(); // toujours lire la réponse brute
      let data;

      try {
        data = JSON.parse(text); // tente de parser en JSON
      } catch (err) {
        throw new Error("Réponse invalide du serveur : " + text);
      }

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || "Erreur lors de la connexion"
        );
      }

      // si ici tout va bien :
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);

      const visitorKey = localStorage.getItem("visitor_key");

      if (visitorKey) {
        const transferRes = await fetch(
          "http://localhost:4000/api/likes/transfer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
            body: JSON.stringify({ visitorKey }),
          }
        );

        if (!transferRes.ok) {
          const errorText = await transferRes.text();
          console.error("Erreur transfert likes :", errorText);
        }
      }

      dispatch(
        login({ token: data.token, userId: data.userId, role: data.role })
      );
      await dispatch(fetchUserLikes(data.userId, data.token));
      navigate("/");
    } catch (error) {
      console.error("Erreur dans handleSubmit :", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h2 className="form__title">Connexion</h2>
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
        <button className="form__button" type="submit">
          Se connecter
        </button>
        <NavLink className="form__forgotPassword" to={`/forgot-password`}>Mot de passe oublié ?</NavLink>
        {errorMessage && <ErrorDisplay message={errorMessage} />}
      </form>
      <Footer />
    </div>
  );
}

export default Connexion;

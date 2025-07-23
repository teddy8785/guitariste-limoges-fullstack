import { useState } from "react";
import { useParams } from "react-router-dom";
import ErrorDisplay from "../components/ErrorDisplay";
import Footer from "../components/Footer";

function ResetPassword() {
  const { token } = useParams(); // Récupération du token dans l'URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    console.log("Reset password hit");

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:4000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      // Récupérer la réponse en texte brut
      const text = await response.text();

      // Essayer de parser en JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Erreur parsing JSON:", err);
        console.log("Réponse brute:", text);
        throw new Error("Réponse serveur non valide.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la réinitialisation.");
      }

      setSuccessMessage(data.message);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="form__title">Réinitialiser le mot de passe</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__label">Nouveau mot de passe :</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form__input"
          placeholder="Entrez votre nouveau mot de passe"
          required
        />

        <label className="form__label">Confirmez le mot de passe :</label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form__input"
          placeholder="Confirmez votre mot de passe"
          required
        />

        <button className="form__button" type="submit" disabled={loading}>
          {loading ? "Réinitialisation..." : "Réinitialiser"}
        </button>

        {errorMessage && <ErrorDisplay message={errorMessage} />}
        {successMessage && (
          <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
        )}
      </form>
      <Footer />
    </div>
  );
}

export default ResetPassword;

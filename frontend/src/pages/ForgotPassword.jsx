import ErrorDisplay from "../components/ErrorDisplay";
import Footer from "../components/Footer";
import { useState } from "react";
import SuccessDisplay from "../components/SuccesDisplay";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel API pour demander la réinitialisation
      const response = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      setSuccessMessage("Si ce compte existe, un lien de réinitialisation a été envoyé.");
      setEmail(""); // reset input
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


  return (
       <div>
      <h2 className="form__title">Mot de passe oublié</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form__label">Email :</label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          className="form__input"
          required
        />
        <button className="form__button form__button--space" type="submit">
          Envoyer le lien de réinitialisation
        </button>
        {errorMessage && <ErrorDisplay message={errorMessage} />}
        {successMessage && <SuccessDisplay message={successMessage} />}
      </form>
      <Footer />
    </div>
  );
}

export default ForgotPassword;
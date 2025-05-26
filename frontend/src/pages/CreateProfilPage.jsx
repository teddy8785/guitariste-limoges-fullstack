import React from "react";
import CreateProfil from "../components/CreateProfil";
import { useNavigate } from "react-router-dom";

function CreateProfilPage() {
  const navigate = useNavigate();

  const handleProfilSubmit = async (formData) => {
    try {
      const response = await fetch("http://localhost:4000/api/guitaristes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de la création du profil");

      const data = await response.json();
      console.log("Profil créé avec succès :", data);

      navigate("/mon-profil"); // redirige vers ta page profil

    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Erreur lors de la création du profil");
    }
  };

  return (
    <div>
      <CreateProfil onSubmit={handleProfilSubmit} />
    </div>
  );
}
export default CreateProfilPage;
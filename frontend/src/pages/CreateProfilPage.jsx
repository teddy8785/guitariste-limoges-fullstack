import React, { useEffect, useState } from "react";
import CreateProfil from "../components/CreateProfil";
import { useNavigate, useParams } from "react-router-dom";

function CreateProfilPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // si tu veux gérer la modification avec /profil/:id
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id); // si on a un id, on charge

  useEffect(() => {
    if (id) {
      // Chargement du profil existant pour modification
      fetch(`http://localhost:4000/api/guitaristes/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Profil non trouvé");
          return res.json();
        })
        .then((data) => {
          setInitialData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setInitialData({});
          setLoading(false);
        });
    }
  }, [id]);

  const handleProfilSubmit = async (formData) => {
    try {
      const url = id
        ? `http://localhost:4000/api/guitaristes/me` // ✅ correspond bien à ta route
        : "http://localhost:4000/api/guitaristes";
      const method = id ? "PUT" : "POST";

      const dataToSend = new FormData();

      for (const key in formData) {
        if (key === "style") {
          dataToSend.append(key, formData.style); // string style
        } else if (key === "photo" && formData.photo instanceof File) {
          dataToSend.append("image", formData.photo); // pour multer côté serveur
        } else if (key === "audio" && formData.audio instanceof File) {
          dataToSend.append("audio", formData.audio);
        } else {
          dataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: dataToSend,
      });

      if (!response.ok) throw new Error("Erreur lors de l’envoi");

      const data = await response.json();
      console.log("Profil enregistré :", data);
      navigate(`/artiste/${data._id}`);
    } catch (error) {
      console.error("Erreur :", error);
      alert(error.message);
    }
  };
  if (loading) return <p>Chargement du profil...</p>;

  return (
    <div>
      <CreateProfil
        initialData={initialData || {}}
        onSubmit={handleProfilSubmit}
      />
    </div>
  );
}

export default CreateProfilPage;

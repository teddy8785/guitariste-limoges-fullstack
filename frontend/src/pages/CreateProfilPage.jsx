import { useEffect, useState } from "react";
import CreateProfil from "../components/CreateProfil";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

function CreateProfilPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(!!id); // si on a un id, on charge

  useEffect(() => {
    if (id) {
      // Chargement du profil existant pour modification
      fetch(`http://localhost:4000/api/guitaristes/id/${id}`, {
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
      const userRole = localStorage.getItem("role");
      let url;
      let method;

      if (id) {
        method = "PUT";
        if (userRole === "admin") {
          url = `http://localhost:4000/api/admin/guitaristes/id/${id}`;
        } else {
          url = `http://localhost:4000/api/guitaristes/me`;
        }
      } else {
        method = "POST";
        url = "http://localhost:4000/api/guitaristes";
      }

      const dataToSend = new FormData();

      for (const key in formData) {
        if (key === "style" && Array.isArray(formData.style)) {
          formData.style.forEach((s) => dataToSend.append("style", s));
        } else if (key === "instrument" && Array.isArray(formData.instrument)) {
          formData.instrument.forEach((i) =>
            dataToSend.append("instrument", i)
          );
        } else if (key === "photo" && formData.photo instanceof File) {
          dataToSend.append("image", formData.photo);
        } else if (key === "audio" && formData.audio instanceof File) {
          dataToSend.append("audio", formData.audio);
        } else if (key === "photoDeleted" && formData.photoDeleted === true) {
          dataToSend.append("photoDeleted", "true");
        } else if (key !== "photoDeleted") {
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
      console.log("Réponse API update :", data);

      // On retourne le slug pour la navigation côté CreateProfil
      return data.slug || initialData?.slug || null;
    } catch (error) {
      console.error("Erreur :", error);
      throw error;
    }
  };

  if (loading) return <p>Chargement du profil...</p>;

  return (
    <div>
      <CreateProfil
        initialData={initialData || {}}
        onSubmit={handleProfilSubmit}
      />
      <Footer />
    </div>
  );
}

export default CreateProfilPage;

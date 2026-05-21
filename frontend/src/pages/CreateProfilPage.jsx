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
      fetch(`${process.env.REACT_APP_API_URL}/api/guitaristes/id/${id}`, {
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
      const getRoleFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
          return JSON.parse(atob(token.split(".")[1])).role;
        } catch {
          return null;
        }
      };

      const role = getRoleFromToken();

      let url = "";
      let method = "";

      if (!id) {
        // CREATE
        url = `${process.env.REACT_APP_API_URL}/api/guitaristes`;
        method = "POST";
      } else if (role === "admin") {
        // ADMIN UPDATE
        url = `${process.env.REACT_APP_API_URL}/api/admin/guitaristes/${id}`;
        method = "PUT";
      } else {
        // USER UPDATE
        url = `${process.env.REACT_APP_API_URL}/api/guitaristes/me`;
        method = "PUT";
      }
      if (!url) {
        throw new Error("URL non définie (id ou role manquant)");
      }

      const dataToSend = new FormData();

      // TEXT FIELDS
      dataToSend.append("nom", formData.nom);
      dataToSend.append("ville", formData.ville);
      dataToSend.append("histoire", formData.histoire || "");
      dataToSend.append("mail", formData.mail || "");
      dataToSend.append("lienx", formData.lienx || "");
      dataToSend.append("lieninstagram", formData.lieninstagram || "");
      dataToSend.append("lienyoutube", formData.lienyoutube || "");
      dataToSend.append("annonce", formData.annonce || "");

      // ARRAYS
      formData.style.forEach((s) => dataToSend.append("style", s));

      formData.instrument.forEach((i) => dataToSend.append("instrument", i));

      // FILES
      if (formData.photo instanceof File) {
        dataToSend.append("image", formData.photo);
      }

      if (formData.audio instanceof File) {
        dataToSend.append("audio", formData.audio);
      }

      // FLAGS
      if (formData.photoDeleted) {
        dataToSend.append("photoDeleted", "true");
      }

      if (formData.audioDeleted) {
        dataToSend.append("audioDeleted", "true");
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

      return data.slug || initialData?.slug || null;
    } catch (error) {
      console.error(error);
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

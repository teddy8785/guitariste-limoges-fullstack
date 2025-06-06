import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/styles.scss";
import Index from "./pages/Index";
import Presentation from "./pages/Presentation.jsx";
import Inscription from "./pages/Inscription.jsx";
import Connexion from "./pages/Connexion.jsx";
import CreateProfil from "./pages/CreateProfilPage.jsx";
import Erreur from "./pages/Erreur.jsx";
import Artistes from "./pages/Artistes.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import Confidentialite from "./pages/Confidentialite.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
     <BrowserRouter basename="/guitaristes-limoges">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Artistes />} />
        <Route path="/artiste/:slug" element={<Presentation />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/profil" element={<CreateProfil />} />
        <Route path="/profil/:id?" element={<CreateProfil />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/erreur" element={<Erreur />} />
        <Route path="*" element={<Erreur />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

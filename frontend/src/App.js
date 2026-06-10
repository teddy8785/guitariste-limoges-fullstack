import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Presentation from "./pages/Presentation.jsx";
import Inscription from "./pages/Inscription.jsx";
import Connexion from "./pages/Connexion.jsx";
import CreateProfil from "./pages/CreateProfilPage.jsx";
import Erreur from "./pages/Erreur.jsx";
import Artistes from "./pages/Artistes.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import Confidentialite from "./pages/Confidentialite.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Artistes />} />
        <Route path="/artiste/:slug" element={<Presentation />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profil" element={<CreateProfil />} />
        <Route path="/profil/:id?" element={<CreateProfil />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/erreur" element={<Erreur />} />
        <Route path="*" element={<Erreur />} />
      </Routes>
    </BrowserRouter>
  );
}

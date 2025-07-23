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

// Redux
import { Provider } from "react-redux";
import store from './Store/index.js';
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Générer visitor_key si pas présent
if (!localStorage.getItem("visitor_key")) {
  localStorage.setItem("visitor_key", generateUUID());
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
     <BrowserRouter basename="/guitaristes-limoges">
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
        <Route path="/erreur" element={<Erreur />} />
        <Route path="*" element={<Erreur />} />
      </Routes>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
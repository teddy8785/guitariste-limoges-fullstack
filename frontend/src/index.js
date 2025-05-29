import React from "react";
import ReactDOM from "react-dom/client";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import './styles/styles.scss';
import Index from "./pages/Index";
import Presentation from "./pages/Presentation.jsx";
import Inscription from "./pages/Inscription.jsx";
import Connexion from "./pages/Connexion.jsx";
import CreateProfil from "./pages/CreateProfilPage.jsx";
import Erreur from "./pages/Erreur.jsx";
import Artistes from "./pages/Artistes.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/index" />} />
        <Route path="/index" element={<Index />} />
        <Route path="/gallery" element={<Artistes />} />
        <Route path="/artiste/:id" element={<Presentation />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/profil" element={<CreateProfil />} />
        <Route path="/profil/:id?" element={<CreateProfil />} />
        <Route path="/erreur" element={<Erreur />} />
        <Route path="*" element={<Erreur />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

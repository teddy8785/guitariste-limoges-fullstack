import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.scss";

import { Provider } from "react-redux";
import store from "./Store/index.js";

import App from "./App.js";
import AuthBootstrap from "./AuthBootstrap.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

if (!localStorage.getItem("visitor_key")) {
  localStorage.setItem("visitor_key", generateUUID());
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthBootstrap />
      <App />
    </Provider>
  </React.StrictMode>
);
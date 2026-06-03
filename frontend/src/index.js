import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/styles.scss";

import { Provider } from "react-redux";
import store from "./Store/index.js";

import App from "./App.js";
import AuthBootstrap from "./AuthBootstrap.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthBootstrap />
      <App />
    </Provider>
  </React.StrictMode>
);
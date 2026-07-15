import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { ManagerAuthProvider } from "./context/ManagerAuthContext";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ManagerAuthProvider>
          <Toaster position="top-right" />
          <App />
        </ManagerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Web3Provider } from './context/Web3Context.jsx';
// import {BrowserRouter} from 'react-router-dom';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3Provider>
     
      <App />
     
    </Web3Provider>
  </StrictMode>
);

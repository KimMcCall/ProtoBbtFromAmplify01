import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";
import "./index.css";
import App from "./App.tsx";

Amplify.configure(outputs);

export const dbClient = generateClient<Schema>();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

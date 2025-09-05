import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvideer } from 'react-redux'
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";
import App from "./App";
import { store } from './app/store'

import "./index.css";

Amplify.configure(outputs);

export const dbClient = generateClient<Schema>();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvideer store={store}>
      <App />
    </ReduxProvideer>
  </React.StrictMode>
);

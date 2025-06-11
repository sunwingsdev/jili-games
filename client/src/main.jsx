import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/Router";
import { PhotoProvider } from "react-photo-view";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PhotoProvider>
      <Provider store={store}>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </Provider>
    </PhotoProvider>
  </React.StrictMode>
);

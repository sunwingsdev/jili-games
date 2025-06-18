import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/Router";
import { PhotoProvider } from "react-photo-view";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store";
import ModalProvider from "./providers/ModalProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <PhotoProvider>
        <Provider store={store}>
          <Toaster position="top-right" reverseOrder={false} />
          <RouterProvider router={router} />
        </Provider>
      </PhotoProvider>
    </ModalProvider>
  </React.StrictMode>
);

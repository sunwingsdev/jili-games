import { createContext, useState } from "react";

export const ModalContext = createContext(null);

const ModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  const modalInfo = {
    isLoginModalOpen,
    setIsLoginModalOpen,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    isPromoModalOpen,
    setIsPromoModalOpen,
  };
  return (
    <ModalContext.Provider value={modalInfo}>{children}</ModalContext.Provider>
  );
};

export default ModalProvider;

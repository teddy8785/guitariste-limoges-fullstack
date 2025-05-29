import { useEffect, useState } from "react";

function StatusIndicator() {
  const [isConnected, setIsConnected] = useState(false);

  const checkToken = () => {
    const token = localStorage.getItem("token");
    setIsConnected(!!token);
  };

  useEffect(() => {
    checkToken();

    const onLogout = () => {
      setIsConnected(false);
    };

    window.addEventListener("logout", onLogout);

    // Nettoyage de l’event listener au démontage
    return () => {
      window.removeEventListener("logout", onLogout);
    };
  }, []);

  return (
    <span
      className={` header__status ${
        isConnected ? "header__status--connected" : ""
      }`}
    ></span>
  );
}

export default StatusIndicator;

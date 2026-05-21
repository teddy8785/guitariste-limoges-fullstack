import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./Store/authSlice";

function AuthBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        dispatch(
          login({
            token,
            userId: payload.userId,
            role: payload.role,
          })
        );
      } catch (err) {
        console.error("Token invalide", err);
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return null;
}

export default AuthBootstrap;
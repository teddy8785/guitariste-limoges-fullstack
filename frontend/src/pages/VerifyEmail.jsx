import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { login } from "../Store/authSlice";
import { useDispatch } from "react-redux";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading");

  const called = useRef(false);

  useEffect(() => {
    if (!token) return;

    if (called.current) return;
    called.current = true;

    fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-email/${token}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        return data;
      })
      .then((data) => {
        setStatus("success");

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.role);

        dispatch(login(data));

        setTimeout(() => {
          navigate("/connexion");
        }, 1500);
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "white" }}>
      {status === "loading" && <h2>Vérification en cours...</h2>}
      {status === "success" && <h2>Compte activé ✔ Redirection...</h2>}
      {status === "error" && <h2>❌ Lien invalide ou expiré</h2>}
    </div>
  );
}

export default VerifyEmail;

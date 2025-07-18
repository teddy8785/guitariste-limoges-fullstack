import { useSelector } from "react-redux";

function StatusIndicator() {
  const token = useSelector((state) => state.auth.token);

  return (
    <span
      className={` header__status ${token ? "header__status--connected" : ""}`}
    ></span>
  );
}

export default StatusIndicator;

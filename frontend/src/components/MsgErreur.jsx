import { NavLink } from "react-router-dom";

function MsgErreur() {
  return (
    <div className="header">
      <NavLink to="/" className="header__button">
        Retour
      </NavLink>
    </div>
  );
}

export default MsgErreur;

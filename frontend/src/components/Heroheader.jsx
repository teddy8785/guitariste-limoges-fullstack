import { NavLink } from "react-router-dom";

function Heroheader({ nom, isLogged }) {
  return (
    <section className="heroheader">
      <h2 className="heroheader__title">
        BIENVENUE{" "}

        {isLogged ? (
          nom ? (
            <span>{nom}</span>
          ) : (
            <span className="heroheader__hint">
              Complétez votre profil pour apparaître sur le site{" "}
              <NavLink className="heroheader__hint--color" to="/profil">
                Créer son profil
              </NavLink>
            </span>
          )
        ) : null}
      </h2>

      <p className="heroheader__welcome">
        Venez voir les musiciens de France : découvrir leurs histoires, leurs photos et leurs extraits sonores.
      </p>
    </section>
  );
}

export default Heroheader;
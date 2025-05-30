import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__mentions">
        <div className="footer__links--content">
          <NavLink to={`/mentions-legales`} className="footer__link">
            Mentions légales
          </NavLink>
          <NavLink to={`/confidentialite`} className="footer__link">
            Politique de confidentialité
          </NavLink>
        </div>
      </div>
      <p className="footer__copyright">&copy; 2024 - Guitaristes Limoges</p>
    </footer>
  );
}

export default Footer;

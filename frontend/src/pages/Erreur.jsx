import Header from "../components/Header";
import MsgErreur from "../components/MsgErreur";

function Erreur() {
  return (
    <div>
      <MsgErreur />
      <Header>
        <h1 className="header__title">Cette page n'existe pas</h1>
      </Header>
    </div>
  );
}

export default Erreur;

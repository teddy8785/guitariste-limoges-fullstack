function confidentialite() {
  return (
    <div className="footer__copyright p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Conditions Générales d’Utilisation</h1>

      <p className="mb-4">
        Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet de définir les règles d’utilisation du site
        www.guitaristes-limoges.fr. En naviguant sur le site ou en créant un profil, vous acceptez ces conditions.
      </p>

      <h2 className="text-xl font-semibold mt-4">1. Objet du site</h2>
      <p>
        Le site a pour but de rassembler des musiciens autour de Limoges, de partager des informations, des profils d’artistes,
        et de promouvoir la musique locale. Il ne s’agit pas d’un service commercial.
      </p>

      <h2 className="text-xl font-semibold mt-4">2. Création de profil</h2>
      <p>
        Les musiciens peuvent créer un profil en fournissant des informations telles que nom, style musical, bio, et liens vers
        des contenus externes. Ces profils sont visibles publiquement.
      </p>
      <p>
        Vous vous engagez à ne pas publier de contenus inappropriés, diffamatoires, ou portant atteinte aux droits d’autrui.
      </p>

      <h2 className="text-xl font-semibold mt-4">3. Données personnelles</h2>
      <p>
        Les données personnelles collectées lors de la création d’un profil sont traitées conformément à notre
        <a href="/confidentialite" className="underline ml-1">politique de confidentialité</a>.
        Chaque utilisateur peut demander à modifier ou supprimer ses données en écrivant à : contact@guitaristes-limoges.fr
      </p>

      <h2 className="text-xl font-semibold mt-4">4. Responsabilités</h2>
      <p>
        L’association ne peut être tenue responsable des contenus publiés par les utilisateurs. Tout abus peut être signalé à
        l’adresse e-mail mentionnée ci-dessus.
      </p>

      <h2 className="text-xl font-semibold mt-4">5. Modération</h2>
      <p>
        L’équipe se réserve le droit de supprimer tout contenu non conforme ou de désactiver un profil sans préavis
        en cas de non-respect de ces conditions.
      </p>

      <h2 className="text-xl font-semibold mt-4">6. Modifications</h2>
      <p>
        Ces conditions peuvent être mises à jour à tout moment. Les utilisateurs seront informés en cas de changement majeur.
      </p>
    </div>
  );
}

export default confidentialite;
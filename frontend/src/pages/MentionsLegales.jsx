function MentionsLegales() {
  return (
    <main className="footer__copyright">
      <h1>Mentions Légales</h1>

      <section>
        <h2>1. Éditeur du site</h2>
        <p>
          <strong>Nom du site :</strong> Guitaristes Limoges
        </p>
        <p>
          <strong>Responsable de la publication :</strong> Teddy BARIERAUD
        </p>
        <p>
          <strong>Statut :</strong> Particulier
        </p>
        <p>
          <strong>Email :</strong> projetWebT@gmail.com
        </p>
      </section>

      <section>
        <h2>2. Hébergement</h2>

        <p>
          <strong>Hébergeur front-end :</strong> Vercel
        </p>

        <p>
          <strong>Hébergeur backend :</strong> Render
        </p>

        <p>
          <strong>Base de données :</strong> MongoDB Atlas
        </p>

        <p>
          <strong>Site web :</strong>{" "}
          <a
            href="https://guitariste-limoges-fullstack.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            guitariste-limoges-fullstack.vercel.app
          </a>
        </p>
      </section>

      <section>
        <h2>3. Objet du site</h2>
        <p>
          Ce site permet aux musiciens de créer un profil, publier une photo,
          ajouter des extraits audio, partager leurs réseaux sociaux et de
          diffuser des annonces.
        </p>
      </section>

      <section>
        <h2>4. Données personnelles</h2>
        <p>
          Les données collectées (profil, email, photo, audio, liens) servent
          uniquement au fonctionnement du site.
        </p>
        <p>
          Conformément au RGPD, vous pouvez demander la suppression de votre
          compte en envoyant un email à : <strong>projetWebT@gmail.com</strong>
        </p>
      </section>

      <section>
        <h2>5. Contenu utilisateur</h2>
        <p>
          Les utilisateurs sont responsables des contenus qu’ils publient
          (photos, audio, textes, liens).
        </p>
        <ul>
          <li>Contenus illégaux interdits</li>
          <li>Contenus haineux ou violents interdits</li>
          <li>Respect des droits d’auteur obligatoire</li>
        </ul>
      </section>

      <section>
        <h2>6. Propriété intellectuelle</h2>
        <p>
          Le code et le design du site appartiennent à l’éditeur. Les musiciens
          restent propriétaires de leurs contenus.
        </p>
      </section>

      <section>
        <h2>7. Cookies</h2>
        <p>
          Le site utilise uniquement des cookies techniques nécessaires au bon
          fonctionnement (connexion, session utilisateur).
        </p>
      </section>

      <section>
        <h2>8. Responsabilité</h2>
        <p>
          L’éditeur ne peut être tenu responsable des contenus publiés par les
          utilisateurs ou des éventuelles interruptions du service.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>Email : projetWebT@gmail.com</p>
      </section>
    </main>
  );
}

export default MentionsLegales;

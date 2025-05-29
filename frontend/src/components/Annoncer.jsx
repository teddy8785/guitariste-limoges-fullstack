function Annoncer() {
 
  return (
   <section>
     {/* <h2 className="main__title">NOUVEAUX</h2>
          <div className="main__gallery">
            {guitaristes
              .slice(-maxCards)
              .reverse()
              .map((post) => (
                <Card
                  key={post._id}
                  id={post._id}
                  nom={post.nom}
                  photo={post.photo}
                  photoDown={post.photoDown}
                  audio={post.audio}
                  annonce={post.annonce}
                />
              ))}
          </div> */}
   </section>
  );
}

export default Annoncer;

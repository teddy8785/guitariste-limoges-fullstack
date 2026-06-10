import Card from "../Card";

function MemberSilver({ members = [], loading, likesState, role, onVipChange  }) {
  return (
    <section id="annonce">
      <h2 className="main__title">Membres VIP 🥈</h2>

      <div className={`main__new ${loading ? "is-loading" : ""}`}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="main__skeleton--card">
                <div className="main__skeleton--img" />
                <div className="main__skeleton--name" />
                <div className="main__skeleton--line" />
              </div>
            ))
          : members
              .slice(0, 4)
              .map((post) => (
                <Card
                  key={post._id}
                  itemId={post._id}
                  slug={post.slug}
                  nom={post.nom}
                  photo={post.photo}
                  photoDown={post.photoDown}
                  audio={post.audio}
                  annonce={post.annonce}
                  profileId={post._id}
                  type="like"
                  likeInfo={
                    likesState?.[post._id] || { liked: false, count: 0 }
                  }
                  vip={post.vip}
                  isAdmin={role === "admin"}
                  onVipChange={onVipChange}
                />
              ))}
      </div>
    </section>
  );
}

export default MemberSilver;

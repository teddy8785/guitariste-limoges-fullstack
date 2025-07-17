import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Card from "./Card";
import { Link } from "react-router-dom"; // Assure-toi que react-router-dom est utilisé

function Heroheader() {
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const [reportedProfiles, setReportedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:4000/api/report/admin/reported-profiles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          setReportedProfiles([]);
          console.error("Erreur HTTP", res.status);
        } else {
          const data = await res.json();
          setReportedProfiles(data);
        }
      } catch (err) {
        console.error("Erreur fetch profils signalés", err);
        setReportedProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    if (role === "admin" && token) {
      fetchReports();
    } else {
      setReportedProfiles([]);
    }
  }, [role, token]);

  if (role === "admin" && token) {
    if (loading) return <p>Chargement des profils signalés...</p>;

    return (
      <section className="heroheader">
        <h2 className="heroheader__title">
          Profils signalés ({reportedProfiles.length})
        </h2>

        <Link
          to={{
            pathname: "/gallery",
            search: "?onlyReported=true",
          }}
          className="heroheader__link"
          aria-label="Voir tous les profils signalés"
        >
          Voir tous les profils signalés
        </Link>

        <div className="main__new">
          {reportedProfiles.length === 0 ? (
            <p className="main__empty">Aucun profil signalé actuellement.</p>
          ) : (
            reportedProfiles
              .slice(0, 5)
              .map((profile) => (
                <Card
                  key={profile._id}
                  itemId={profile._id}
                  slug={profile.slug}
                  nom={profile.nom}
                  photo={profile.photo}
                  photoDown={profile.photoDown}
                  audio={profile.audio}
                  profileId={profile._id}
                  type="profile"
                />
              ))
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="heroheader">
      <h2 className="heroheader__title">BIENVENUE</h2>
      <p className="heroheader__welcome">
        Venez voir les musiciens de France : découvrir leurs histoires, leurs
        photos et, grâce aux extraits sonores, mettez un son sur chaque visage.
      </p>
    </section>
  );
}

export default Heroheader;

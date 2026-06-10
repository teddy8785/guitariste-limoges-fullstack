import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "../Card";
import { Link } from "react-router-dom";

function ReportedProfiles() {
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);

  const [reportedProfiles, setReportedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role !== "admin" || !token) return;

    const fetchReports = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/report/admin/reported-profiles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await res.json();
        setReportedProfiles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [role, token]);

  if (role !== "admin") return null;
  if (loading) return <p>Chargement...</p>;

  return (
    <section className="heroheader">
      <h2>Profils signalés ({reportedProfiles.length})</h2>

      <Link to="/gallery?onlyReported=true" className="heroheader__link">
        Voir tous les profils signalés →
      </Link>
      <Link to="/gallery" className="heroheader__link">
        Voir tous les profils →
      </Link>
      <div className="main__new">
        {reportedProfiles.length === 0 ? (
          <p>Aucun profil signalé</p>
        ) : (
          reportedProfiles
            .slice(0, 5)
            .map((profile) => <Card key={profile._id} {...profile} />)
        )}
      </div>
    </section>
  );
}

export default ReportedProfiles;

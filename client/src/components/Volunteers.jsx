import { useEffect, useState } from "react";
import {
  getVolunteers,
  addVolunteer
} from "../services/api";

function Volunteers({ token }) {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchVolunteers = async () => {
    try {
      const data = await getVolunteers(token);
      setVolunteers(data);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addVolunteer(
        {
          name,
          email,
          phone,
          skills: ["Teaching"],
          availability: "Weekends"
        },
        token
      );

      setMessage("Volunteer added successfully");
      setIsError(false);

      setName("");
      setEmail("");
      setPhone("");

      fetchVolunteers();
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>Add Volunteer</h2>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add Volunteer"}
        </button>
      </form>

      {message && (
        <p className={`message ${isError ? "is-error" : ""}`}>{message}</p>
      )}

      <hr />

      <div className="section-header">
        <h2>Volunteers</h2>
        {!loading && volunteers.length > 0 && (
          <span className="count-pill">{volunteers.length} total</span>
        )}
      </div>

      {loading ? (
        <p className="loading-state">Loading volunteers…</p>
      ) : volunteers.length === 0 ? (
        <div className="empty-state">
          <strong>No volunteers yet</strong>
          Add your first volunteer using the form above.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer._id}>
                  <td className="cell-primary">{volunteer.name}</td>
                  <td>
                    {volunteer.email}
                    <br />
                    <span className="cell-muted">{volunteer.phone}</span>
                  </td>
                  <td>
                    {Array.isArray(volunteer.skills)
                      ? volunteer.skills.join(", ")
                      : volunteer.skills || "—"}
                  </td>
                  <td>{volunteer.availability || "—"}</td>
                  <td>
                    <span className="badge badge-green">
                      <span className="badge-dot"></span>
                      {volunteer.status || "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Volunteers;
import { useEffect, useState } from "react";
import {
  getAssignments,
  createAssignment
} from "../services/api";

function statusBadgeClass(status) {
  if (status === "completed") return "badge-gray";
  if (status === "cancelled") return "badge-amber";
  return "badge-green"; // assigned / default
}

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function Assignments({ token, volunteers, activities }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [volunteer, setVolunteer] = useState("");
  const [activity, setActivity] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    try {
      const data = await getAssignments(token);
      setAssignments(data);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!volunteer || !activity) {
      setMessage("Please select a volunteer and activity");
      setIsError(true);
      return;
    }

    setSubmitting(true);

    try {
      await createAssignment(
        {
          volunteer,
          activity,
          status: "assigned"
        },
        token
      );

      setMessage("Assignment created successfully");
      setIsError(false);

      setVolunteer("");
      setActivity("");

      fetchAssignments();
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
        <h2>Create Assignment</h2>
      </div>

      <form className="assignment-form" onSubmit={handleSubmit}>
        <div className="assignment-field">
          <label>Volunteer</label>
          <select
            value={volunteer}
            onChange={(e) => setVolunteer(e.target.value)}
          >
            <option value="">Select volunteer</option>
            {volunteers.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="assignment-field">
          <label>Activity</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="">Select activity</option>
            {activities.map((item) => (
              <option key={item._id} value={item._id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating…" : "Create Assignment"}
        </button>
      </form>

      {message && (
        <p className={`message ${isError ? "is-error" : ""}`}>{message}</p>
      )}

      <hr />

      <div className="section-header">
        <h2>Assignments</h2>
        {!loading && assignments.length > 0 && (
          <span className="count-pill">{assignments.length} total</span>
        )}
      </div>

      {loading ? (
        <p className="loading-state">Loading assignments…</p>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          <strong>No assignments yet</strong>
          Create one using the form above.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Activity</th>
                <th>Status</th>
                <th>Assigned</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id}>
                  <td className="cell-primary">
                    {assignment.volunteer?.name || "Unknown"}
                  </td>
                  <td>{assignment.activity?.title || "Unknown"}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass(assignment.status)}`}>
                      <span className="badge-dot"></span>
                      {assignment.status}
                    </span>
                  </td>
                  <td className="cell-muted">
                    {formatDate(assignment.createdAt) || "—"}
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

export default Assignments;
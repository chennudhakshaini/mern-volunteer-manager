import { useEffect, useState } from "react";
import {
  getActivities,
  addActivity
} from "../services/api";

function statusBadgeClass(status) {
  if (status === "completed") return "badge-gray";
  if (status === "ongoing") return "badge-amber";
  return "badge-green"; // upcoming / default
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function Activities({ token }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = async () => {
    try {
      const data = await getActivities(token);
      setActivities(data);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addActivity(
        {
          title,
          type,
          date,
          location,
          description,
          status: "upcoming"
        },
        token
      );

      setMessage("Activity added successfully");
      setIsError(false);

      setTitle("");
      setType("");
      setDate("");
      setLocation("");
      setDescription("");

      fetchActivities();
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
        <h2>Add Activity</h2>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Activity title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Activity type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add Activity"}
        </button>
      </form>

      {message && (
        <p className={`message ${isError ? "is-error" : ""}`}>{message}</p>
      )}

      <hr />

      <div className="section-header">
        <h2>Activities</h2>
        {!loading && activities.length > 0 && (
          <span className="count-pill">{activities.length} total</span>
        )}
      </div>

      {loading ? (
        <p className="loading-state">Loading activities…</p>
      ) : activities.length === 0 ? (
        <div className="empty-state">
          <strong>No activities yet</strong>
          Add your first activity using the form above.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td className="cell-primary">
                    {activity.title}
                    {activity.description && (
                      <>
                        <br />
                        <span className="cell-muted">{activity.description}</span>
                      </>
                    )}
                  </td>
                  <td>{activity.type}</td>
                  <td>{formatDate(activity.date)}</td>
                  <td>{activity.location}</td>
                  <td>
                    <span className={`badge ${statusBadgeClass(activity.status)}`}>
                      <span className="badge-dot"></span>
                      {activity.status}
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

export default Activities;
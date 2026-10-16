import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Auth from "./Auth";

const emptyForm = {
  title: "",
  category: "Academic",
  description: "",
};

function App() {
  // Logged-in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem("campuscareToken");
      const user = localStorage.getItem("campuscareUser");

      return token && user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  // Dashboard states
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Login success
  function handleLogin(user) {
    setCurrentUser(user);
    setMessage("");
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("campuscareToken");
    localStorage.removeItem("campuscareUser");

    setCurrentUser(null);
    setComplaints([]);
    setForm(emptyForm);
    setMessage("");
  }

  // Load complaints from backend
  async function loadComplaints() {
    setLoading(true);

    try {
      const response = await fetch("/api/complaints");

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setComplaints(
        Array.isArray(data) ? data : data.complaints || []
      );

      setMessage("");
    } catch (error) {
      console.error("Load complaints error:", error);

      setMessage(
        `Failed to load complaints: ${error.message}. Check your backend and Vite proxy.`
      );
    } finally {
      setLoading(false);
    }
  }

  // Load complaints after login
  useEffect(() => {
    if (currentUser) {
      loadComplaints();
    }
  }, [currentUser]);

  // Dashboard statistics
  const stats = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter(
        (complaint) => complaint.status === "Pending"
      ).length,
      progress: complaints.filter(
        (complaint) => complaint.status === "In Progress"
      ).length,
      resolved: complaints.filter(
        (complaint) => complaint.status === "Resolved"
      ).length,
    }),
    [complaints]
  );

  // Search and status filter
  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const text = `
        ${complaint.title || ""}
        ${complaint.category || ""}
        ${complaint.description || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesStatus =
        filter === "All" || complaint.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, filter]);

  // Submit a complaint
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          description: form.description.trim(),
          status: "Pending",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      setForm(emptyForm);
      setMessage("Your complaint was submitted successfully!");

      await loadComplaints();
    } catch (error) {
      console.error("Submit complaint error:", error);

      setMessage(
        `Could not submit complaint: ${error.message}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Update complaint status
  async function updateStatus(complaint, status) {
    try {
      const response = await fetch(
        `/api/complaints/${complaint._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      setMessage("Complaint status updated successfully.");

      await loadComplaints();
    } catch (error) {
      console.error("Update status error:", error);

      setMessage(
        `Failed to update complaint status: ${error.message}`
      );
    }
  }

  // Delete a complaint
  async function deleteComplaint(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/complaints/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      setComplaints((previous) =>
        previous.filter((complaint) => complaint._id !== id)
      );

      setMessage("Complaint deleted successfully.");
    } catch (error) {
      console.error("Delete complaint error:", error);

      setMessage(
        `Unable to delete complaint: ${error.message}`
      );
    }
  }

  // Format date
  function dateText(value) {
    if (!value) return "Date not available";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Date not available"
      : date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  }

  // Login page
  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  // Dashboard
  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">✦</span>
          Campus<span className="brand-highlight">Care</span>
        </a>

        <p className="menu-label">WORKSPACE</p>

        <nav className="side-nav">
          <a className="side-link active" href="#dashboard">
            <span>▦</span> Dashboard
          </a>

          <a className="side-link" href="#submit">
            <span>＋</span> New Complaint
          </a>

          <a className="side-link" href="#complaints">
            <span>☷</span> All Complaints
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-icon">💬</div>
          <h3>Need assistance?</h3>
          <p>
            Submit your issue and track its progress here.
          </p>
          <a href="#submit" className="help-link">
            Submit an issue ↗
          </a>
        </div>

        <div className="sidebar-footer">
          <span className="online-dot" />
          CampusCare Portal
          <span className="footer-version">v1.0</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Overview</p>
            <h1>Complaint Dashboard</h1>

            <p className="welcome-text">
              Welcome back, {currentUser.name || "User"}! Let's make your
              campus better.
            </p>

            <p className="welcome-text">
              {currentUser.role === "staff"
                ? "Staff Account"
                : "Student Account"}
            </p>
          </div>

          <div className="topbar-actions">
            <a href="#submit" className="topbar-button">
              <span>＋</span> New Complaint
            </a>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Message banner */}
        {message && (
          <div className="message-banner" role="status">
            <span>{message}</span>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics */}
        <section id="dashboard" className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Your Overview</h2>
              <p>Here's what's happening with your complaints.</p>
            </div>

            <span className="live-pill">
              <span className="online-dot" /> Live overview
            </span>
          </div>

          <div className="stats-grid">
            <article className="stat-card stat-purple">
              <div className="stat-top">
                <span className="stat-icon">▤</span>
                <span className="stat-tag">All time</span>
              </div>
              <p>Total Complaints</p>
              <h3>{stats.total}</h3>
              <div className="stat-bottom">
                All submitted issues
              </div>
            </article>

            <article className="stat-card stat-orange">
              <div className="stat-top">
                <span className="stat-icon">◷</span>
                <span className="stat-tag">Waiting</span>
              </div>
              <p>Pending</p>
              <h3>{stats.pending}</h3>
              <div className="stat-bottom">
                Awaiting attention
              </div>
            </article>

            <article className="stat-card stat-blue">
              <div className="stat-top">
                <span className="stat-icon">⟳</span>
                <span className="stat-tag">Ongoing</span>
              </div>
              <p>In Progress</p>
              <h3>{stats.progress}</h3>
              <div className="stat-bottom">
                Currently being handled
              </div>
            </article>

            <article className="stat-card stat-green">
              <div className="stat-top">
                <span className="stat-icon">✓</span>
                <span className="stat-tag">Completed</span>
              </div>
              <p>Resolved</p>
              <h3>{stats.resolved}</h3>
              <div className="stat-bottom">
                Issues successfully resolved
              </div>
            </article>
          </div>
        </section>

        {/* Submit complaint */}
        <section
          id="submit"
          className="content-panel submit-panel"
        >
          <div className="panel-heading">
            <div className="heading-icon">✎</div>
            <div>
              <h2>Submit a Complaint</h2>
              <p>Tell us about the issue you are facing.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="title">Complaint Title *</label>

                <input
                  id="title"
                  required
                  maxLength={120}
                  placeholder="e.g. Projector not working"
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">
                  Department / Category *
                </label>

                <select
                  id="category"
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category: event.target.value,
                    })
                  }
                >
                  <option>Academic</option>
                  <option>Infrastructure</option>
                  <option>Hostel</option>
                  <option>Library</option>
                  <option>Computer Lab</option>
                  <option>Cleanliness</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-field full-field">
                <label htmlFor="description">
                  Describe the Issue *
                </label>

                <textarea
                  id="description"
                  required
                  minLength={5}
                  maxLength={2000}
                  placeholder="Explain the problem and where it happened..."
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                />

                <span className="field-hint">
                  Please provide enough details to help us resolve your issue.
                </span>
              </div>
            </div>

            <div className="form-footer">
              <span className="required-note">
                * Required fields
              </span>

              <button
                className="primary-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
                <span>→</span>
              </button>
            </div>
          </form>
        </section>

        {/* Complaint list */}
        <section
          id="complaints"
          className="content-panel complaints-panel"
        >
          <div className="panel-heading complaints-heading">
            <div>
              <h2>Recent Complaints</h2>
              <p>View and manage your submitted complaints.</p>
            </div>

            <span className="count-pill">
              {filteredComplaints.length} items
            </span>
          </div>

          {/* Search and filter */}
          <div className="toolbar">
            <div className="search-wrapper">
              <span>⌕</span>

              <input
                aria-label="Search complaints"
                placeholder="Search complaints..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              className="filter-select"
              aria-label="Filter by status"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="empty-state">
              <div className="empty-symbol">◌</div>
              <h3>Loading complaints...</h3>
              <p>Please wait while we retrieve your data.</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-symbol">☷</div>
              <h3>No complaints found</h3>
              <p>
                Try another search or submit your first complaint.
              </p>

              <a href="#submit" className="text-link">
                Create a complaint →
              </a>
            </div>
          ) : (
            <div className="complaint-list">
              {filteredComplaints.map((complaint) => {
                const status = complaint.status || "Pending";

                const statusClass = status
                  .toLowerCase()
                  .replace(/\s+/g, "-");

                return (
                  <article
                    className="complaint-card"
                    key={complaint._id}
                  >
                    <div className="complaint-card-top">
                      <div className="complaint-title-wrap">
                        <div className="complaint-symbol">▤</div>

                        <div>
                          <h3>{complaint.title}</h3>

                          <p className="complaint-category">
                            {complaint.category || "General"}
                            <span>•</span>
                            {dateText(
                              complaint.createdAt || complaint.date
                            )}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`status-badge ${statusClass}`}
                      >
                        <span className="status-dot" />
                        {status}
                      </span>
                    </div>

                    <p className="complaint-description">
                      {complaint.description}
                    </p>

                    <div className="complaint-card-footer">
                      <label className="status-control">
                        <span>Update status</span>

                        <select
                          aria-label={`Update status for ${complaint.title}`}
                          value={status}
                          onChange={(event) =>
                            updateStatus(
                              complaint,
                              event.target.value
                            )
                          }
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                      </label>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          deleteComplaint(complaint._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="main-footer">
          <span>
            © {new Date().getFullYear()} CampusCare
          </span>

          <span>
            Made for a better campus{" "}
            <span className="heart">♥</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
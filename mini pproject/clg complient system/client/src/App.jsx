
import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Auth from "./Auth";

const emptyForm = {
  title: "",
  category: "Academic",
  description: "",
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return localStorage.getItem("campuscareToken") &&
        localStorage.getItem("campuscareUser")
        ? JSON.parse(localStorage.getItem("campuscareUser"))
        : null;
    } catch {
      return null;
    }
  });

  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");

  async function loadComplaints() {
    try {
      const res = await fetch("/api/complaints");
      if (!res.ok) throw new Error("Failed to load complaints");
      setComplaints(await res.json());
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    if (currentUser) loadComplaints();
  }, [currentUser]);

  function logout() {
    localStorage.removeItem("campuscareToken");
    localStorage.removeItem("campuscareUser");
    setCurrentUser(null);
    setComplaints([]);
  }

  async function submitComplaint(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "Pending" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setForm(emptyForm);
      setMessage("Complaint submitted successfully!");
      await loadComplaints();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Status update failed");
      await loadComplaints();
      setMessage("Status updated!");
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function deleteComplaint(id) {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setComplaints((items) => items.filter((c) => c._id !== id));
      setMessage("Complaint deleted.");
    } catch (err) {
      setMessage(err.message);
    }
  }

  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    progress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  }), [complaints]);

  const filtered = complaints.filter(c =>
    `${c.title} ${c.category} ${c.description}`
      .toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || c.status === filter)
  );

  if (!currentUser) return <Auth onLogin={setCurrentUser} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>CampusCare</h2>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#submit">New Complaint</a>
          <a href="#complaints">All Complaints</a>
        </nav>
        <button onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <header>
          <h1>Complaint Dashboard</h1>
          <p>Welcome, {currentUser.name || "User"}!</p>
        </header>

        {message && (
          <p role="status">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </p>
        )}

        <section id="dashboard" className="stats-grid">
          <article className="stat-card">
            <h3>Total Complaints</h3><p>{stats.total}</p>
          </article>
          <article className="stat-card">
            <h3>Pending</h3><p>{stats.pending}</p>
          </article>
          <article className="stat-card">
            <h3>In Progress</h3><p>{stats.progress}</p>
          </article>
          <article className="stat-card">
            <h3>Resolved</h3><p>{stats.resolved}</p>
          </article>
        </section>

        <section id="submit" className="content-panel">
          <h2>Submit a Complaint</h2>
          <form onSubmit={submitComplaint}>
            <input
              required maxLength={120} placeholder="Complaint title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {["Academic", "Infrastructure", "Hostel", "Library",
                "Computer Lab", "Cleanliness", "Other"].map(category =>
                <option key={category}>{category}</option>
              )}
            </select>
            <textarea
              required minLength={5} maxLength={2000}
              placeholder="Describe the issue"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <button type="submit">Submit Complaint</button>
          </form>
        </section>

        <section id="complaints" className="content-panel">
          <h2>All Complaints</h2>
          <input
            placeholder="Search complaints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            {["All", "Pending", "In Progress", "Resolved"].map(s =>
              <option key={s}>{s}</option>
            )}
          </select>

          {filtered.map(c => (
            <article className="complaint-card" key={c._id}>
              <h3>{c.title}</h3>
              <p>{c.category} — {c.status}</p>
              <p>{c.description}</p>
              <select value={c.status}
                onChange={e => updateStatus(c._id, e.target.value)}>
                {["Pending", "In Progress", "Resolved"].map(s =>
                  <option key={s}>{s}</option>
                )}
              </select>
              <button onClick={() => deleteComplaint(c._id)}>Delete</button>
            </article>
          ))}
          {filtered.length === 0 && <p>No complaints found.</p>}
        </section>
      </main>
    </div>
  );
}

export default App;

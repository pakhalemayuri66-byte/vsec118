import { useEffect, useState } from "react";
import "./App.css"

const API_URL = "http://localhost:3000/api/books";

const genres = [
  "Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Fantasy",
  "Other",
];

const emptyForm = {
  title: "",
  author: "",
  genre: "Fiction",
  quantity: "",
};

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totalCopies = books.reduce(
    (sum, book) => sum + Number(book.quantity || 0),
    0
  );

  const availableCopies = books.reduce(
    (sum, book) => sum + Number(book.available || 0),
    0
  );

  const unavailableCopies = books.reduce(
    (sum, book) =>
      sum +
      Math.max(
        0,
        Number(book.quantity || 0) - Number(book.available || 0)
      ),
    0
  );

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

  async function fetchBooks() {
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load books.");
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError(
        "Cannot connect to the backend. Make sure your server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const quantity = Number(form.quantity);

    if (
      !form.title.trim() ||
      !form.author.trim() ||
      !genres.includes(form.genre) ||
      form.quantity.trim() === "" ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      setError("Please enter valid book details.");
      return;
    }

    try {
      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            author: form.author.trim(),
            genre: form.genre,
            quantity,
            ...(isEditing ? { available: quantity } : {}),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save book.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setMessage(
        isEditing ? "Book updated successfully!" : "Book added successfully!"
      );

      await fetchBooks();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  function handleEdit(book) {
    setEditingId(book._id);

    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      quantity: String(book.quantity),
    });

    setMessage("");
    setError("");

    document.getElementById("add-book")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete book.");
      }

      if (editingId === id) {
        cancelEdit();
      }

      setMessage("Book deleted successfully!");
      await fetchBooks();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  function getBookStatus(book) {
    const available = Number(book.available || 0);

    if (available === 0) return "Unavailable";
    if (available < Number(book.quantity || 0)) {
      return "Partially Available";
    }

    return "Available";
  }

  const genreCounts = genres.map((genre) => ({
    genre,
    count: books.filter((book) => book.genre === genre).length,
  }));

  const maxGenreCount = Math.max(
    1,
    ...genreCounts.map((item) => item.count)
  );

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">📚</span>
          <span>Library Management</span>
        </a>

        <div className="topbar-right">
          <span className="admin-label">Admin Panel</span>
          <span className="admin-avatar">A</span>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-label">MAIN MENU</div>

          <a className="nav-link active" href="#dashboard">
            <span>⌂</span> Dashboard
          </a>

          <a className="nav-link" href="#add-book">
            <span>＋</span> Add Book
          </a>

          <a className="nav-link" href="#all-books">
            <span>▤</span> All Books
          </a>

          <div className="sidebar-footer">
            <span>Library Management System</span>
            <small>Version 1.0</small>
          </div>
        </aside>

        <main className="dashboard-main">
          <section id="dashboard" className="welcome-panel">
            <div className="welcome-icon">📖</div>

            <div className="welcome-text">
              <h1>Welcome to Library Management</h1>
              <p>
                Manage your books, track availability and keep your library
                organized.
              </p>
            </div>

            <div className="welcome-quote">
              “A book is a dream you hold in your hands.”
              <small>— Neil Gaiman</small>
            </div>
          </section>

          {error && <div className="alert error-alert">{error}</div>}
          {message && (
            <div className="alert success-alert">{message}</div>
          )}


          <section id="add-book" className="panel form-section">
            <div className="section-heading">
              <div className="heading-icon">＋</div>
              <div>
                <h2>{editingId ? "Edit Book" : "Add New Book"}</h2>
                <p>
                  {editingId
                    ? "Update the selected book details."
                    : "Fill in the details below to add a new book to your library."}
                </p>
              </div>
            </div>

            <form className="book-form" onSubmit={handleSubmit}>
              <label>
                Book Title <span>*</span>
                <input
                  name="title"
                  type="text"
                  placeholder="Enter book title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                />
              </label>


              <label>
                Author <span>*</span>
                <input
                  name="author"
                  type="text"
                  placeholder="Enter author name"
                  value={form.author}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Genre <span>*</span>
                <select
                  name="genre"
                  value={form.genre}
                  onChange={handleInputChange}
                  required
                >
                  {genres.map((genre) => (
                    <option value={genre} key={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantity <span>*</span>
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <div className="form-actions">
                <button className="primary-button" type="submit">
                  {editingId ? "✓ Update Book" : "＋ Add Book"}
                </button>

                {editingId && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section id="all-books" className="panel books-panel">
            <div className="books-heading">
              <div className="section-heading">
                <div className="heading-icon">▤</div>
                <div>
                  <h2>Available Books</h2>
                  <p>Browse and manage your books</p>
                </div>
              </div>
            </div>

            {loading ? (
              <p className="empty-message">Loading books...</p>
            ) : filteredBooks.length === 0 ? (
              <p className="empty-message">
                {searchTerm
                  ? "No books match your search."
                  : "No books found. Add your first book above."}
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="books-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Genre</th>
                      <th>Total</th>
                      <th>Available</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBooks.map((book, index) => (
                      <tr key={book._id}>
                        <td>{index + 1}</td>
                        <td className="book-title-cell">{book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <span
                            className={`genre-badge genre-${book.genre.toLowerCase()}`}
                          >
                            {book.genre}
                          </span>
                        </td>
                        <td>{book.quantity}</td>
                        <td>{book.available}</td>
                        <td>
                          <span
                            className={`status-badge status-${getBookStatus(
                              book
                            )
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {getBookStatus(book)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() => handleEdit(book)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(book._id)}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="table-footer">
              Showing {filteredBooks.length} of {books.length} books
            </div>
          </section>

          <footer className="page-footer">
            © 2026 Library Management System · Built with React & MongoDB
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;


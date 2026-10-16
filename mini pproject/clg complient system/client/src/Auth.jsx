
import { useState } from "react";
import "./Auth.css";

const API = "http://localhost:5000/api/auth";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
    name: "",
    collegeId: "",
    email: "",
    department: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function submit(e) {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "register" : "login";

      const body = isRegister
        ? { ...form, role }
        : {
            email: form.email,
            password: form.password,
            role,
          };

      const response = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (isRegister) {
        if (role === "student") {
          setIsRegister(false);

          setForm({
            name: "",
            collegeId: "",
            email: form.email,
            department: "",
            password: "",
          });

          setRole("student");
          setMessageType("success");
          setMessage(
            data.message ||
              "Student account created successfully! Please log in."
          );
        } else {
          setMessageType("pending");
          setMessage(
            data.message ||
              "Staff registration submitted successfully. Please wait for admin approval."
          );

          setForm({
            name: "",
            collegeId: "",
            email: "",
            department: "",
            password: "",
          });
        }
      } else {
        if (!data.token || !data.user) {
          throw new Error(
            "Login response is missing account information."
          );
        }

        // Extra frontend check; the backend must enforce approval too.
        if (
          data.user.role === "staff" &&
          data.user.approved !== true
        ) {
          throw new Error(
            "Your staff account is waiting for admin approval."
          );
        }

        localStorage.setItem("campuscareToken", data.token);
        localStorage.setItem(
          "campuscareUser",
          JSON.stringify(data.user)
        );

        onLogin(data.user);
      }
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof TypeError
          ? "Cannot connect to the backend. Check that the server is running on port 5000 and CORS is enabled."
          : error.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsRegister((prev) => !prev);
    setMessage("");
    setMessageType("");
  }

  function changeRole(newRole) {
    setRole(newRole);
    setMessage("");
    setMessageType("");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          Campus<span>Care</span>
        </div>

        <p className="auth-subtitle">
          College Complaint Management System
        </p>

        <div className="role-switch">
          <button
            type="button"
            className={role === "student" ? "selected" : ""}
            onClick={() => changeRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "staff" ? "selected" : ""}
            onClick={() => changeRole("staff")}
          >
            Staff
          </button>
        </div>

        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

        <p className="auth-hint">
          {isRegister
            ? role === "student"
              ? "Create your student account"
              : "Register your staff account for approval"
            : "Sign in to your account"}
        </p>

        <form onSubmit={submit}>
          {isRegister && (
            <>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <label htmlFor="collegeId">College ID</label>
              <input
                id="collegeId"
                name="collegeId"
                value={form.collegeId}
                onChange={update}
                placeholder="Enter your college ID"
                required
              />

              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={update}
                placeholder="e.g. Information Technology"
                required
              />
            </>
          )}

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            placeholder="Minimum 8 characters"
            minLength={8}
            autoComplete={
              isRegister ? "new-password" : "current-password"
            }
            required
          />

          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? role === "student"
                  ? "Create Student Account"
                  : "Register for Staff Approval"
                : "Sign In"}
          </button>
        </form>

        {message && (
          <p
            className={`auth-message ${messageType}`}
            role="status"
          >
            {message}
          </p>
        )}

        <p className="auth-footer">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            className="text-btn"
            type="button"
            onClick={toggleMode}
          >
            {isRegister ? "Sign in" : "Register"}
          </button>
        </p>

        {role === "staff" && isRegister && (
          <p className="staff-note">
            Staff accounts must be approved by an administrator
            before they can log in.
          </p>
        )}
      </section>
    </main>
  );
}

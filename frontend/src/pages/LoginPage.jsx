import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

export default function LoginPage() {
  const { user, login } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@example.com");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    setError("");
    login(name.trim(), email.trim());
    navigate("/");
  };

  return (
    <>
      <header className="page-header">
        <h1>Sign in</h1>
        <p>Enter any name and email to sign in (no backend — accepts all credentials).</p>
      </header>

      <div className="panel login-card">
        <h2>Welcome to PrintMart</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid" style={{ marginTop: "var(--space-4)" }}>
            <div className="field">
              <label htmlFor="login-name">Name</label>
              <input
                id="login-name"
                className="control"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="control"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="btnrow" style={{ marginTop: "var(--space-5)" }}>
            <button className="btn primary" type="submit">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

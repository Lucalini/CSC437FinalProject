import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useApp } from "../AppContext";

export default function RegisterPage() {
    const { user, register } = useApp();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/account" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 4) {
            setError("Password must be at least 4 characters.");
            return;
        }

        setError("");
        setSubmitting(true);
        try {
            await register(username.trim(), email.trim(), password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <header className="page-header">
                <h1>Create an account</h1>
                <p>Sign up to start shopping on PrintMart.</p>
            </header>

            <div className="panel login-card">
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid" style={{ marginTop: "var(--space-4)" }}>
                        <div className="field">
                            <label htmlFor="reg-username">Username</label>
                            <input
                                id="reg-username"
                                className="control"
                                type="text"
                                required
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="reg-email">Email</label>
                            <input
                                id="reg-email"
                                className="control"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="reg-password">Password</label>
                            <input
                                id="reg-password"
                                className="control"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="reg-confirm">Confirm password</label>
                            <input
                                id="reg-confirm"
                                className="control"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="form-error" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="btnrow" style={{ marginTop: "var(--space-5)" }}>
                        <button className="btn primary" type="submit" disabled={submitting}>
                            {submitting ? "Creating account..." : "Create account"}
                        </button>
                    </div>

                    <p style={{ marginTop: "var(--space-4)", color: "var(--color-muted)" }}>
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </>
    );
}

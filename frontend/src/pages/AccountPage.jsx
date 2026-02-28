import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useApp } from "../AppContext";

function ContactForm() {
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState({ Employer: false, Peer: false, Other: false });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailRegex =
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)([a-z0-9_'+\-])@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!Object.values(audience).some(Boolean)) {
      newErrors.audience = "Please select at least one option.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }

    setErrors({});
    setSuccess(true);
    setEmail("");
    setAudience({ Employer: false, Peer: false, Other: false });
    setMessage("");
  };

  return (
    <section aria-label="Contact form" style={{ marginTop: "var(--space-6)" }}>
      <h3>Contact PrintMart</h3>
      <p className="muted">Send a message to the team.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid" style={{ marginTop: "var(--space-4)" }}>
          <div className="field">
            <label htmlFor="contact-email">Email address</label>
            <input
              id="contact-email"
              className="control"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email && (
              <p className="form-error" id="contact-email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <fieldset className="fieldset" aria-label="Audience selection">
            <legend>What best describes you? (choose at least one)</legend>
            <div className="checkboxes" role="group" aria-label="Audience checkboxes">
              {Object.keys(audience).map((key) => (
                <label className="check" key={key}>
                  <input
                    type="checkbox"
                    checked={audience[key]}
                    onChange={(e) =>
                      setAudience((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                    aria-invalid={errors.audience ? "true" : undefined}
                  />
                  {key}
                </label>
              ))}
            </div>
            {errors.audience && (
              <p className="form-error" role="alert">
                {errors.audience}
              </p>
            )}
          </fieldset>

          <div className="field">
            <label htmlFor="contact-message">Message (optional)</label>
            <textarea
              id="contact-message"
              className="control"
              rows={4}
              placeholder="What can we help with?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>

        {success && (
          <p className="form-success" role="status">
            Message sent! (No backend — this is a demo.)
          </p>
        )}

        <div className="btnrow" style={{ marginTop: "var(--space-5)" }}>
          <button className="btn primary" type="submit">
            Send message
          </button>
        </div>
      </form>
    </section>
  );
}

export default function AccountPage() {
  const { user, updateProfile, orders } = useApp();

  const [prefMaterial, setPrefMaterial] = useState(user?.preferredMaterial ?? "PLA");
  const [prefNotify, setPrefNotify] = useState(user?.notifications ?? "Email");
  const [saved, setSaved] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSave = () => {
    updateProfile({ preferredMaterial: prefMaterial, notifications: prefNotify });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <header className="page-header">
        <h1>Account dashboard</h1>
        <p>Your profile and order history.</p>
      </header>

      <div className="split" aria-label="Account layout">
        <section className="panel" aria-label="Account information">
          <h2>Profile</h2>
          <table
            className="table"
            aria-label="Profile information"
            style={{ marginTop: "var(--space-4)" }}
          >
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td>Default shipping</td>
                <td>{user.address}</td>
              </tr>
            </tbody>
          </table>

          <h3>Saved preferences</h3>
          <div
            className="grid"
            aria-label="Preferences form"
            style={{ marginTop: "var(--space-3)" }}
          >
            <div className="field">
              <label htmlFor="pref_material">Preferred material</label>
              <select
                id="pref_material"
                className="control"
                value={prefMaterial}
                onChange={(e) => setPrefMaterial(e.target.value)}
              >
                <option>PLA</option>
                <option>PETG</option>
                <option>Resin</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="pref_notify">Order notifications</label>
              <select
                id="pref_notify"
                className="control"
                value={prefNotify}
                onChange={(e) => setPrefNotify(e.target.value)}
              >
                <option>Email</option>
                <option>SMS</option>
                <option>None</option>
              </select>
            </div>
          </div>

          <div
            className="btnrow"
            aria-label="Account actions"
            style={{ marginTop: "var(--space-5)" }}
          >
            <Link className="btn" to="/">
              Browse products
            </Link>
            <button className="btn ghost" onClick={handleSave} type="button">
              Save settings
            </button>
          </div>

          {saved && (
            <p className="form-success" role="status">
              Settings saved!
            </p>
          )}

          <hr className="hr" style={{ marginTop: "var(--space-6)" }} />

          <ContactForm />
        </section>

        <aside className="panel" aria-label="Order history">
          <h2>Order history</h2>
          {orders.length === 0 ? (
            <p className="muted">No orders yet.</p>
          ) : (
            <table
              className="table"
              aria-label="Order history"
              style={{ marginTop: "var(--space-4)" }}
            >
              <thead>
                <tr>
                  <th scope="col">Order</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <code>#{order.id}</code>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <span className="chip">{order.status}</span>
                    </td>
                    <td className="muted">{order.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div
            className="btnrow"
            aria-label="Order actions"
            style={{ marginTop: "var(--space-5)" }}
          >
            <Link className="btn primary" to="/review">
              Leave a product review
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

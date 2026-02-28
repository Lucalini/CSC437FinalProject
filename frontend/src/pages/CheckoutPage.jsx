import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import OrderSummary from "../components/OrderSummary";

const SHIPPING_OPTIONS = [
  { label: "Standard (3–5 days) — $6.00", cost: 6 },
  { label: "Express (1–2 days) — $14.00", cost: 14 },
  { label: "Local pickup — Free", cost: 0 },
];

export default function CheckoutPage() {
  const { user, cartItems, cartTotal, placeOrder } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email ?? "");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [addr1, setAddr1] = useState("123 Market St");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("San Jose");
  const [state, setState] = useState("CA");
  const [zip, setZip] = useState("95112");
  const [shippingIdx, setShippingIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <>
        <header className="page-header">
          <h1>Checkout</h1>
          <p>Please sign in to proceed.</p>
        </header>
        <div className="btnrow">
          <Link className="btn primary" to="/login">
            Sign in
          </Link>
        </div>
      </>
    );
  }

  if (cartItems.length === 0 && !submitted) {
    return (
      <>
        <header className="page-header">
          <h1>Checkout</h1>
          <p>Your cart is empty.</p>
        </header>
        <div className="btnrow">
          <Link className="btn primary" to="/">
            Browse catalog
          </Link>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <header className="page-header">
          <h1>Order placed!</h1>
          <p>Your order has been submitted. Check your account for status updates.</p>
        </header>
        <div className="btnrow">
          <Link className="btn primary" to="/account">
            View order history
          </Link>
          <Link className="btn ghost" to="/">
            Continue shopping
          </Link>
        </div>
      </>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || !addr1.trim() || !city.trim() || !zip.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    placeOrder({ email, fullName, addr1, addr2, city, state, zip });
    setSubmitted(true);
  };

  const shippingCost = SHIPPING_OPTIONS[shippingIdx].cost;

  return (
    <>
      <header className="page-header">
        <h1>Checkout</h1>
        <p>Review your order and submit.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="split" aria-label="Checkout layout">
          <section className="panel" aria-label="Shipping and contact form">
            <h2>Shipping &amp; contact</h2>

            <div className="grid" style={{ marginTop: "var(--space-4)" }}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="control"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  className="control"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="addr1">Address line 1</label>
                <input
                  id="addr1"
                  className="control"
                  type="text"
                  required
                  value={addr1}
                  onChange={(e) => setAddr1(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="addr2">Address line 2 (optional)</label>
                <input
                  id="addr2"
                  className="control"
                  type="text"
                  placeholder="Apartment, suite, etc."
                  value={addr2}
                  onChange={(e) => setAddr2(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  className="control"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  className="control"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option>CA</option>
                  <option>NY</option>
                  <option>WA</option>
                  <option>TX</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="zip">ZIP</label>
                <input
                  id="zip"
                  className="control"
                  type="text"
                  inputMode="numeric"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="ship">Shipping method</label>
                <select
                  id="ship"
                  className="control"
                  value={shippingIdx}
                  onChange={(e) => setShippingIdx(Number(e.target.value))}
                >
                  {SHIPPING_OPTIONS.map((opt, i) => (
                    <option key={i} value={i}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div
              className="btnrow"
              aria-label="Checkout actions"
              style={{ marginTop: "var(--space-5)" }}
            >
              <button className="btn primary" type="submit">
                Submit order
              </button>
              <Link className="btn ghost" to="/cart">
                Back to cart
              </Link>
            </div>
          </section>

          <aside className="panel" aria-label="Order summary">
            <h2>Order summary</h2>
            <table
              className="table"
              aria-label="Order summary items"
              style={{ marginTop: "var(--space-4)" }}
            >
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Line total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(({ productId, quantity, product }) => (
                  <tr key={productId}>
                    <td>{product?.name}</td>
                    <td>
                      <code>{quantity}</code>
                    </td>
                    <td>
                      <strong>
                        ${((product?.price ?? 0) * quantity).toFixed(2)}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: "var(--space-5)" }}>
              <OrderSummary
                cartItems={cartItems}
                cartTotal={cartTotal}
                shipping={shippingCost}
              />
            </div>
          </aside>
        </div>
      </form>
    </>
  );
}

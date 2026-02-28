import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

export default function ReviewPage() {
  const { user, products, orders, addReview } = useApp();
  const navigate = useNavigate();

  const [productId, setProductId] = useState(products[0]?.id ?? 1);
  const [rating, setRating] = useState(4);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (submitted) {
    return (
      <>
        <header className="page-header">
          <h1>Review submitted!</h1>
          <p>Thank you for your feedback. Your review is now visible on the product page.</p>
        </header>
        <div className="btnrow">
          <Link className="btn primary" to={`/product/${productId}`}>
            View product
          </Link>
          <Link className="btn ghost" to="/account">
            Back to account
          </Link>
        </div>
      </>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Please write a review comment.");
      return;
    }
    setError("");
    addReview({
      productId,
      reviewer: user.name,
      rating,
      comment: comment.trim(),
    });
    setSubmitted(true);
  };

  const ratingLabels = [
    "5 — Excellent",
    "4 — Good",
    "3 — Okay",
    "2 — Poor",
    "1 — Bad",
  ];

  return (
    <>
      <header className="page-header">
        <h1>Leave a review</h1>
        <p>Share your thoughts on a product you&apos;ve ordered.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="split" aria-label="Review layout">
          <section className="panel" aria-label="Review form">
            <h2>Review details</h2>

            <div className="grid" style={{ marginTop: "var(--space-4)" }}>
              <div className="field">
                <label htmlFor="review-product">Product</label>
                <select
                  id="review-product"
                  className="control"
                  value={productId}
                  onChange={(e) => setProductId(Number(e.target.value))}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="review-rating">Rating</label>
                <select
                  id="review-rating"
                  className="control"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {ratingLabels.map((label) => {
                    const val = Number(label.charAt(0));
                    return (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="field">
                <label htmlFor="review-title">Title (optional)</label>
                <input
                  id="review-title"
                  className="control"
                  type="text"
                  placeholder="Summarize your experience"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="review-comment">Review</label>
                <textarea
                  id="review-comment"
                  className="control"
                  rows={5}
                  required
                  placeholder="Tell others about this product…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  aria-invalid={error ? "true" : undefined}
                />
              </div>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div
              className="btnrow"
              aria-label="Review actions"
              style={{ marginTop: "var(--space-5)" }}
            >
              <button className="btn primary" type="submit">
                Submit review
              </button>
              <Link className="btn ghost" to="/account">
                Back to account
              </Link>
            </div>
          </section>

          <aside className="panel" aria-label="Guidelines">
            <h2>Guidelines</h2>
            <p className="muted">
              Reviews appear on the product page. Include your honest opinion
              about print quality, shipping, and overall value.
            </p>

            <h3 style={{ marginTop: "var(--space-5)" }}>Your recent orders</h3>
            {orders.length === 0 ? (
              <p className="muted">No orders yet.</p>
            ) : (
              <ul style={{ paddingLeft: "var(--space-5)", color: "var(--color-muted)" }}>
                {orders.slice(0, 3).map((o) => (
                  <li key={o.id}>
                    #{o.id} — {o.items}
                  </li>
                ))}
              </ul>
            )}

            <div className="btnrow" style={{ marginTop: "var(--space-4)" }}>
              <Link className="btn" to={`/product/${productId}`}>
                View product reviews
              </Link>
              <Link className="btn ghost" to="/">
                Return to catalog
              </Link>
            </div>
          </aside>
        </div>
      </form>
    </>
  );
}

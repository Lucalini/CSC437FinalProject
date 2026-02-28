import { useParams, Link, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, getProductReviews, user } = useApp();

  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    return (
      <>
        <header className="page-header">
          <h1>Product not found</h1>
          <p>The product you're looking for doesn't exist.</p>
        </header>
        <div className="btnrow">
          <Link className="btn primary" to="/">
            Back to catalog
          </Link>
        </div>
      </>
    );
  }

  const reviews = getProductReviews(product.id);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "N/A";

  return (
    <>
      <header className="page-header">
        <h1>{product.name}</h1>
      </header>

      <div className="split" aria-label="Product page layout">
        <section className="panel" aria-label="Product overview">
          <div
            className="thumb"
            role="img"
            aria-label={`Product image: ${product.name}`}
          />

          <div
            className="kpis"
            style={{ marginTop: "var(--space-4)" }}
            aria-label="Product highlights"
          >
            <span className="chip">{product.material}</span>
            <span className="chip">
              {avgRating}★ ({reviews.length} reviews)
            </span>
            <span className="chip">{product.stock}</span>
          </div>

          <h2 style={{ marginTop: "var(--space-5)" }}>About</h2>
          <p>{product.longDescription}</p>

          <h3>Specifications</h3>
          <table className="table" aria-label="Product specifications">
            <thead>
              <tr>
                <th scope="col">Spec</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {product.specs.map((spec) => (
                <tr key={spec.label}>
                  <td>{spec.label}</td>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="price" style={{ marginTop: "var(--space-5)", fontSize: "1.25rem" }}>
            ${product.price.toFixed(2)}
          </div>

          <div className="btnrow" aria-label="Product actions">
            <button
              className="btn primary"
              onClick={() => {
                addToCart(product.id);
                navigate("/cart");
              }}
              disabled={!user}
              title={user ? "Add to cart" : "Sign in to add to cart"}
            >
              Add to cart
            </button>
            <Link className="btn ghost" to="/">
              Back to catalog
            </Link>
          </div>
        </section>

        <aside className="panel" aria-label="3D preview and reviews">
          <h2>3D preview</h2>
          <p className="muted">Interactive 3D model viewer placeholder.</p>
          <div
            className="thumb"
            role="img"
            aria-label="3D preview placeholder"
            style={{ height: 220, marginTop: "var(--space-4)" }}
          />

          <hr className="hr" />

          <h2>Customer reviews</h2>
          {reviews.length === 0 ? (
            <p className="muted">No reviews yet. Be the first!</p>
          ) : (
            <table
              className="table"
              aria-label="Customer reviews"
              style={{ marginTop: "var(--space-4)" }}
            >
              <thead>
                <tr>
                  <th scope="col">Reviewer</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Comment</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.reviewer}</td>
                    <td>
                      <code>{review.rating}/5</code>
                    </td>
                    <td>{review.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div
            className="btnrow"
            aria-label="Review actions"
            style={{ marginTop: "var(--space-5)" }}
          >
            <Link className="btn" to="/review">
              Write a review
            </Link>
            <Link className="btn ghost" to="/account">
              View order history
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

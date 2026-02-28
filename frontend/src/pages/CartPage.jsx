import { Link } from "react-router-dom";
import { useApp } from "../AppContext";
import OrderSummary from "../components/OrderSummary";

export default function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, user } = useApp();

  if (!user) {
    return (
      <>
        <header className="page-header">
          <h1>Your cart</h1>
          <p>Please sign in to view your cart.</p>
        </header>
        <div className="btnrow">
          <Link className="btn primary" to="/login">
            Sign in
          </Link>
          <Link className="btn ghost" to="/">
            Browse catalog
          </Link>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <header className="page-header">
          <h1>Your cart</h1>
          <p>Your cart is empty. Browse the catalog to add items.</p>
        </header>
        <div className="btnrow">
          <Link className="btn primary" to="/">
            Browse catalog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="page-header">
        <h1>Your cart</h1>
        <p>
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
          cart.
        </p>
      </header>

      <div className="split" aria-label="Cart layout">
        <section className="panel" aria-label="Cart items">
          <h2>Items ({cartItems.length})</h2>

          <table
            className="table"
            aria-label="Cart items"
            style={{ marginTop: "var(--space-4)" }}
          >
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Details</th>
                <th scope="col">Qty</th>
                <th scope="col">Price</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(({ productId, quantity, product }) => (
                <tr key={productId}>
                  <td>
                    <Link to={`/product/${productId}`}>{product?.name}</Link>
                  </td>
                  <td className="muted">
                    {product?.material} &bull; {product?.variant}
                  </td>
                  <td>
                    <label className="sr-only" htmlFor={`qty-${productId}`}>
                      Quantity for {product?.name}
                    </label>
                    <select
                      id={`qty-${productId}`}
                      className="control"
                      style={{ padding: ".45rem .55rem" }}
                      value={quantity}
                      onChange={(e) =>
                        updateQuantity(productId, Number(e.target.value))
                      }
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <strong>
                      ${((product?.price ?? 0) * quantity).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <button
                      className="btn ghost"
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.85rem" }}
                      onClick={() => removeFromCart(productId)}
                      aria-label={`Remove ${product?.name} from cart`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="btnrow"
            aria-label="Cart actions"
            style={{ marginTop: "var(--space-5)" }}
          >
            <Link className="btn" to="/">
              Continue shopping
            </Link>
          </div>
        </section>

        <aside className="panel" aria-label="Order summary">
          <h2>Summary</h2>
          <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />

          <div
            className="btnrow"
            aria-label="Checkout actions"
            style={{ marginTop: "var(--space-5)" }}
          >
            <Link className="btn primary" to="/checkout">
              Proceed to checkout
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

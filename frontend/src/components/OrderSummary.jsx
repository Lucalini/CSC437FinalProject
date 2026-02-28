export default function OrderSummary({ cartItems, cartTotal, shipping = 6.0 }) {
  const tax = +(cartTotal * 0.08).toFixed(2);
  const total = +(cartTotal + shipping + tax).toFixed(2);

  return (
    <div className="summary" aria-label="Order totals">
      <div className="summary-row">
        <span className="muted">Subtotal</span>
        <strong>${cartTotal.toFixed(2)}</strong>
      </div>
      <div className="summary-row">
        <span className="muted">Shipping</span>
        <strong>${shipping.toFixed(2)}</strong>
      </div>
      <div className="summary-row">
        <span className="muted">Tax (est.)</span>
        <strong>${tax.toFixed(2)}</strong>
      </div>
      <hr className="hr" />
      <div className="summary-row">
        <span>Total</span>
        <strong>${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}

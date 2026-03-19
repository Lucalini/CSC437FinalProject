import { Link } from "react-router-dom";
import { useApp } from "../AppContext";

export default function ProductCard({ product }) {
    const { addToCart, user } = useApp();
    const { _id, name, material, rating, reviewCount, stock, price, description } = product;

    return (
        <article className="product-card">
            <Link to={`/product/${_id}`} aria-label={`Open product: ${name}`}>
                <div className="thumb" role="img" aria-label={`Product image: ${name}`} />
            </Link>
            <div className="product-meta">
                <h3>
                    <Link to={`/product/${_id}`}>{name}</Link>
                </h3>
                <div className="kpis" aria-label="Product highlights">
                    <span className="chip">{material}</span>
                    <span className="chip">
                        {rating}★ ({reviewCount})
                    </span>
                    <span className="chip">{stock}</span>
                </div>
                <div className="price">${price.toFixed(2)}</div>
                <div className="muted">{description}</div>
            </div>
            <div className="btnrow" aria-label="Product actions">
                <button
                    className="btn primary"
                    onClick={() => addToCart(_id)}
                    disabled={!user}
                    title={user ? "Add to cart" : "Sign in to add to cart"}
                >
                    Add to cart
                </button>
                <Link className="btn ghost" to={`/product/${_id}`}>
                    View details
                </Link>
            </div>
        </article>
    );
}

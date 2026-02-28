import { useState, useMemo } from "react";
import { useApp } from "../AppContext";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, MATERIALS, SORT_OPTIONS } from "../data";

export default function CatalogPage() {
  const { products } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (material) {
      result = result.filter((p) => p.material === material);
    }

    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "new":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [products, search, category, material, sort]);

  return (
    <>
      <header className="page-header">
        <h1>Catalog</h1>
        <p>Explore available 3D prints. Add items to your cart and place an order.</p>
      </header>

      <section className="surface pad" aria-label="Catalog filters and product grid">
        <div className="toolbar" aria-label="Catalog controls">
          <div className="field">
            <label htmlFor="q">Search</label>
            <input
              id="q"
              className="control"
              type="search"
              placeholder="Try: keycap, desk, dragon…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="material">Material</label>
            <select
              id="material"
              className="control"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
            >
              {MATERIALS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="sort">Sort</label>
            <select
              id="sort"
              className="control"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products" aria-label="Product listings">
          {filtered.length === 0 && (
            <p className="muted" style={{ gridColumn: "1 / -1" }}>
              No products match your filters.
            </p>
          )}
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchProducts } from "../features/products/productSlice";
import { getProductImage } from "../lib/productImages";

const Home = () => {
  const { items, categories, status, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const filteredProducts = items.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category?._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <div>
        <h2>Welcome, {user?.name}!</h2>
        <p style={{ color: "var(--text-light)", marginBottom: "1.5rem" }}>
          Discover our amazing collection of products
        </p>
      </div>

      <input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {categories.length > 0 ? (
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <button
            onClick={() => setSelectedCategory("all")}
            style={{ margin: 0, background: selectedCategory === "all" ? "var(--primary)" : "var(--bg-light)" }}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              style={{
                margin: 0,
                background: selectedCategory === category._id ? "var(--primary)" : "var(--bg-light)",
                color: selectedCategory === category._id ? "white" : "var(--text)",
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="empty-state">
          <h3>Loading products...</h3>
        </div>
      ) : null}

      {status === "failed" ? (
        <div className="empty-state">
          <h3>Unable to load products</h3>
          <p>{error}</p>
        </div>
      ) : null}

      {status === "succeeded" && filteredProducts.length > 0 ? (
        <div className="products">
          {filteredProducts.map((product) => (
            <div className="card" key={product._id}>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    background: "linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%)",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "3rem",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    style={{ width: "88px", height: "88px", objectFit: "contain" }}
                  />
                </div>
                <h4>{product.name}</h4>
                <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>
                  {product.category?.name || "General"} • Stock: {product.stock}
                </p>
                <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--text-light)" }}>
                  Rating: {product.averageRating || 0} ({product.reviewCount || 0} reviews)
                </p>
                <p style={{ marginBottom: "0.75rem" }}>{product.description || "High-quality product"}</p>
              </div>
              <div className="price">${Number(product.discountPrice || product.price).toFixed(2)}</div>
              <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column", padding: "0 1.5rem 1.5rem" }}>
                <button
                  onClick={() => {
                    dispatch(addToCart(product));
                    navigate("/cart");
                  }}
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/products/${product._id}`)}
                  style={{ background: "var(--bg-light)", color: "var(--text-h)", border: "1px solid var(--border)" }}
                >
                  Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {status === "succeeded" && filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      ) : null}
    </div>
  );
};

export default Home;

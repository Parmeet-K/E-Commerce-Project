import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { fetchCategories, fetchProducts } from "../features/products/productSlice";
import { getProductImage } from "../lib/productImages";

const emptyForm = {
  id: null,
  name: "",
  sku: "",
  brand: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  stock: "",
  lowStockThreshold: "5",
  tags: "",
  status: "active",
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items, categories, status } = useSelector((state) => state.products);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const sortedProducts = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleEdit = (product) => {
    setForm({
      id: product._id,
      name: product.name || "",
      sku: product.sku || "",
      brand: product.brand || "",
      description: product.description || "",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",
      category: product.category?._id || "",
      stock: product.stock ?? "",
      lowStockThreshold: product.lowStockThreshold ?? 5,
      tags: product.tags?.join(", ") || "",
      status: product.status || "active",
    });
    setMessage("");
    setError("");
  };

  const refreshProducts = async () => {
    await dispatch(fetchProducts());
    await dispatch(fetchCategories());
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    sku: form.sku.trim(),
    brand: form.brand.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
    category: form.category,
    stock: Number(form.stock),
    lowStockThreshold: Number(form.lowStockThreshold),
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    status: form.status,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const payload = buildPayload();

      if (form.id) {
        await api.put(`/products/${form.id}`, payload);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setMessage("Product created successfully.");
      }

      resetForm();
      await refreshProducts();
    } catch (submitError) {
      setError(submitError.response?.data?.error || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setMessage("Product deleted successfully.");
      if (form.id === productId) {
        resetForm();
      }
      await refreshProducts();
    } catch (deleteError) {
      setError(deleteError.response?.data?.error || "Unable to delete product");
    }
  };

  const handleStockUpdate = async (productId, stock, lowStockThreshold) => {
    try {
      await api.patch(`/products/${productId}/stock`, {
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
      });
      setMessage("Stock updated successfully.");
      await refreshProducts();
    } catch (stockError) {
      setError(stockError.response?.data?.error || "Unable to update stock");
    }
  };

  return (
    <div className="container">
      <h2>Admin Product Management</h2>
      <p style={{ marginBottom: "1rem", color: "var(--text-light)" }}>
        Create, edit, delete, and update stock for MongoDB products.
      </p>
      <p style={{ marginBottom: "1.5rem", color: "var(--text-light)" }}>
        Admin login seed: <strong>admin@shophub.com</strong> with name <strong>Admin User</strong>
      </p>

      {message ? <p style={{ color: "var(--success)", marginBottom: "1rem" }}>{message}</p> : null}
      {error ? <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</p> : null}

      <div className="detail-layout">
        <div className="detail-card">
          <h3>{form.id ? "Edit Product" : "Create Product"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-grid">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
              <input placeholder="SKU" value={form.sku} onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))} required />
              <input placeholder="Brand" value={form.brand} onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))} />
              <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} required />
              <input type="number" step="0.01" placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm((prev) => ({ ...prev, discountPrice: e.target.value }))} />
              <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))} required />
              <input type="number" placeholder="Low Stock Threshold" value={form.lowStockThreshold} onChange={(e) => setForm((prev) => ({ ...prev, lowStockThreshold: e.target.value }))} />
              <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="active">active</option>
                <option value="draft">draft</option>
                <option value="archived">archived</option>
              </select>
              <input placeholder="Tags comma separated" value={form.tags} onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))} />
            </div>
            <textarea
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              style={{ marginTop: "1rem" }}
            />
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button type="submit" disabled={saving}>{saving ? "Saving..." : form.id ? "Update Product" : "Create Product"}</button>
              <button type="button" onClick={resetForm} style={{ background: "var(--bg-light)", color: "var(--text-h)", border: "1px solid var(--border)" }}>
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="detail-card">
          <h3>Products</h3>
          {sortedProducts.map((product) => (
            <div key={product._id} className="review-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    style={{ width: "56px", height: "56px", objectFit: "contain", borderRadius: "0.5rem", background: "var(--bg-light)", padding: "0.35rem" }}
                  />
                  <div>
                  <h4>{product.name}</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                    {product.sku} • {product.category?.name || "General"} • {product.status}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                    Price: ${Number(product.discountPrice || product.price).toFixed(2)} • Stock: {product.stock}
                  </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(product._id)} style={{ background: "var(--danger)" }}>Delete</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="number"
                  defaultValue={product.stock}
                  id={`stock-${product._id}`}
                  style={{ maxWidth: "120px", marginBottom: 0 }}
                />
                <input
                  type="number"
                  defaultValue={product.lowStockThreshold || 5}
                  id={`threshold-${product._id}`}
                  style={{ maxWidth: "180px", marginBottom: 0 }}
                />
                <button
                  onClick={() =>
                    handleStockUpdate(
                      product._id,
                      document.getElementById(`stock-${product._id}`).value,
                      document.getElementById(`threshold-${product._id}`).value
                    )
                  }
                >
                  Update Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { addToCart } from "../features/cart/cartSlice";
import { fetchOrders } from "../features/orders/orderSlice";
import { getProductImage } from "../lib/productImages";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, status: orderStatus } = useSelector((state) => state.orders);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && orderStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [dispatch, orderStatus, user]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productResponse, reviewResponse] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get(`/reviews/product/${productId}`),
        ]);

        setProduct(productResponse.data);
        setReviews(reviewResponse.data);
        setError("");
      } catch (loadError) {
        setError(loadError.response?.data?.error || "Unable to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  const hasPurchasedProduct = useMemo(
    () =>
      orders.some((order) =>
        order.items.some((item) => (item.productId || item.id) === productId)
      ),
    [orders, productId]
  );

  const currentUserReview = useMemo(
    () => reviews.find((review) => review.userId?._id === user?.id),
    [reviews, user?.id]
  );

  useEffect(() => {
    if (currentUserReview) {
      setReviewForm({
        rating: currentUserReview.rating,
        title: currentUserReview.title || "",
        comment: currentUserReview.comment || "",
      });
    }
  }, [currentUserReview]);

  const refreshReviews = async () => {
    const [productResponse, reviewResponse] = await Promise.all([
      api.get(`/products/${productId}`),
      api.get(`/reviews/product/${productId}`),
    ]);
    setProduct(productResponse.data);
    setReviews(reviewResponse.data);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/reviews", {
        productId,
        rating: Number(reviewForm.rating),
        title: reviewForm.title,
        comment: reviewForm.comment,
        verifiedPurchase: hasPurchasedProduct,
      });
      await refreshReviews();
      setReviewForm((prev) => ({ ...prev, title: "", comment: "" }));
    } catch (submitError) {
      setError(submitError.response?.data?.error || "Unable to save review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      await refreshReviews();
    } catch (deleteError) {
      setError(deleteError.response?.data?.error || "Unable to delete review");
    }
  };

  if (loading) {
    return <div className="container"><p>Loading product...</p></div>;
  }

  if (error && !product) {
    return <div className="container"><p style={{ color: "var(--danger)" }}>{error}</p></div>;
  }

  return (
    <div className="container">
      <button onClick={() => navigate("/")} style={{ marginBottom: "1rem" }}>Back to Products</button>

      <div className="detail-layout">
        <div className="detail-card">
          <div
            style={{
              width: "100%",
              height: "220px",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <img
              src={getProductImage(product)}
              alt={product.name}
              style={{ width: "140px", height: "140px", objectFit: "contain" }}
            />
          </div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Category:</strong> {product.category?.name || "General"}</p>
          <p><strong>Price:</strong> ${Number(product.discountPrice || product.price).toFixed(2)}</p>
          <p><strong>Stock:</strong> {product.stock}</p>
          <p><strong>Average Rating:</strong> {product.averageRating || 0} / 5</p>
          <button
            onClick={() => {
              dispatch(addToCart(product));
              navigate("/cart");
            }}
            style={{ marginTop: "1rem" }}
          >
            Add to Cart
          </button>
        </div>

        <div className="detail-card">
          <h3>{currentUserReview ? "Update Your Review" : "Write a Review"}</h3>
          {error ? <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>{error}</p> : null}
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: e.target.value }))}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                value={reviewForm.title}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Short headline"
              />
            </div>
            <div className="form-group">
              <label>Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience"
                rows={4}
              />
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : currentUserReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
          {hasPurchasedProduct ? (
            <p style={{ marginTop: "0.75rem", color: "var(--success)" }}>Verified purchase review</p>
          ) : null}
        </div>
      </div>

      <div className="detail-card" style={{ marginTop: "1.5rem" }}>
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? <p>No reviews yet. Be the first to review this product.</p> : null}
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <h4 style={{ marginBottom: "0.25rem" }}>{review.title || "Review"}</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                  By {review.userId?.name || "User"} • Rating: {review.rating}/5
                  {review.verifiedPurchase ? " • Verified purchase" : ""}
                </p>
              </div>
              {(review.userId?._id === user?.id || user?.role === "admin") ? (
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  style={{ background: "var(--danger)", height: "fit-content" }}
                >
                  Delete
                </button>
              ) : null}
            </div>
            <p style={{ marginTop: "0.75rem" }}>{review.comment || "No comment provided."}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;

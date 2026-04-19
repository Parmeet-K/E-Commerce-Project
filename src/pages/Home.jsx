import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { items } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredProducts = items.filter(p =>
  p.name.toLowerCase().includes(search.toLowerCase())
);

  return (
  <div className="container">
    <div>
      <h2>👋 Welcome, {user?.name}!</h2>
      <p style={{color: 'var(--text-light)', marginBottom: '1.5rem'}}>Discover our amazing collection of products</p>
    </div>

    <input
      placeholder="🔍 Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {filteredProducts.length > 0 ? (
      <div className="products">
        {filteredProducts.map(product => (
          <div className="card" key={product.id}>
            <div style={{flex: 1}}>
              <div style={{
                width: '100%',
                height: '120px',
                background: `linear-gradient(135deg, var(--primary-light) 0%, var(--secondary) 100%)`,
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '3rem',
              }}>
                🛍️
              </div>
              <h4>{product.name}</h4>
              <p style={{marginBottom: '0.75rem'}}>{product.description || 'High-quality product'}</p>
            </div>
            <div className="price">${product.price.toFixed(2)}</div>
            <button onClick={() => {
              dispatch(addToCart(product));
              navigate("/cart");}}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="empty-state">
        <h3>No products found</h3>
        <p>Try adjusting your search terms</p>
      </div>
    )}
  </div>
  );
};

export default Home;
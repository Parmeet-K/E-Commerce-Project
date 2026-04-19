import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar">
      <h2>🛍️ ShopHub</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/cart">Cart ({cartItems.length})</Link>
        <Link to="/orders">Orders</Link>

        {user ? (
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span className="user">👤 {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                margin: 0,
                fontSize: '0.9rem'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
  <div className="container">
    <h2>🛒 Shopping Cart</h2>

    {cartItems.length > 0 ? (
      <>
        <div style={{marginTop: '1.5rem'}}>
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <div>
                <h4 style={{margin: 0, marginBottom: '0.25rem'}}>{item.name}</h4>
                <p style={{fontSize: '0.9rem'}}>Quantity: {item.qty}</p>
                <p style={{fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)'}}>
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </div>
              <button onClick={() => dispatch(removeFromCart(item.id))} style={{margin: 0}}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Subtotal: ${total.toFixed(2)}</p>
          <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.5rem 0'}}>Shipping: Free</p>
          <div style={{borderTop: '2px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem'}}>
            <p style={{fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary)'}}>Total: ${total.toFixed(2)}</p>
          </div>
          <button onClick={() => navigate("/checkout")} style={{width: '100%', marginTop: '1rem'}}>
            Proceed to Checkout
          </button>
          <button onClick={() => navigate("/")} style={{width: '100%', marginTop: '0.75rem', background: 'transparent', color: 'var(--primary)', border: '2px solid var(--border)'}}>
            Continue Shopping
          </button>
        </div>
      </>
    ) : (
      <div className="empty-state">
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <button onClick={() => navigate("/")} style={{marginTop: '1rem'}}>Start Shopping</button>
      </div>
    )}
  </div>
  );
};

export default Cart;
import { useDispatch, useSelector } from "react-redux";
import { placeOrder, cancelOrder } from "../features/orders/orderSlice";
import { clearCart } from "../features/cart/cartSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [addressError, setAddressError] = useState("");

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
    setAddressError("");
  };

  const validateAddress = () => {
    if (!address.street.trim() || !address.city.trim() || !address.state.trim() || !address.zipCode.trim()) {
      setAddressError("Please fill in all address fields");
      return false;
    }
    return true;
  };

  const handleCheckout = () => {
    if (!validateAddress()) {
      return;
    }

    const newOrderId = "ORD-" + Date.now();
    setOrderId(newOrderId);
    setOrderTotal(total);

    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;

    dispatch(placeOrder({
      id: newOrderId,
      items: cartItems,
      address: fullAddress,
    }));
    dispatch(clearCart());
    setOrderPlaced(true);
  };

  const handleCancelOrder = () => {
    if (orderId) {
      dispatch(cancelOrder(orderId));
      setOrderPlaced(false);
      setOrderId(null);
      setOrderTotal(0);
      setAddress({ street: "", city: "", state: "", zipCode: "" });
    }
  };

  if (orderPlaced) {
    return (
      <div className="container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
        <div style={{textAlign: 'center', background: 'var(--bg)', padding: '3rem', borderRadius: '1rem', boxShadow: 'var(--shadow-lg)', maxWidth: '500px', border: '2px solid var(--success)'}}>
          <div style={{fontSize: '4rem', marginBottom: '1rem'}}>✅</div>
          <h2 style={{color: 'var(--success)', marginBottom: '0.5rem'}}>Order Confirmed!</h2>
          <p style={{color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1rem'}}>
            Thank you, <strong>{user?.name}</strong>! Your order has been successfully placed.
          </p>

          <div style={{background: 'var(--bg-light)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem', textAlign: 'left'}}>
            <p style={{margin: '0.5rem 0', fontSize: '0.95rem'}}><strong>📦 Order ID:</strong> {orderId}</p>
            <p style={{margin: '0.5rem 0', fontSize: '0.95rem'}}><strong>📅 Order Date:</strong> {new Date().toLocaleDateString()}</p>
            <p style={{margin: '0.5rem 0', fontSize: '0.95rem'}}><strong>🚚 Estimated Delivery:</strong> 3-5 business days</p>
            <p style={{margin: '0.5rem 0', fontSize: '0.95rem'}}><strong>📍 Shipping to:</strong> {address.street}, {address.city}, {address.state} {address.zipCode}</p>
            <p style={{margin: '0.5rem 0', fontSize: '0.95rem'}}><strong>💰 Total Amount:</strong> ${orderTotal.toFixed(2)}</p>
          </div>

          <div style={{background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem'}}>
            <p style={{color: 'var(--success)', fontWeight: '600', margin: 0}}>📧 Confirmation email sent to {user?.email}</p>
          </div>

          <div style={{display: 'flex', gap: '1rem', flexDirection: 'column'}}>
            <button onClick={() => navigate("/")} style={{flex: 1}}>Continue Shopping</button>
            <button onClick={() => navigate("/orders")} style={{flex: 1, background: 'var(--primary-dark)'}}>View My Orders</button>
            <button
              onClick={handleCancelOrder}
              style={{flex: 1, background: 'var(--danger)', borderRadius: '0.5rem'}}
            >
              ❌ Cancel Order
            </button>
          </div>

          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '1rem'}}>
            You can manage or cancel your order from the Orders page within 1 hour
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Checkout</h2>

      {cartItems.length > 0 ? (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
          <div className="cart-summary" style={{marginBottom: '2rem'}}>
            <h3>Order Summary</h3>
            <div style={{marginTop: '1rem'}}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <p style={{fontWeight: '500', margin: 0}}>{item.name}</p>
                    <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: 0}}>Qty: {item.qty}</p>
                  </div>
                  <p style={{fontWeight: '600', margin: 0}}>${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
              <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--primary)'}}>
                <p style={{fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)'}}>
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div style={{background: 'var(--bg-light)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem'}}>
            <h4 style={{marginBottom: '1rem'}}>📍 Shipping Address</h4>

            {addressError && (
              <div style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem'}}>
                ⚠️ {addressError}
              </div>
            )}

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={handleAddressChange}
                style={{gridColumn: '1 / -1'}}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleAddressChange}
              />
            </div>

            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={address.zipCode}
              onChange={handleAddressChange}
              style={{marginBottom: '0'}}
            />
          </div>

          <button onClick={handleCheckout} style={{width: '100%', padding: '1rem', marginBottom: '1rem'}}>
            ✅ Place Order
          </button>

          <button onClick={() => navigate("/cart")} style={{width: '100%', padding: '1rem', background: 'transparent', color: 'var(--primary)', border: '2px solid var(--border)'}}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add products before checking out</p>
          <button onClick={() => navigate("/")} style={{marginTop: '1rem'}}>Continue Shopping</button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

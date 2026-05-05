import { useSelector, useDispatch } from "react-redux";
import { cancelOrder, fetchOrders } from "../features/orders/orderSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Orders = () => {
  const { orders, status, error } = useSelector(state => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrders());
    }
  }, [dispatch, status]);

  const handleCancelOrder = (orderId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (confirmed) {
      dispatch(cancelOrder(orderId));
    }
  };

  const getStatusColor = (statusValue) => {
    if (statusValue === "cancelled") return "var(--danger)";
    return "var(--success)";
  };

  const getStatusEmoji = (statusValue) => {
    if (statusValue === "cancelled") return "❌";
    return "✅";
  };

  return (
    <div className="container">
      <h2>📦 Order History</h2>

      {status === "loading" ? <p>Loading your orders...</p> : null}
      {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}

      {orders && orders.length > 0 ? (
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          {orders.map((order, index) => (
            <div key={order.id} className="cart-item" style={{marginBottom: '1rem', flexDirection: 'column', alignItems: 'flex-start'}}>
              <div style={{width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem'}}>
                  <h4 style={{margin: '0'}}>Order #{orders.length - index}</h4>
                  <span style={{
                    color: getStatusColor(order.status),
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    {getStatusEmoji(order.status)} {order.status?.toUpperCase() || 'CONFIRMED'}
                  </span>
                </div>

                <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.25rem 0'}}>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.25rem 0'}}>
                  <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                </p>
                <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.25rem 0'}}>
                  <strong>Estimated Delivery:</strong> 3-5 business days
                </p>
                <p style={{fontSize: '0.9rem', color: 'var(--text-light)', margin: '0.25rem 0'}}>
                  <strong>Shipping Address:</strong> {order.address}
                </p>

                {order.items && order.items.length > 0 && (
                  <div style={{marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)'}}>
                    <p style={{fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.5rem 0'}}>Items:</p>
                    {order.items.map(item => (
                      <p key={`${order.id}-${item.productId || item.id}`} style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: '0.25rem 0', paddingLeft: '1rem'}}>
                        • {item.name} (x{item.qty}) - ${(item.price * item.qty).toFixed(2)}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {order.status !== "cancelled" && (
                <div style={{display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem'}}>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    style={{
                      flex: 1,
                      background: 'var(--danger)',
                      borderRadius: '0.5rem'
                    }}
                  >
                    ❌ Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {status !== "loading" && orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Your order history will appear here after you make your first purchase</p>
          <button onClick={() => navigate("/")} style={{marginTop: '1rem'}}>Start Shopping</button>
        </div>
      ) : null}
    </div>
  );
};
export default Orders;

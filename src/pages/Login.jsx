import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      dispatch(login({ name: name.trim(), email: email.trim() }));
      navigate("/");
    }
  };

  return (
  <div className="container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
    <div className="login-form">
      <h2>Welcome Back</h2>
      <p style={{textAlign: 'center', marginBottom: '2rem', color: 'var(--text-light)'}}>Sign in to your account</p>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit">Sign In</button>
        </div>
      </form>

      <p style={{textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)'}}>
        Don't have an account? <a href="/register" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: '600'}}>Create one</a>
      </p>
    </div>
  </div>
  );
};

export default Login;
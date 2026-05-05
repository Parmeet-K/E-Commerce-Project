import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      const result = await dispatch(login({ name: name.trim(), email: email.trim() }));
      if (login.fulfilled.match(result)) {
        navigate("/");
      }
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

        {error ? <p style={{ color: "var(--danger)" }}>{error}</p> : null}

        <div className="form-group">
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Signing In..." : "Sign In"}
          </button>
        </div>
      </form>

      <p style={{textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)'}}>
        Don't have an account? <Link to="/register" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: '600'}}>Create one</Link>
      </p>
    </div>
  </div>
  );
};

export default Login;

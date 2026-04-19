import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      dispatch(register({ name: name.trim(), email: email.trim() }));
      navigate("/");
    }
  };

  return (
    <div className="container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh'}}>
      <div className="login-form">
        <h2>Create Account</h2>
        <p style={{textAlign: 'center', marginBottom: '2rem', color: 'var(--text-light)'}}>Join us today and start shopping</p>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g., Pam Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="pam@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit">Create Account</button>
          </div>
        </form>

        <p style={{textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-light)'}}>
          Already have an account? <a href="/login" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: '600'}}>Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
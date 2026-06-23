// src/pages/Login.jsx
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>CDNB-GRID</h1>
          <p className="login-subtitle">Sign in to your farm dashboard</p>
          
          <form className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>
            <Link to="/dashboard" className="login-btn-submit">
              Sign In
            </Link>
          </form>
          
          <p className="login-footer">
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
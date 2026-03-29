import React, { useState } from "react";
import "./Login.css";
import { Alert, AlertTitle } from "@mui/material";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setAlert({ type: "success", message: "Login successful!" });
        // тут можна зробити redirect на dashboard
      } else {
        setAlert({ type: "error", message: data.message || "Login failed" });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Server error" });
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>
      <p>Sign in to start managing your projects.</p>

      {/* Повідомлення */}
      {alert.message && (
        <Alert severity={alert.type} style={{ marginBottom: "15px" }}>
          <AlertTitle>
            {alert.type === "success" ? "Success" : "Error"}
          </AlertTitle>
          {alert.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign In</button>
      </form>
      <div className="divider">Or</div>
      <p className="forgot">Forgot Password?</p>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/login", formData);
      if (res.status === 200) {
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }
        router.push("/feed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f2ef",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "2.2rem",
            fontWeight: "bold",
            color: "#0a66c2",
            margin: "0 0 8px 0",
          }}
        >
          ConnectIn
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem", margin: 0 }}>
          Welcome back to your professional community
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "32px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#000000",
          }}
        >
          Sign in
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#fce8e6",
              color: "#c5221f",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "0.9rem",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#666",
                marginBottom: "4px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#666",
                marginBottom: "4px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: loading ? "#99c2ff" : "#0a66c2",
              color: "#ffffff",
              border: "none",
              borderRadius: "24px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          New to ConnectIn?{" "}
          <span
            onClick={() => router.push("/register")}
            style={{
              color: "#0a66c2",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Join now
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
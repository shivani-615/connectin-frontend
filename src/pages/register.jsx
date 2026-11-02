import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { API_URL } from "../lib/api";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
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
      const res = await axios.post(`${API_URL}/register`, formData);
      if (res.status === 200 || res.status === 201) {
        router.push("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
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
      {/* Brand Header */}
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
          Make the most of your professional life
        </p>
      </div>

      {/* Form Card */}
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
          Join ConnectIn
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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#666",
                marginBottom: "4px",
              }}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
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
            {loading ? "Joining..." : "Agree & Join"}
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
          Already on ConnectIn?{" "}
          <span
            onClick={() => router.push("/login")}
            style={{
              color: "#0a66c2",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
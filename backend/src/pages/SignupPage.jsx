import { useState } from "react";
import axios from "../api/axios"; // adjust path if needed

function SignupPage({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [isLogin, setLogin] = useState(false);
  const [message, setMessage] = useState("");

  const isStrongPassword = (pass) =>
    pass.length >= 6 && /[0-9]/.test(pass) && /[!@#$%^&*]/.test(pass);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isLogin && !isStrongPassword(password)) {
        showMsg("❌ Enter strong password (6+ chars, number, special char)");
        return;
      }

      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin
        ? { email, password, role }
        : { name, email, password, role };

      const res = await axios.post(endpoint, payload);

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showMsg(`✅ Welcome, ${user.name || "User"}!`);
      setTimeout(() => {
        onNavigate(user.role === "Manager" ? "admin" : "employee");
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Server error";
      showMsg(`❌ ${msg}`);
    }

    setName("");
    setEmail("");
    setPassword("");
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === "Employee" ? "Manager" : "Employee"));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <button
        onClick={() => onNavigate("home")}
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "3px",
        }}
      >
        ← Back to Home
      </button>

      <div style={{ border: "1px solid #ddd", padding: "30px", borderRadius: "8px" }}>
        <h2>{isLogin ? "Login" : "Signup"} - {role}</h2>

        <button
          type="button"
          onClick={toggleRole}
          style={{
            marginBottom: "20px",
            padding: "8px 16px",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "3px",
          }}
        >
          Switch to {role === "Employee" ? "Manager" : "Employee"}
        </button>

        {message && (
          <p style={{
            color: message.startsWith("❌") ? "red" : "green",
            backgroundColor: message.startsWith("❌") ? "#ffe6e6" : "#e6ffe6",
            padding: "10px",
            borderRadius: "3px",
            marginBottom: "15px",
          }}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "3px",
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #ddd",
              borderRadius: "3px",
            }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "3px",
              fontSize: "16px",
            }}
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
          <button
            type="button"
            onClick={() => setLogin(!isLogin)}
            style={{
              backgroundColor: "transparent",
              color: "#007bff",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Sign up here" : "Login here"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle, XCircle, Users, Target } from "lucide-react";
import axios from "../api/axios"; // adjust path if needed
import './Signup.css';

function SignupPage({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [isLogin, setLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isStrongPassword = (pass) =>
    pass.length >= 6 && /[0-9]/.test(pass) && /[!@#$%^&*]/.test(pass);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin && !isStrongPassword(password)) {
        showMsg("Enter strong password (6+ chars, number, special char)", "error");
        setIsLoading(false);
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

      showMsg(`Welcome, ${user.name || "User"}!`, "success");
      setTimeout(() => {
        onNavigate(user.role === "Manager" ? "admin" : "employee");
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Server error";
      showMsg(msg, "error");
    }

    setIsLoading(false);
    if (!isLogin || message.startsWith("Error")) {
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  const showMsg = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(""), 3000);
  };

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === "Employee" ? "Manager" : "Employee"));
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "" };
    
    let strength = 0;
    let criteria = [];
    
    if (password.length >= 6) {
      strength += 25;
      criteria.push("Length ✓");
    } else {
      criteria.push("Length (6+)");
    }
    
    if (/[0-9]/.test(password)) {
      strength += 25;
      criteria.push("Number ✓");
    } else {
      criteria.push("Number");
    }
    
    if (/[!@#$%^&*]/.test(password)) {
      strength += 25;
      criteria.push("Special char ✓");
    } else {
      criteria.push("Special char");
    }
    
    if (/[A-Z]/.test(password)) {
      strength += 25;
      criteria.push("Uppercase ✓");
    } else {
      criteria.push("Uppercase");
    }
    
    const labels = ["Weak", "Fair", "Good", "Strong"];
    const label = labels[Math.floor(strength / 25) - 1] || "Weak";
    
    return { strength, label, criteria };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="signup-page">
      {/* Header */}
      <header className="signup-header">
        <div className="signup-nav">
          <button
            onClick={() => onNavigate("home")}
            className="back-btn"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <div className="signup-logo">
            <div className="logo-icon">
              <Target size={32} />
            </div>
            <span className="logo-text">TaskFlow Pro</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="signup-main">
        <div className="signup-container">
          {/* Welcome Section */}
          <div className="signup-welcome">
            <div className="welcome-content">
              <h1 className="welcome-title">
                {isLogin ? "Welcome Back!" : "Join TaskFlow Pro"}
              </h1>
              <p className="welcome-subtitle">
                {isLogin 
                  ? "Sign in to access your dashboard and manage your tasks efficiently."
                  : "Create your account and start streamlining your team's workflow today."
                }
              </p>
              
              {/* Role Selector */}
              <div className="role-selector">
                <p className="role-label">I am a:</p>
                <div className="role-toggle">
                  <button
                    type="button"
                    onClick={toggleRole}
                    className={`role-btn ${role === "Employee" ? "active" : ""}`}
                  >
                    <User size={20} />
                    Employee
                  </button>
                  <button
                    type="button"
                    onClick={toggleRole}
                    className={`role-btn ${role === "Manager" ? "active" : ""}`}
                  >
                    <Users size={20} />
                    Manager
                  </button>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="mission-statement">
                <h3>Your Success is Our Priority</h3>
                <p>Join thousands of professionals who trust TaskFlow Pro to streamline their daily workflows and boost productivity. Whether you're managing a team or focusing on personal tasks, we've got you covered.</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="signup-form-section">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">
                  {isLogin ? "Sign In" : "Create Account"}
                </h2>
                <p className="form-subtitle">
                  {isLogin ? `Sign in as ${role}` : `Join as ${role}`}
                </p>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`message ${message.type}`}>
                  {message.type === "success" ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span className="message-text">{message.text}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="signup-form">
                {!isLogin && (
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <User size={16} />
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock size={16} />
                    Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input password-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {!isLogin && password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className={`strength-fill ${passwordStrength.label.toLowerCase()}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <div className="strength-info">
                        <span className="strength-label">{passwordStrength.label}</span>
                        <div className="strength-criteria">
                          {passwordStrength.criteria.join(" • ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`form-submit ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {isLogin ? <Lock size={20} /> : <User size={20} />}
                      {isLogin ? "Sign In" : "Create Account"}
                    </>
                  )}
                </button>
              </form>

              {/* Toggle Login/Signup */}
              <div className="form-toggle">
                <p className="toggle-text">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  type="button"
                  onClick={() => setLogin(!isLogin)}
                  className="toggle-btn"
                >
                  {isLogin ? "Create Account" : "Sign In"}
                </button>
              </div>

              {/* Security Note */}
              <div className="security-note">
                <Shield size={20} />
                <p>Your data is encrypted and secure. We never share your information.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignupPage;
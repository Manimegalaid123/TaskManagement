import { useState, useEffect } from "react";
import './Home.css';

// Professional Home Page Component
function HomePage({ onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: "🎯",
      title: "Smart Task Assignment",
      description: "Intelligent task distribution based on employee skills, workload, and availability for optimal productivity."
    },
    {
      icon: "📊",
      title: "Real-time Progress Tracking",
      description: "Monitor project status with live updates, visual progress indicators, and comprehensive analytics dashboard."
    },
    {
      icon: "🔄",
      title: "Seamless Status Updates",
      description: "Employees can instantly update task status with detailed comments and file attachments for transparency."
    },
    {
      icon: "📈",
      title: "Performance Analytics",
      description: "Advanced reporting tools to analyze team performance, identify bottlenecks, and optimize workflows."
    },
    {
      icon: "🔔",
      title: "Intelligent Notifications",
      description: "Smart alerts and reminders ensure nothing falls through the cracks with customizable notification preferences."
    },
    {
      icon: "👥",
      title: "Team Collaboration Hub",
      description: "Centralized communication platform with integrated chat, file sharing, and collaborative workspaces."
    }
  ];

  const stats = [
    { number: "2,500+", label: "Active Organizations", icon: "🏢" },
    { number: "50,000+", label: "Tasks Completed Daily", icon: "✅" },
    { number: "99.8%", label: "System Uptime", icon: "⚡" },
    { number: "4.9/5", label: "Customer Rating", icon: "⭐" }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Create & Assign",
      description: "Managers create tasks with detailed requirements and assign them to appropriate team members based on skills and availability."
    },
    {
      step: "02",
      title: "Execute & Update",
      description: "Employees receive notifications, access task details, and provide real-time status updates as they progress through their work."
    },
    {
      step: "03",
      title: "Monitor & Optimize",
      description: "Track progress through comprehensive dashboards, analyze performance metrics, and continuously improve team efficiency."
    }
  ];

  return (
    <div className="homepage">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 40 40" className="logo-svg">
                <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
                <path d="M12 20h16M20 12v16" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="16" cy="16" r="2" fill="white" />
                <circle cx="24" cy="24" r="2" fill="white" />
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-primary">TaskFlow</span>
              <span className="logo-secondary">Pro</span>
            </div>
          </div>
          
          {/* Navigation Actions */}
          <div className="nav-actions">
            <div className="nav-time">
              {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
            </div>
            <button 
              onClick={() => onNavigate("signup")}
              className="nav-signup-btn"
            >
              <span className="signup-icon"></span>
              Sign Up 
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
           
            
            <h1 className="hero-title">
              Streamline Your Team's
              <span className="gradient-text"> Workflow</span>
            </h1>
            <p className="hero-subtitle">
              Empower your managers to assign tasks intelligently while enabling employees to track progress seamlessly. 
              Experience the future of workplace productivity with our enterprise-grade task management platform.
            </p>
            
            {/* Primary CTA Buttons */}
            <div className="hero-actions">
              <button 
                onClick={() => onNavigate("signup")}
                className="btn btn-primary btn-large"
              >
                <span className="btn-icon">🚀</span>
                 Get Start 
              </button>
              <button 
                onClick={() => setIsVideoPlaying(true)}
                className="btn btn-secondary btn-large"
              >
                <div className="play-icon"></div>
                Watch Demo
              </button>
            </div>

            {/* Enhanced Dashboard Access */}
            <div className="hero-dashboards">
              <div className="dashboard-intro">
               
              </div>
              <button 
                onClick={() => onNavigate("admin")}
                className="dashboard-link manager-dash enhanced"
              >
                <div className="dash-icon-wrapper">
                  <span className="dash-icon">👨‍💼</span>
                  <div className="dash-glow"></div>
                </div>
                <div className="dash-content">
                  <span className="dash-title">Manager Dashboard</span>
                  <span className="dash-subtitle">Assign & Track Tasks</span>
                </div>
                <span className="dash-arrow">→</span>
              </button>
              <button 
                onClick={() => onNavigate("employee")}
                className="dashboard-link employee-dash enhanced"
              >
                <div className="dash-icon-wrapper">
                  <span className="dash-icon">👩‍💻</span>
                  <div className="dash-glow"></div>
                </div>
                <div className="dash-content">
                  <span className="dash-title">Employee Dashboard</span>
                  <span className="dash-subtitle">View & Update Progress</span>
                </div>
                <span className="dash-arrow">→</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="demo-container">
              {!isVideoPlaying ? (
                <div className="demo-placeholder" onClick={() => setIsVideoPlaying(true)}>
                  <div className="demo-preview">
                    <img 
                      src="https://tasktracker.in/webassets/images/easytousefull_new.gif" 
                      alt="TaskFlow Pro Demo - Easy to Use Task Management"
                      className="demo-gif"
                    />
                    <div className="demo-overlay-content">
                      <div className="demo-info">
                        <h3>See TaskFlow Pro in Action</h3>
                        <p>Watch how managers assign tasks and employees track progress seamlessly</p>
                      </div>
                    </div>
                  </div>
                  <div className="play-overlay">
                    <div className="play-button">
                      <span>▶</span>
                    </div>
                    <span className="play-text">Click to see interactive demo</span>
                  </div>
                </div>
              ) : (
                <div className="video-player">
                  <div className="video-header">
                    <span>🎬 TaskFlow Pro Interactive Demo</span>
                    <button onClick={() => setIsVideoPlaying(false)} className="close-btn">×</button>
                  </div>
                  <div className="video-content">
                    <div className="demo-gif-container">
                      <img 
                        src="https://tasktracker.in/webassets/images/easytousefull_new.gif" 
                        alt="TaskFlow Pro Demo"
                        className="demo-gif-large"
                      />
                    </div>
                    <div className="demo-features">
                      <h4>🎯 Key Features Demonstrated:</h4>
                      <ul>
                        <li>✨ <strong>Manager Dashboard:</strong> Intelligent task creation and assignment</li>
                        <li>📱 <strong>Employee Portal:</strong> Real-time task updates and progress tracking</li>
                        <li>📊 <strong>Analytics:</strong> Comprehensive performance insights and reporting</li>
                        <li>🔔 <strong>Notifications:</strong> Smart alerts keeping teams synchronized</li>
                      </ul>
                    </div>
                    <div className="demo-actions">
                      <button onClick={() => onNavigate("admin")} className="demo-btn manager-btn">
                        <span className="btn-icon">👨‍💼</span>
                        Try Manager Dashboard
                      </button>
                      <button onClick={() => onNavigate("employee")} className="demo-btn employee-btn">
                        <span className="btn-icon">👩‍💻</span>
                        Try Employee Dashboard
                      </button>
                   
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

  

      {/* How It Works Section */}
      <section className="workflow-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How TaskFlow Pro Works</h2>
            <p className="section-subtitle">
              A streamlined workflow that connects managers and employees for maximum productivity
            </p>
          </div>
          
          <div className="workflow-steps">
            {workflowSteps.map((item, index) => (
              <div key={index} className="workflow-step">
                <div className="step-number">{item.step}</div>
                <div className="step-content">
                  <h3 className="step-title">{item.title}</h3>
                  <p className="step-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features for Modern Teams</h2>
            <p className="section-subtitle">
              Everything you need to manage tasks efficiently and boost team productivity
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Team's Productivity?</h2>
            <p className="cta-subtitle">
              Join thousands of successful organizations already using TaskFlow Pro to streamline their operations.
            </p>
            <div className="cta-actions">
              <button 
                onClick={() => onNavigate("signup")}
                className="btn btn-primary btn-large cta-primary"
              >
                <span className="btn-icon">🚀</span>
                Get Started Free
              </button>
             
            </div>
           
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 40 40" className="logo-svg">
                    <circle cx="20" cy="20" r="18" fill="url(#footerLogoGradient)" />
                    <path d="M12 20h16M20 12v16" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="16" cy="16" r="2" fill="white" />
                    <circle cx="24" cy="24" r="2" fill="white" />
                    <defs>
                      <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="footer-logo-text">TaskFlow Pro</span>
              </div>
              <p className="footer-description">
                The professional task management solution that empowers teams to work smarter, not harder.
              </p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Platform</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate("admin"); }}>Manager Dashboard</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate("employee"); }}>Employee Portal</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); onNavigate("signup"); }}>Get Started</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">API Documentation</a></li>
                <li><a href="#">Contact Support</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 TaskFlow Pro. All rights reserved.</p>
              <div className="footer-social">
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
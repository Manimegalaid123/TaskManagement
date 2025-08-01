import { useState, useEffect } from "react";
import axios from "../api/axios";
import './Employee.css';

function EmployeeDashboard({ onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "Employee") {
      onNavigate("signup");
      return;
    }

    setUser(storedUser);

    axios.get("/tasks")
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error("❌ Failed to fetch tasks:", err);
        onNavigate("signup");
      });
  }, [onNavigate]);

  const toggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      const res = await axios.patch(`/tasks/${taskId}/status`, { status: newStatus });
      const updatedTask = res.data;
      setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onNavigate("home");
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">
          <h3>Loading your dashboard...</h3>
          <p>Please wait while we fetch your tasks</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = tasks.filter(task => task.status === "pending").length;

  return (
    <div className="employee-dashboard">
      {/* Navigation Header */}
      <nav className="dashboard-navbar">
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
          
          <div className="nav-actions">
            <div className="nav-time">
              {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
            </div>
            <button onClick={logout} className="logout-btn">
              <span className="logout-icon"></span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <div className="user-avatar">
                <span className="avatar-icon">👩‍💻</span>
              </div>
              <div className="user-info">
                <h1 className="welcome-title">
                  Welcome back, <span className="user-name">{user.name}</span>
                </h1>
                <p className="welcome-subtitle">
                  Here's your task overview for today. Stay productive and track your progress!
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="stat-card total">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <div className="stat-number">{tasks.length}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
              </div>
              
              <div className="stat-card pending">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-number">{pendingTasks}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
              
              <div className="stat-card completed">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-number">{completedTasks}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">Your Tasks</h2>
            <div className="task-filters">
              <button className="filter-btn active">All Tasks</button>
              <button className="filter-btn">Pending</button>
              <button className="filter-btn">Completed</button>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="no-tasks">
              <div className="no-tasks-icon">📋</div>
              <h3 className="no-tasks-title">No Tasks Assigned</h3>
              <p className="no-tasks-description">
                You don't have any tasks assigned at the moment. Your manager will assign tasks soon. 
                Check back later or contact your manager for more information.
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-card ${task.status === "completed" ? "completed" : ""}`}
                >
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className={`task-status ${task.status}`}>
                      <span className="status-icon">
                        {task.status === "completed" ? "✅" : "⏳"}
                      </span>
                      <span className="status-text">
                        {task.status === "completed" ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-meta">
                    <div className="task-date">
                      <span className="date-icon">📅</span>
                      <span className="date-text">
                        Assigned: {new Date(task.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => toggleStatus(task._id, task.status)}
                      className={`action-btn ${task.status === "pending" ? "complete" : "pending"}`}
                    >
                      <span className="btn-icon">
                        {task.status === "pending" ? "✓" : "↩"}
                      </span>
                      {task.status === "pending" ? "Mark as Complete" : "Mark as Pending"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
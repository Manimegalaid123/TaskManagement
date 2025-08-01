import { useState, useEffect } from "react";
import axios from "../api/axios";
import './Employee.css';

function EmployeeDashboard({ onNavigate }) {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
      .then(res => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tasks:", err);
        setLoading(false);
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
      console.error("Failed to update status:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onNavigate("home");
  };

  if (loading || !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">
          <h3>Loading Dashboard</h3>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Filter tasks based on selected filter
  let filteredTasks = tasks;
  if (filter === "pending") {
    filteredTasks = tasks.filter(task => task.status === "pending");
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.status === "completed");
  }

  return (
    <div className="employee-dashboard">
      {/* Header Navigation */}
      <nav className="dashboard-navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" className="logo-svg">
                <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-primary">TaskFlow</span>
              <span className="logo-secondary">Pro</span>
            </div>
          </div>
          
          <div className="nav-actions">
            <div className="nav-time">
              <svg viewBox="0 0 24 24" className="time-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
              <span>{currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}</span>
            </div>
            <button onClick={logout} className="logout-btn">
              <svg viewBox="0 0 24 24" className="logout-icon">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
              </svg>
              <span className="logout-text">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <div className="user-avatar">
                <svg viewBox="0 0 24 24" className="avatar-icon">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
              </div>
              <div className="user-info">
                <h1 className="welcome-title">
                  Welcome back, <span className="user-name">{user.name}</span>
                </h1>
                <p className="welcome-subtitle">
                  Track your progress and manage your assigned tasks efficiently
                </p>
              </div>
            </div>

            <div className="performance-indicator">
              <div className="completion-rate">
                <div className="rate-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle"
                      strokeDasharray={`${completionRate}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="20.35" className="percentage">{completionRate}%</text>
                  </svg>
                </div>
                <div className="rate-label">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card total-tasks">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
          </div>

          <div className="stat-card pending-tasks">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingTasks}</div>
              <div className="stat-label">Pending Tasks</div>
            </div>
          </div>

          <div className="stat-card completed-tasks">
            <div className="stat-icon">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-number">{completedTasks}</div>
              <div className="stat-label">Completed Tasks</div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">Task Management</h2>
            <div className="task-filters">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <svg viewBox="0 0 24 24" className="filter-icon">
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="currentColor"/>
                </svg>
                All Tasks
              </button>
              <button
                className={`filter-btn ${filter === "pending" ? "active" : ""}`}
                onClick={() => setFilter("pending")}
              >
                <svg viewBox="0 0 24 24" className="filter-icon">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                </svg>
                Pending
              </button>
              <button
                className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                onClick={() => setFilter("completed")}
              >
                <svg viewBox="0 0 24 24" className="filter-icon">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
                </svg>
                Completed
              </button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              <div className="no-tasks-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="no-tasks-title">No Tasks Available</h3>
              <p className="no-tasks-description">
                {filter === "all" 
                  ? "You don't have any tasks assigned yet. Check back later for new assignments."
                  : `No ${filter} tasks found. Try switching to a different filter.`
                }
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className={`task-card ${task.status === "completed" ? "completed" : "pending"}`}
                >
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className={`task-status ${task.status}`}>
                      <svg viewBox="0 0 24 24" className="status-icon">
                        {task.status === "completed" ? (
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
                        ) : (
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
                        )}
                      </svg>
                      <span className="status-text">
                        {task.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-meta">
                    <div className="task-date">
                      <svg viewBox="0 0 24 24" className="date-icon">
                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" fill="currentColor"/>
                      </svg>
                      <span className="date-text">
                        Assigned: {new Date(task.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => toggleStatus(task._id, task.status)}
                      className={`action-btn ${task.status === "pending" ? "complete" : "reopen"}`}
                    >
                      <svg viewBox="0 0 24 24" className="btn-icon">
                        {task.status === "pending" ? (
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" fill="currentColor"/>
                        ) : (
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
                        )}
                      </svg>
                      {task.status === "pending" ? "Mark Complete" : "Reopen Task"}
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
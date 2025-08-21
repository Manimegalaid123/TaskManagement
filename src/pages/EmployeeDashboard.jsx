import { useState, useEffect } from "react";
import { 
  Clock, 
  User, 
  LogOut, 
  CheckCircle, 
  Calendar, 
  BarChart3, 
  Filter, 
  List, 
  CheckSquare, 
  RefreshCw,
  Target,
  TrendingUp,
  Award,
  Zap
} from "lucide-react";
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
        <div className="loading-content">
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
      {/* Enhanced Navigation Header */}
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
              <Clock size={16} className="time-icon" />
              <span>{currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}</span>
            </div>
            <button onClick={logout} className="logout-btn">
              <LogOut size={16} className="logout-icon" />
              <span className="logout-text">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Enhanced Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="welcome-section">
              <div className="user-avatar">
                <User size={32} className="avatar-icon" />
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

            <div className="performance-section">
              <div className="performance-card">
                <div className="performance-icon">
                  <Award size={24} />
                </div>
                <div className="performance-content">
                  <div className="performance-rate">{completionRate}%</div>
                  <div className="performance-label">Completion Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="stats-section">
          <div className="stat-card total-tasks">
            <div className="stat-icon">
              <List size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{tasks.length}</div>
              <div className="stat-label">Total Tasks</div>
              <div className="stat-description">All assigned tasks</div>
            </div>
            <div className="stat-trend">
              <TrendingUp size={16} />
            </div>
          </div>

          <div className="stat-card pending-tasks">
            <div className="stat-icon">
              <Target size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{pendingTasks}</div>
              <div className="stat-label">In Progress</div>
              <div className="stat-description">Active tasks</div>
            </div>
            <div className="stat-trend">
              <Zap size={16} />
            </div>
          </div>

          <div className="stat-card completed-tasks">
            <div className="stat-icon">
              <CheckCircle size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{completedTasks}</div>
              <div className="stat-label">Completed</div>
              <div className="stat-description">Finished tasks</div>
            </div>
            <div className="stat-trend">
              <Award size={16} />
            </div>
          </div>

          <div className="stat-card performance-overview">
            <div className="stat-icon">
              <BarChart3 size={28} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{completionRate}%</div>
              <div className="stat-label">Performance</div>
              <div className="stat-description">Success rate</div>
            </div>
            <div className="stat-trend">
              <TrendingUp size={16} />
            </div>
          </div>
        </div>

        {/* Enhanced Tasks Section */}
        <div className="tasks-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <h2 className="section-title">Task Management</h2>
              <p className="section-subtitle">Monitor and update your assigned tasks</p>
            </div>
            <div className="task-filters">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                <Filter size={16} className="filter-icon" />
                All Tasks
              </button>
              <button
                className={`filter-btn ${filter === "pending" ? "active" : ""}`}
                onClick={() => setFilter("pending")}
              >
                <RefreshCw size={16} className="filter-icon" />
                In Progress
              </button>
              <button
                className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                onClick={() => setFilter("completed")}
              >
                <CheckSquare size={16} className="filter-icon" />
                Completed
              </button>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              <div className="no-tasks-icon">
                <List size={64} />
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
                      {task.status === "completed" ? (
                        <CheckCircle size={16} className="status-icon" />
                      ) : (
                        <RefreshCw size={16} className="status-icon" />
                      )}
                      <span className="status-text">
                        {task.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>

                  <p className="task-description">{task.description}</p>

                  <div className="task-meta">
                    <div className="task-date">
                      <Calendar size={16} className="date-icon" />
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
                      {task.status === "pending" ? (
                        <CheckCircle size={16} className="btn-icon" />
                      ) : (
                        <RefreshCw size={16} className="btn-icon" />
                      )}
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
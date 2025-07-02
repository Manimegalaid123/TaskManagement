import { useState, useEffect } from "react";
import axios from "../api/axios"; // ensure correct path
import './Admin.css';

function AdminDashboard({ onNavigate }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    completed: 0,
    pending: 0,
  });

  // Initial load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Manager") return onNavigate("signup");
    setCurrentAdmin(user);
    loadData();
  }, [onNavigate]);

  // Fetch employees list and tasks
  const loadData = async () => {
    try {
      const [empRes, tasksRes] = await Promise.all([
        axios.get("/users/employees"),
        axios.get("/tasks"),
      ]);
      setEmployees(empRes.data);
      setTasks(tasksRes.data);
      calculateStats(tasksRes.data, empRes.data);
    } catch (err) {
      showMsg("❌ Error loading data");
    }
  };

  // Calculate totals
  const calculateStats = (taskList, empList) => {
    let total = taskList.length;
    let completed = taskList.filter(t => t.status === "completed").length;
    let pending = total - completed;
    setStatistics({
      totalEmployees: empList.length,
      totalTasks: total,
      completed,
      pending,
    });
  };

  // Assign new task
  const assignTask = async () => {
    if (!selectedEmployeeId || !taskTitle || !taskDescription) {
      return showMsg("❌ Fill all fields");
    }
    try {
      await axios.post("/tasks", {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        deadline: taskDeadline,
        assignedTo: selectedEmployeeId,
      });
      showMsg("✅ Task assigned");
      resetTaskForm();
      loadData();
    } catch {
      showMsg("❌ Failed to assign task");
    }
  };

  const resetTaskForm = () => {
    setSelectedEmployeeId("");
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
    setTaskDeadline("");
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`/tasks/${taskId}`);
      showMsg("✅ Task deleted");
      loadData();
    } catch {
      showMsg("❌ Couldn't delete task");
    }
  };

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onNavigate("home");
  };

  const grouped = employees.reduce((acc, emp) => {
    acc[emp._id] = tasks.filter(t => t.assignedTo._id === emp._id);
    return acc;
  }, {});

  if (!currentAdmin) return null;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-left">
            <button onClick={() => onNavigate("home")} className="btn btn-secondary">
              Back to Home
            </button>
            <div>
              <h1 className="dashboard-title">👨‍💼 Admin Dashboard</h1>
              <p className="dashboard-subtitle">Welcome, {currentAdmin.name}</p>
            </div>
          </div>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Notification */}
      {message && (
        <div className={`message ${message.includes('✅') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="tab-navigation">
        <nav className="tab-nav">
          {["dashboard", "assign", "tasks", "employees"].map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="dashboard-main">
        <div className="tab-content">
          {activeTab === "dashboard" && (
            <div>
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-number">{statistics.totalEmployees}</div>
                  <div className="stat-label">Total Employees</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-number">{statistics.totalTasks}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-number">{statistics.completed}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card yellow">
                  <div className="stat-number">{statistics.pending}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
              
              <div className="overview-card">
                <h3 className="overview-title">Dashboard Overview</h3>
                <ul className="overview-list">
                  <li>Total Employees: {statistics.totalEmployees}</li>
                  <li>Active Tasks: {statistics.totalTasks}</li>
                  <li>Completion Rate: {statistics.totalTasks > 0 ? Math.round((statistics.completed / statistics.totalTasks) * 100) : 0}%</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "assign" && (
            <section>
              <h3>➕ Assign New Task</h3>
              <div className="form-grid">
                <div className="form-group">
                  <select 
                    className="form-select"
                    value={selectedEmployeeId} 
                    onChange={e => setSelectedEmployeeId(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(e => (
                      <option key={e._id} value={e._id}>
                        {e.name} ({e.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input 
                    className="form-input"
                    placeholder="Task Title" 
                    value={taskTitle} 
                    onChange={e => setTaskTitle(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <textarea 
                  className="form-textarea"
                  placeholder="Task Description" 
                  value={taskDescription} 
                  onChange={e => setTaskDescription(e.target.value)} 
                />
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <select 
                    className="form-select"
                    value={taskPriority} 
                    onChange={e => setTaskPriority(e.target.value)}
                  >
                    {["low", "medium", "high"].map(p => (
                      <option key={p} value={p}>{p.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input 
                    className="form-input"
                    type="date" 
                    value={taskDeadline} 
                    onChange={e => setTaskDeadline(e.target.value)} 
                  />
                </div>
              </div>
              
              <button className="btn btn-primary" onClick={assignTask}>
                Assign Task
              </button>
            </section>
          )}

          {activeTab === "tasks" && (
            <section className="task-section">
              <h3>📝 All Tasks</h3>
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <div className="empty-state-title">No Tasks Found</div>
                  <div className="empty-state-subtitle">Create your first task to get started</div>
                </div>
              ) : (
                <div className="task-list">
                  {tasks.map(task => (
                    <div key={task._id} className="task-item">
                      <div className="task-header">
                        <div className="task-content">
                          <h5 className="task-title">{task.title}</h5>
                          <p className="task-description">{task.description}</p>
                          <div className="task-meta">
                            <span className="task-meta-text">Assigned to: {task.assignedTo.name}</span>
                            <span className={`badge badge-status-${task.status.replace(' ', '-')}`}>
                              {task.status}
                            </span>
                            <span className={`badge badge-priority-${task.priority}`}>
                              {task.priority}
                            </span>
                            {task.deadline && (
                              <span className="task-meta-text">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => deleteTask(task._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "employees" && (
            <section>
              <h3>👥 Employees</h3>
              {employees.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <div className="empty-state-title">No Employees Found</div>
                  <div className="empty-state-subtitle">Add employees to start managing tasks</div>
                </div>
              ) : (
                <div className="employee-grid">
                  {employees.map(emp => {
                    const empTasks = grouped[emp._id] || [];
                    const completedTasks = empTasks.filter(t => t.status === 'completed').length;
                    const completionRate = empTasks.length > 0 ? Math.round((completedTasks / empTasks.length) * 100) : 0;
                    
                    return (
                      <div key={emp._id} className="employee-card">
                        <div className="employee-header">
                          <div className="employee-info">
                            <h4 className="employee-name">{emp.name}</h4>
                            <p className="employee-email">{emp.email}</p>
                          </div>
                          <div className="completion-rate">
                            <div className="completion-percentage">{completionRate}%</div>
                            <div className="completion-label">Completion</div>
                          </div>
                        </div>
                        <div className="employee-stats">
                          <span>Total Tasks: {empTasks.length}</span>
                          <span>Completed: {completedTasks}</span>
                          <span>Pending: {empTasks.length - completedTasks}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
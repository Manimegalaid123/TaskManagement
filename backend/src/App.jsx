import { useState } from 'react';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "signup":
        return <SignupPage onNavigate={navigate} />;
      case "admin":
        return <AdminDashboard onNavigate={navigate} />;
      case "employee":
        return <EmployeeDashboard onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {renderPage()}
    </div>
  );
}

export default App;
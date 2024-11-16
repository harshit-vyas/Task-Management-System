import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HeaderComponent from "./component/HeaderComponent";
import CreateAccount from "./component/CreateAccount";
import LoginComponent from "./component/LoginComponent";
import TasksComponent from "./component/TasksComponent";
import AddTaskComponent from "./component/AddTaskComponent";
import TaskHistory from "./component/TaskHistory";
import HomePage from "./component/Home";
import DetailPage from "./component/DetailPage";
import { getLoggedInUserId, isUserLoggedIn } from "./service/AuthApiService";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [activeUserId, setActiveUserId] = useState(getLoggedInUserId());

  useEffect(() => {
    // Update activeUserId whenever the authentication status changes
    const handleAuthChange = () => setActiveUserId(getLoggedInUserId());
    handleAuthChange();
  }, []);

  function AuthenticatedRoute({ children }) {
    const isAuthenticated = isUserLoggedIn();
    return isAuthenticated ? children : <Navigate to="/login" />;
  }

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <HeaderComponent />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/tasks"
            element={
              <AuthenticatedRoute>
                <TasksComponent userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <AuthenticatedRoute>
                <AddTaskComponent userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/task-details/:id"
            element={
              <AuthenticatedRoute>
                <DetailPage userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <AuthenticatedRoute>
                <TaskHistory userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/update-task/:id"
            element={
              <AuthenticatedRoute>
                <AddTaskComponent userId={activeUserId} />
              </AuthenticatedRoute>
            }
          />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

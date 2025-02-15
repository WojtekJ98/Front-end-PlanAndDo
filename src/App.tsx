import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import LoadingSpinner from "./components/LoadingSpiner";
import Home from "./page/home";
import Dashboard from "./page/dashboard";
import Login from "./page/login";
import SignUp from "./page/signup";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <React.Suspense
        fallback={
          <div className="bg">
            <LoadingSpinner />
          </div>
        }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </React.Suspense>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;

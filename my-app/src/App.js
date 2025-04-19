import React, { createContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddHotel from "./pages/AddHotel";
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import UserApproval from "./pages/UserApproval";
import TravelAgents from "./pages/TravelAgents";
import Navbar from "./components/Navbar";

// Create Auth Context
export const AuthContext = createContext();

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: localStorage.getItem("token") !== null,
    role: localStorage.getItem("role"),
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  });

  // Function to update auth state
  const updateAuthState = (newState) => {
    setAuthState(newState);
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return authState.isAuthenticated;
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return authState.role === "ADMIN";
  };

  // Protected route component
  const ProtectedRoute = ({ children, requiresAdmin = false }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    
    if (requiresAdmin && !isAdmin()) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <AuthContext.Provider value={{ authState, updateAuthState }}>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route 
            path="/hotels" 
            element={
              <ProtectedRoute>
                <Hotels />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/hotels/:id" 
            element={
              <ProtectedRoute>
                <HotelDetails />
              </ProtectedRoute>
            } 
          />
          
          <Route
            path="/add-hotel"
            element={
              <ProtectedRoute requiresAdmin={true}>
                <AddHotel />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/user-approval"
            element={
              <ProtectedRoute requiresAdmin={true}>
                <UserApproval />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/travel-agents"
            element={
              <ProtectedRoute requiresAdmin={true}>
                <TravelAgents />
              </ProtectedRoute>
            }
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;

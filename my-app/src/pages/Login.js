import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Import CSS file
import { AuthContext } from "../App";

function Login() {
  const [userName, setUserName] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const navigate = useNavigate(); // Hook for navigation
  const { updateAuthState } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", { userName });
      
      // First check if the user exists and check their status
      try {
        const checkUserResponse = await axios.get(`https://hms-columbus-vacation-backend-production.up.railway.app/auth/check-user/${userName}`);
        console.log("User check response:", checkUserResponse.data);
        
        if (!checkUserResponse.data.exists) {
          setError("❌ User does not exist. Please check your username or register.");
          setLoading(false);
          return;
        }
        
        if (checkUserResponse.data.exists && !checkUserResponse.data.approved && checkUserResponse.data.role !== "ADMIN") {
          setError("❌ Your account is pending approval by an administrator.");
          setLoading(false);
          return;
        }
      } catch (checkError) {
        console.error("Error checking user:", checkError);
        // Continue with login attempt even if check fails
      }
      
      const response = await axios.post(
        "https://hms-columbus-vacation-backend-production.up.railway.app/auth/login",
        { userName, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Login response:", response.data);

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      console.log("User data:", user);
      console.log("Approval status:", user.approved);
      console.log("User role:", user.role);
      
      // Check if user is approved
      if (user.role !== "ADMIN" && user.approved === false) {
        setError("❌ Your account is pending approval by an administrator.");
        setLoading(false);
        return;
      }

      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      // Log what was stored
      console.log("Stored token:", localStorage.getItem("token"));
      console.log("Stored role:", localStorage.getItem("role"));
      console.log("Stored user:", localStorage.getItem("user"));

      // Update auth context state
      updateAuthState({
        isAuthenticated: true,
        role: user.role,
        user: user
      });

      // Validate token immediately after login for debugging
      try {
        const validateResponse = await axios.get("https://hms-columbus-vacation-backend-production.up.railway.app/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("Token validation result:", validateResponse.data);
      } catch (validateError) {
        console.error("Token validation error:", validateError);
      }

      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/add-hotel"); // Redirect admin to add hotel page
      } else {
        navigate("/"); // Redirect regular users to home
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        // Server responded with an error
        console.error("Login error response:", error.response.status, error.response.data);
        if (error.response.status === 403) {
          setError(`❌ Your account is pending approval by an administrator.`);
        } else if (error.response.status === 401) {
          setError(`❌ Invalid username or password. Please try again.`);
        } else {
          const message = error.response.data?.message || "Invalid username or password";
          setError(`❌ ${message}`);
        }
      } else if (error.request) {
        // Request was made but no response
        console.error("No response received:", error.request);
        setError("❌ Unable to connect to the server. Please try again.");
      } else {
        // Something else went wrong
        console.error("Login error:", error.message);
        setError(`❌ ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input type="text" placeholder="👤 Username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="🔒 Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: "#2c3e50",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              width: "100%"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        {/* Registration link */}
        <p className="register-link">
          Don't have an account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

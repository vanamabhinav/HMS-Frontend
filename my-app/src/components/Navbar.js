//import React from "react";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import GlobalStyles from "../styles/GlobalStyles";

/*
const isAdmin = () => {
  const role = localStorage.getItem("role");
  return role === "ADMIN"; // Admin role check
}; 
*/
function Navbar() {
  const { authState, updateAuthState } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scrolling effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    
    updateAuthState({
      isAuthenticated: false,
      role: null,
      user: null
    });
    
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Check if the current route matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navbar Styles
  const navStyle = {
    padding: `${scrolled ? '12px' : '20px'} 0`,
    background: scrolled ? GlobalStyles.colors.darkBlue : 'linear-gradient(to right, #0D47A1, #1976D2)',
    color: GlobalStyles.colors.white,
    boxShadow: scrolled ? GlobalStyles.boxShadow.md : 'none',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease',
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: GlobalStyles.container.maxWidth,
    padding: '0 24px',
    margin: '0 auto',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: GlobalStyles.colors.white,
    fontFamily: GlobalStyles.typography.headingFontFamily,
    fontWeight: 'bold',
    fontSize: '24px',
  };

  const navLinksStyle = {
    display: "flex",
    alignItems: "center",
    gap: '10px',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  };

  const linkStyle = {
    margin: "0 10px",
    color: GlobalStyles.colors.white,
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: GlobalStyles.borderRadius.sm,
    fontWeight: '500',
    fontSize: '16px',
    transition: "all 0.3s",
    position: 'relative',
    ':hover': {
      backgroundColor: "rgba(255,255,255,0.1)",
    },
  };

  const activeLinkStyle = {
    ...linkStyle,
    fontWeight: '600',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      left: '0',
      width: '100%',
      height: '3px',
      background: GlobalStyles.colors.secondary,
      borderRadius: '3px 3px 0 0',
    },
  };

  const userSectionStyle = {
    display: "flex",
    alignItems: "center",
  };

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginRight: '15px',
  };

  const userAvatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: GlobalStyles.colors.lightBlue,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: GlobalStyles.colors.darkBlue,
    fontWeight: 'bold',
    fontSize: '16px',
  };

  const buttonStyle = {
    background: "transparent",
    border: `2px solid ${GlobalStyles.colors.white}`,
    color: GlobalStyles.colors.white,
    padding: "8px 16px",
    borderRadius: GlobalStyles.borderRadius.md,
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: "all 0.3s",
  };

  const loginButtonStyle = {
    background: GlobalStyles.colors.white,
    color: GlobalStyles.colors.primary,
    border: 'none',
    padding: "8px 16px",
    borderRadius: GlobalStyles.borderRadius.md,
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: '500',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    margin: '0 10px',
    transition: "all 0.3s",
  };

  const registerButtonStyle = {
    background: GlobalStyles.colors.secondary,
    color: GlobalStyles.colors.white,
    border: 'none',
    padding: "8px 16px",
    borderRadius: GlobalStyles.borderRadius.md,
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: '500',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: "all 0.3s",
  };

  // Mobile menu button style
  const mobileMenuButtonStyle = {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: GlobalStyles.colors.white,
    fontSize: '24px',
    cursor: 'pointer',
    '@media (max-width: 768px)': {
      display: 'block',
    },
  };

  // Mobile menu styles
  const mobileMenuStyle = {
    display: mobileMenuOpen ? 'flex' : 'none',
    position: 'fixed',
    top: scrolled ? '56px' : '84px',
    left: 0,
    right: 0,
    background: GlobalStyles.colors.darkBlue,
    flexDirection: 'column',
    padding: '20px',
    transition: 'all 0.3s ease',
    zIndex: 999,
  };

  const mobileLinkStyle = {
    color: GlobalStyles.colors.white,
    textDecoration: 'none',
    padding: '12px',
    borderBottom: `1px solid ${GlobalStyles.colors.primary}`,
    fontSize: '16px',
    fontWeight: '500',
    width: '100%',
    textAlign: 'center',
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          <i className="fas fa-umbrella-beach" style={{ fontSize: '28px', color: GlobalStyles.colors.secondary }}></i>
          <span>Columbus Vacations</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu} 
          style={mobileMenuButtonStyle} 
          aria-label="Toggle menu"
        >
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>

        {/* Desktop Navigation Links */}
        <div style={navLinksStyle}>
          <Link 
            to="/" 
            style={isActive('/') ? activeLinkStyle : linkStyle}
          >
            <i className="fas fa-home" style={{ marginRight: '6px' }}></i>
            Home
          </Link>
          
          {/* Show Hotels link only to authenticated users */}
          {authState.isAuthenticated && (
            <Link 
              to="/hotels" 
              style={isActive('/hotels') ? activeLinkStyle : linkStyle}
            >
              <i className="fas fa-hotel" style={{ marginRight: '6px' }}></i>
              Hotels
            </Link>
          )}
          
          {/* Admin-only links */}
          {authState.role === "ADMIN" && (
            <>
              <Link 
                to="/add-hotel" 
                style={isActive('/add-hotel') ? activeLinkStyle : linkStyle}
              >
                <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i>
                Add Hotel
              </Link>
              <Link 
                to="/user-approval" 
                style={isActive('/user-approval') ? activeLinkStyle : linkStyle}
              >
                <i className="fas fa-user-check" style={{ marginRight: '6px' }}></i>
                Approvals
              </Link>
              <Link 
                to="/travel-agents" 
                style={isActive('/travel-agents') ? activeLinkStyle : linkStyle}
              >
                <i className="fas fa-users" style={{ marginRight: '6px' }}></i>
                Agents
              </Link>
            </>
          )}
        </div>
        
        {/* User Section / Auth Buttons */}
        <div style={userSectionStyle}>
          {authState.isAuthenticated ? (
            <>
              <div style={userInfoStyle}>
                <div style={userAvatarStyle}>
                  {authState.user?.userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {authState.user?.userName || "User"}
                </span>
              </div>
              <button 
                onClick={handleLogout}
                style={buttonStyle}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                style={loginButtonStyle}
                onMouseOver={(e) => {
                  e.target.style.background = "#e0e0e0";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = GlobalStyles.colors.white;
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
              <Link 
                to="/register" 
                style={registerButtonStyle}
                onMouseOver={(e) => {
                  e.target.style.background = "#F57C00";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = GlobalStyles.colors.secondary;
                }}
              >
                <i className="fas fa-user-plus"></i>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={mobileMenuStyle}>
        <Link 
          to="/" 
          style={mobileLinkStyle}
          onClick={() => setMobileMenuOpen(false)}
        >
          <i className="fas fa-home" style={{ marginRight: '10px' }}></i>
          Home
        </Link>
        
        {authState.isAuthenticated && (
          <Link 
            to="/hotels" 
            style={mobileLinkStyle}
            onClick={() => setMobileMenuOpen(false)}
          >
            <i className="fas fa-hotel" style={{ marginRight: '10px' }}></i>
            Hotels
          </Link>
        )}
        
        {authState.role === "ADMIN" && (
          <>
            <Link 
              to="/add-hotel" 
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-plus-circle" style={{ marginRight: '10px' }}></i>
              Add Hotel
            </Link>
            <Link 
              to="/user-approval" 
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-user-check" style={{ marginRight: '10px' }}></i>
              User Approvals
            </Link>
            <Link 
              to="/travel-agents" 
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-users" style={{ marginRight: '10px' }}></i>
              Travel Agents
            </Link>
          </>
        )}
        
        {!authState.isAuthenticated ? (
          <>
            <Link 
              to="/login" 
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-sign-in-alt" style={{ marginRight: '10px' }}></i>
              Login
            </Link>
            <Link 
              to="/register" 
              style={mobileLinkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="fas fa-user-plus" style={{ marginRight: '10px' }}></i>
              Register
            </Link>
          </>
        ) : (
          <button 
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            style={{
              ...mobileLinkStyle,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ marginRight: '10px' }}></i>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

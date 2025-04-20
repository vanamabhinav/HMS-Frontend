import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalStyles from "../styles/GlobalStyles";

function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedHotel, setExpandedHotel] = useState(null);
  const isAuthenticated = localStorage.getItem("token") !== null;
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch hotels if user is authenticated
    if (isAuthenticated) {
      fetchHotels();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchHotels = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };
      // We'll only fetch a preview of hotels (top 5) for the home page
      const response = await axios.get("https://hms-columbus-vacation-backend-production.up.railway.app/hotels/all", config);
      setHotels(response.data.slice(0, 5)); // Only show first 5 hotels as preview
      setLoading(false);
    } catch (error) {
      setError("Error fetching hotels.");
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (!isAuthenticated) return;
    
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      fetchHotels();
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      };
      const response = await axios.get(`https://hms-columbus-vacation-backend-production.up.railway.app/hotels/search?name=${e.target.value}`, config);
      setHotels(response.data.slice(0, 5)); // Only show first 5 matching hotels
    } catch (error) {
      setError("Error searching hotels.");
    }
  };

  const handleViewAllHotels = () => {
    if (isAuthenticated) {
      navigate("/hotels");
    } else {
      navigate("/login");
    }
  };

  // Styles
  const heroStyle = {
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "600px",
    color: GlobalStyles.colors.white,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "0 20px",
    textAlign: "center",
    position: "relative",
  };

  const titleStyle = {
    fontSize: "48px",
    fontWeight: "700",
    margin: "0 0 20px 0",
    fontFamily: GlobalStyles.typography.headingFontFamily,
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
  };

  const subtitleStyle = {
    fontSize: "22px",
    fontWeight: "400",
    marginBottom: "30px",
    maxWidth: "700px",
    lineHeight: "1.5",
    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
  };

  const searchContainerStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "700px",
    gap: "15px",
  };

  const searchBoxStyle = {
    padding: "16px 24px",
    fontSize: "18px",
    borderRadius: "50px",
    border: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    width: "100%",
  };

  const viewAllButtonStyle = {
    background: GlobalStyles.colors.secondary,
    color: GlobalStyles.colors.white,
    border: "none",
    padding: "16px 32px",
    borderRadius: "50px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "auto",
    minWidth: "200px",
    alignSelf: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  };

  const actionButtonsStyle = {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    marginTop: "30px",
  };

  const contentSectionStyle = {
    padding: "80px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const featuredHotelsSection = {
    background: GlobalStyles.colors.white,
    padding: "80px 20px",
  };

  const sectionTitleStyle = {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "20px",
    textAlign: "center",
    color: GlobalStyles.colors.darkBlue,
    fontFamily: GlobalStyles.typography.headingFontFamily,
  };

  const sectionDescriptionStyle = {
    fontSize: "18px",
    color: GlobalStyles.colors.gray,
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 40px auto",
    lineHeight: "1.6",
  };

  const hotelCardStyle = {
    background: GlobalStyles.colors.white,
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    marginBottom: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const hotelHeaderStyle = {
    padding: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: expandedHotel ? `1px solid ${GlobalStyles.colors.lightGray}` : "none",
    transition: "all 0.3s ease",
  };

  const hotelDetailsStyle = {
    padding: "20px",
    backgroundColor: GlobalStyles.colors.sand,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const badgeStyle = {
    display: "inline-block",
    background: GlobalStyles.colors.secondary,
    color: GlobalStyles.colors.white,
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "10px 0",
  };

  const viewDetailsButtonStyle = {
    background: GlobalStyles.colors.primary,
    color: GlobalStyles.colors.white,
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: "15px",
    transition: "all 0.3s ease",
  };

  const featureGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    margin: "60px 0",
  };

  const featureCardStyle = {
    background: GlobalStyles.colors.white,
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const featureIconStyle = {
    fontSize: "50px",
    color: GlobalStyles.colors.primary,
    marginBottom: "20px",
  };

  const featureTitleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: GlobalStyles.colors.black,
  };

  const featureDescriptionStyle = {
    color: GlobalStyles.colors.gray,
    lineHeight: "1.6",
  };

  // Content for non-authenticated users
  const renderWelcomePage = () => {
    return (
      <>
        {/* Hero Section */}
        <div style={heroStyle}>
          <h1 style={titleStyle}>Discover Extraordinary Destinations</h1>
          <p style={subtitleStyle}>
            Columbus Vacations is your gateway to seamless hotel management and booking experiences across the globe.
          </p>
          <div style={actionButtonsStyle}>
            <Link
              to="/login"
              style={{
                ...viewAllButtonStyle,
                background: GlobalStyles.colors.white,
                color: GlobalStyles.colors.darkBlue,
              }}
            >
              <i className="fas fa-sign-in-alt" style={{ marginRight: "10px" }}></i>
              Login
            </Link>
            <Link
              to="/register"
              style={viewAllButtonStyle}
            >
              <i className="fas fa-user-plus" style={{ marginRight: "10px" }}></i>
              Register
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div style={contentSectionStyle}>
          <h2 style={sectionTitleStyle}>Why Choose Columbus Vacations?</h2>
          <p style={sectionDescriptionStyle}>
            Our platform offers comprehensive hotel management solutions designed for travel professionals.
          </p>

          <div style={featureGridStyle}>
            <div style={featureCardStyle}>
              <i className="fas fa-hotel" style={featureIconStyle}></i>
              <h3 style={featureTitleStyle}>Extensive Hotel Network</h3>
              <p style={featureDescriptionStyle}>
                Access our carefully curated database of hotels across various locations worldwide.
              </p>
            </div>

            <div style={featureCardStyle}>
              <i className="fas fa-search" style={featureIconStyle}></i>
              <h3 style={featureTitleStyle}>Powerful Search Tools</h3>
              <p style={featureDescriptionStyle}>
                Find the perfect accommodation by searching by name, city, or state with our intuitive search functionality.
              </p>
            </div>

            <div style={featureCardStyle}>
              <i className="fas fa-star" style={featureIconStyle}></i>
              <h3 style={featureTitleStyle}>Preferred Partner Program</h3>
              <p style={featureDescriptionStyle}>
                Easily identify our premium partner hotels for the best quality and service guarantees.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <p style={{ fontSize: "18px", marginBottom: "20px", color: GlobalStyles.colors.gray }}>
              Ready to explore our hotel database? Register today to get started.
            </p>
            <Link
              to="/register"
              style={{
                ...viewAllButtonStyle,
                background: GlobalStyles.colors.primary,
                display: "inline-block",
              }}
            >
              Create Your Account Today
            </Link>
          </div>
        </div>
        
        {/* Testimonial Section */}
        <div style={{ 
          background: "linear-gradient(rgba(13, 71, 161, 0.9), rgba(13, 71, 161, 0.9)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 20px",
          color: GlobalStyles.colors.white,
          textAlign: "center",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ ...sectionTitleStyle, color: GlobalStyles.colors.white, marginBottom: "40px" }}>
              Trusted by Travel Professionals
            </h2>
            <p style={{ 
              fontSize: "24px", 
              fontStyle: "italic",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}>
              "Columbus Vacations has revolutionized our hotel booking process, making it seamless to find and manage accommodations for our clients."
            </p>
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>
              - Sarah Johnson, Travel Agent
            </div>
          </div>
        </div>
      </>
    );
  };

  // Content for authenticated users
  const renderAuthenticatedView = () => {
    return (
      <>
        {/* Hero Section */}
        <div style={{
          ...heroStyle,
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80')"
        }}>
          <h1 style={titleStyle}>Find Your Perfect Hotel</h1>
          <p style={subtitleStyle}>
            Discover accommodations that meet your clients' exact needs with our powerful search tools.
          </p>
          <div style={searchContainerStyle}>
            <input
              type="text"
              style={searchBoxStyle}
              placeholder="🔍 Search for hotels by name..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <button 
              onClick={handleViewAllHotels}
              style={viewAllButtonStyle}
            >
              View All Hotels
            </button>
          </div>
        </div>

        {/* Featured Hotels Section */}
        <div style={featuredHotelsSection}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={sectionTitleStyle}>Featured Hotels</h2>
            <p style={sectionDescriptionStyle}>
              Here's a preview of our available hotels. Click 'View Details' to see more information.
            </p>

            {loading && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: "40px", color: GlobalStyles.colors.primary }}></i>
                <p style={{ marginTop: "20px", color: GlobalStyles.colors.gray }}>Loading hotels...</p>
              </div>
            )}
            
            {error && (
              <div style={{ 
                background: "#FFEBEE", 
                color: "#C62828", 
                padding: "15px", 
                borderRadius: "8px", 
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto"
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: "10px" }}></i>
                {error}
              </div>
            )}

            {/* Hotel List */}
            <div style={{ marginTop: "40px" }}>
              {hotels.length > 0 ? (
                <>
                  {hotels.map((hotel) => (
                    <div 
                      key={hotel.id} 
                      style={{
                        ...hotelCardStyle,
                        transform: expandedHotel === hotel.id ? "translateY(-5px)" : "none",
                        boxShadow: expandedHotel === hotel.id ? "0 8px 16px rgba(0,0,0,0.1)" : "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div 
                        style={hotelHeaderStyle} 
                        onClick={() => setExpandedHotel(expandedHotel === hotel.id ? null : hotel.id)}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <i className="fas fa-hotel" style={{ 
                            fontSize: "24px", 
                            color: GlobalStyles.colors.primary,
                            marginRight: "15px" 
                          }}></i>
                          <h3 style={{ margin: 0, fontWeight: "600" }}>{hotel.hotelName}</h3>
                          {hotel.preferred && (
                            <span style={{ 
                              background: GlobalStyles.colors.secondary,
                              color: "white",
                              fontSize: "12px",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              marginLeft: "10px"
                            }}>
                              <i className="fas fa-star" style={{ marginRight: "5px" }}></i>
                              Preferred
                            </span>
                          )}
                        </div>
                        <i className={`fas fa-chevron-${expandedHotel === hotel.id ? "up" : "down"}`} style={{ 
                          color: GlobalStyles.colors.gray,
                          transition: "transform 0.3s ease"
                        }}></i>
                      </div>

                      {expandedHotel === hotel.id && (
                        <div style={hotelDetailsStyle}>
                          <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <i className="fas fa-map-marker-alt" style={{ color: GlobalStyles.colors.primary }}></i>
                            <span><strong>Location:</strong> {hotel.address}, {hotel.city}, {hotel.state}</span>
                          </p>
                          <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <i className="fas fa-envelope" style={{ color: GlobalStyles.colors.primary }}></i>
                            <span><strong>Email:</strong> {hotel.email1}</span>
                          </p>
                          <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <i className="fas fa-phone" style={{ color: GlobalStyles.colors.primary }}></i>
                            <span><strong>Contact:</strong> {hotel.mobilePhoneContact}</span>
                          </p>
                          <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <i className="fas fa-user" style={{ color: GlobalStyles.colors.primary }}></i>
                            <span><strong>Manager:</strong> {hotel.concerningPersonName}</span>
                          </p>
                          
                          <Link 
                            to={`/hotels/${hotel.id}`} 
                            style={{
                              ...viewDetailsButtonStyle,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "8px",
                              alignSelf: "flex-start",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = GlobalStyles.colors.darkBlue;
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = GlobalStyles.colors.primary;
                            }}
                          >
                            <i className="fas fa-info-circle"></i>
                            View Full Details
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <button 
                      onClick={handleViewAllHotels}
                      style={{
                        ...viewAllButtonStyle,
                        background: GlobalStyles.colors.primary,
                      }}
                    >
                      <i className="fas fa-list" style={{ marginRight: "10px" }}></i>
                      View All Hotels
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ 
                  textAlign: "center", 
                  padding: "40px", 
                  background: GlobalStyles.colors.sand,
                  borderRadius: "10px"
                }}>
                  <i className="fas fa-search" style={{ 
                    fontSize: "40px", 
                    color: GlobalStyles.colors.gray,
                    marginBottom: "20px"
                  }}></i>
                  <p style={{ color: GlobalStyles.colors.gray, fontSize: "18px" }}>No hotels found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div style={{ 
          background: `linear-gradient(135deg, ${GlobalStyles.colors.primary} 0%, ${GlobalStyles.colors.darkBlue} 100%)`,
          padding: "60px 20px",
          textAlign: "center",
          color: GlobalStyles.colors.white
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Quick Actions</h2>
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              justifyContent: "center",
              gap: "20px", 
              marginTop: "30px" 
            }}>
              <Link to="/hotels" style={{
                background: "rgba(255, 255, 255, 0.1)",
                color: GlobalStyles.colors.white,
                padding: "20px",
                borderRadius: "10px",
                width: "200px",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.3s ease",
              }}>
                <i className="fas fa-search" style={{ fontSize: "30px", marginBottom: "15px" }}></i>
                <span>Search All Hotels</span>
              </Link>
              
              {localStorage.getItem("role") === "ADMIN" && (
                <>
                  <Link to="/add-hotel" style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: GlobalStyles.colors.white,
                    padding: "20px",
                    borderRadius: "10px",
                    width: "200px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                  }}>
                    <i className="fas fa-plus-circle" style={{ fontSize: "30px", marginBottom: "15px" }}></i>
                    <span>Add New Hotel</span>
                  </Link>
                  
                  <Link to="/user-approval" style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: GlobalStyles.colors.white,
                    padding: "20px",
                    borderRadius: "10px",
                    width: "200px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                  }}>
                    <i className="fas fa-user-check" style={{ fontSize: "30px", marginBottom: "15px" }}></i>
                    <span>Approve Users</span>
                  </Link>
                  
                  <Link to="/travel-agents" style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: GlobalStyles.colors.white,
                    padding: "20px",
                    borderRadius: "10px",
                    width: "200px",
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transition: "all 0.3s ease",
                  }}>
                    <i className="fas fa-users" style={{ fontSize: "30px", marginBottom: "15px" }}></i>
                    <span>View Travel Agents</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  return isAuthenticated ? renderAuthenticatedView() : renderWelcomePage();
}

export default Home;

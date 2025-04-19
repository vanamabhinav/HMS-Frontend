import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GlobalStyles from "../styles/GlobalStyles";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [expandedHotel, setExpandedHotel] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  // Fetch all hotels on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchHotels = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get("https://hms-columbus-vacation-backend-production.up.railway.app/hotels/all", config);
        setHotels(response.data);
        setFilteredHotels(response.data);

        // Extract unique states and cities
        const states = [...new Set(response.data.map((hotel) => hotel.state))].filter(Boolean).sort();
        setAvailableStates(states);
        
        const cities = [...new Set(response.data.map((hotel) => hotel.city))].filter(Boolean).sort();
        setAvailableCities(cities);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setError("Failed to fetch hotels. Please try again later.");
        setLoading(false);
      }
    };

    fetchHotels();
  }, [navigate]);

  // Filter hotels based on search query, state, and city
  useEffect(() => {
    let results = hotels;

    if (searchQuery) {
      results = results.filter((hotel) =>
        hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedState) {
      results = results.filter((hotel) => hotel.state === selectedState);
    }

    if (selectedCity) {
      results = results.filter((hotel) => hotel.city === selectedCity);
    }

    setFilteredHotels(results);
  }, [searchQuery, selectedState, selectedCity, hotels]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity(""); // Reset city when state changes
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedCity("");
    setFilteredHotels(hotels);
  };

  const toggleExpand = (hotelId) => {
    setExpandedHotel(expandedHotel === hotelId ? null : hotelId);
  };

  const deleteHotel = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        await axios.delete(`https://hms-columbus-vacation-backend-production.up.railway.app/hotels/${hotelId}`, config);
        setHotels(hotels.filter((hotel) => hotel.id !== hotelId));
        setFilteredHotels(filteredHotels.filter((hotel) => hotel.id !== hotelId));
      } catch (error) {
        console.error("Error deleting hotel:", error);
        setError("Failed to delete hotel. Please try again.");
      }
    }
  };

  // Styles
  const pageContainer = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  };

  const headerSection = {
    background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    padding: "60px 20px",
    textAlign: "center",
    borderRadius: "0 0 10px 10px",
    marginBottom: "40px",
  };

  const pageTitle = {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "20px",
    fontFamily: GlobalStyles.typography.headingFontFamily,
  };

  const pageDescription = {
    fontSize: "18px",
    maxWidth: "800px",
    margin: "0 auto 30px",
    lineHeight: "1.6",
  };

  const filtersContainer = {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "30px",
    justifyContent: "center",
    alignItems: "flex-end",
  };

  const filterGroup = {
    flexGrow: "1",
    minWidth: "200px",
    maxWidth: "300px",
  };

  const filterLabel = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    color: GlobalStyles.colors.darkBlue,
  };

  const filterInput = {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: `1px solid ${GlobalStyles.colors.lightGray}`,
    fontSize: "16px",
  };

  const buttonStyle = {
    backgroundColor: GlobalStyles.colors.primary,
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  };

  const clearButton = {
    ...buttonStyle,
    backgroundColor: GlobalStyles.colors.gray,
  };

  const addButton = {
    ...buttonStyle,
    backgroundColor: GlobalStyles.colors.secondary,
    marginBottom: "30px",
    marginLeft: "auto",
    textDecoration: "none",
    display: "inline-flex",
  };

  const resultsInfo = {
    margin: "20px 0",
    fontWeight: "500",
    color: GlobalStyles.colors.gray,
  };

  const hotelCard = {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
    marginBottom: "20px",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  const hotelHeader = {
    padding: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f0f0f0",
  };

  const hotelName = {
    margin: "0",
    fontSize: "20px",
    fontWeight: "600",
    color: GlobalStyles.colors.darkBlue,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const hotelContent = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
    backgroundColor: GlobalStyles.colors.sand,
  };

  const infoGroup = {
    marginBottom: "15px",
  };

  const infoLabel = {
    fontWeight: "bold",
    color: GlobalStyles.colors.darkBlue,
    marginBottom: "5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const infoValue = {
    color: GlobalStyles.colors.gray,
    lineHeight: "1.4",
  };

  const actionsContainer = {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    gridColumn: "1 / -1",
  };

  const actionButton = {
    ...buttonStyle,
    padding: "10px 15px",
    fontSize: "14px",
    flex: "1",
    maxWidth: "150px",
  };

  const deleteButton = {
    ...actionButton,
    backgroundColor: "#e53935",
  };

  const editButton = {
    ...actionButton,
    backgroundColor: GlobalStyles.colors.darkBlue,
  };

  const preferredBadge = {
    display: "inline-block",
    backgroundColor: GlobalStyles.colors.secondary,
    color: "white",
    fontSize: "12px",
    padding: "3px 8px",
    borderRadius: "12px",
    marginLeft: "10px",
  };

  const loadingContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 0",
  };

  const emptyResults = {
    textAlign: "center",
    padding: "40px 0",
    color: GlobalStyles.colors.gray,
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <div style={loadingContainer}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: "40px", color: GlobalStyles.colors.primary, marginBottom: "20px" }}></i>
          <h2>Loading Hotels...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={headerSection}>
        <div style={pageContainer}>
          <h1 style={pageTitle}>Hotel Directory</h1>
          <p style={pageDescription}>
            Browse our comprehensive database of hotels. Use the filters below to find specific accommodations based on your requirements.
          </p>
        </div>
      </div>

      <div style={pageContainer}>
        {/* Filters Section */}
        <div style={filtersContainer}>
          <div style={filterGroup}>
            <label style={filterLabel}>Search by Name</label>
            <input
              type="text"
              style={filterInput}
              placeholder="Hotel name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div style={filterGroup}>
            <label style={filterLabel}>Filter by State</label>
            <select
              style={filterInput}
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="">All States</option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div style={filterGroup}>
            <label style={filterLabel}>Filter by City</label>
            <select
              style={filterInput}
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!availableCities.length}
            >
              <option value="">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            style={clearButton}
            onClick={handleClearFilters}
          >
            <i className="fas fa-times"></i> Clear Filters
          </button>
        </div>

        {/* Admin Add Hotel Button */}
        {isAdmin && (
          <Link to="/add-hotel" style={addButton}>
            <i className="fas fa-plus"></i> Add New Hotel
          </Link>
        )}

        {/* Results Section */}
        <div style={resultsInfo}>
          {filteredHotels.length} {filteredHotels.length === 1 ? "hotel" : "hotels"} found
        </div>

        {error && (
          <div style={{ 
            background: "#FFEBEE", 
            color: "#C62828", 
            padding: "15px", 
            borderRadius: "8px", 
            marginBottom: "20px" 
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: "10px" }}></i>
            {error}
          </div>
        )}

        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              style={{
                ...hotelCard,
                transform: expandedHotel === hotel.id ? "translateY(-5px)" : "none",
                boxShadow: expandedHotel === hotel.id ? "0 8px 20px rgba(0,0,0,0.1)" : "0 3px 10px rgba(0,0,0,0.08)",
              }}
            >
              <div style={hotelHeader} onClick={() => toggleExpand(hotel.id)}>
                <h3 style={hotelName}>
                  <i className="fas fa-hotel" style={{ color: GlobalStyles.colors.primary }}></i>
                  {hotel.hotelName}
                  {hotel.preferred && (
                    <span style={preferredBadge}>
                      <i className="fas fa-star" style={{ marginRight: "5px" }}></i>
                      Preferred
                    </span>
                  )}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{ color: GlobalStyles.colors.gray, fontSize: "14px" }}>
                    {hotel.city}, {hotel.state}
                  </span>
                  <i
                    className={`fas fa-chevron-${
                      expandedHotel === hotel.id ? "up" : "down"
                    }`}
                    style={{ color: GlobalStyles.colors.gray }}
                  ></i>
                </div>
              </div>

              {expandedHotel === hotel.id && (
                <div style={hotelContent}>
                  <div style={infoGroup}>
                    <div style={infoLabel}>
                      <i className="fas fa-map-marker-alt" style={{ color: GlobalStyles.colors.primary }}></i>
                      Address
                    </div>
                    <div style={infoValue}>{hotel.address}</div>
                  </div>

                  <div style={infoGroup}>
                    <div style={infoLabel}>
                      <i className="fas fa-envelope" style={{ color: GlobalStyles.colors.primary }}></i>
                      Email
                    </div>
                    <div style={infoValue}>{hotel.email1}</div>
                    {hotel.email2 && <div style={infoValue}>{hotel.email2}</div>}
                  </div>

                  <div style={infoGroup}>
                    <div style={infoLabel}>
                      <i className="fas fa-phone" style={{ color: GlobalStyles.colors.primary }}></i>
                      Phone
                    </div>
                    <div style={infoValue}>{hotel.mobilePhoneContact}</div>
                    {hotel.landlineContact && <div style={infoValue}>{hotel.landlineContact}</div>}
                  </div>

                  <div style={infoGroup}>
                    <div style={infoLabel}>
                      <i className="fas fa-user" style={{ color: GlobalStyles.colors.primary }}></i>
                      Contact Person
                    </div>
                    <div style={infoValue}>{hotel.concerningPersonName}</div>
                  </div>

                  <div style={actionsContainer}>
                    <Link
                      to={`/hotels/${hotel.id}`}
                      style={actionButton}
                    >
                      <i className="fas fa-info-circle"></i> Details
                    </Link>

                    {isAdmin && (
                      <>
                        <Link
                          to={`/edit-hotel/${hotel.id}`}
                          style={editButton}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Link>
                        <button
                          style={deleteButton}
                          onClick={() => deleteHotel(hotel.id)}
                        >
                          <i className="fas fa-trash-alt"></i> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={emptyResults}>
            <i className="fas fa-search" style={{ fontSize: "40px", color: GlobalStyles.colors.lightGray, marginBottom: "20px" }}></i>
            <h3>No hotels found matching your criteria</h3>
            <p>Try adjusting your filters or search query</p>
            <button
              style={{
                ...buttonStyle,
                margin: "20px auto 0",
                display: "inline-flex",
              }}
              onClick={handleClearFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hotels;

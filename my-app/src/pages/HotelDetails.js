import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = !!token;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://hms-columbus-vacation-backend-production.up.railway.app/hotels/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHotel(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError("Authentication required. Please log in to view hotel details.");
          navigate("/login");
        } else {
          setError(
            error.response?.status === 404
              ? "Hotel not found"
              : "Failed to load hotel details. Please try again later."
          );
        }
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id, token, isLoggedIn, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await axios.delete(`https://hms-columbus-vacation-backend-production.up.railway.app/hotels/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Hotel deleted successfully!");
        navigate("/hotels");
      } catch (error) {
        console.error("Error deleting hotel:", error);
        alert("Failed to delete hotel. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "100px 0" }}>
        <div
          style={{
            display: "inline-block",
            width: "50px",
            height: "50px",
            border: "5px solid #f3f3f3",
            borderTop: "5px solid #2c3e50",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "50px auto",
          padding: "20px",
          backgroundColor: "#ffebee",
          color: "#c62828",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h2>Error</h2>
        <p>{error}</p>
        <Link
          to="/hotels"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#2c3e50",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          Back to Hotels
        </Link>
      </div>
    );
  }

  if (!hotel) {
    return null;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Link
          to="/hotels"
          style={{
            color: "#2c3e50",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          ← Back to Hotels
        </Link>
        {role === "ADMIN" && (
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#e53935",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete Hotel
          </button>
        )}
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: "#2c3e50",
            color: "white",
            padding: "30px",
            position: "relative",
          }}
        >
          <h1 style={{ margin: "0", fontSize: "28px" }}>{hotel.hotelName}</h1>
          {hotel.preferred && (
            <span
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                backgroundColor: "#ff9800",
                color: "white",
                padding: "5px 10px",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              Preferred Hotel
            </span>
          )}
        </div>

        <div style={{ padding: "30px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "30px",
            }}
          >
            <div>
              <h3 style={{ color: "#2c3e50", marginTop: "0" }}>Contact Information</h3>
              <InfoItem label="Primary Email" value={hotel.email1} />
              {hotel.email2 && <InfoItem label="Secondary Email" value={hotel.email2} />}
              <InfoItem label="Mobile Phone" value={hotel.mobilePhoneContact} />
              {hotel.landlineContact && (
                <InfoItem label="Landline" value={hotel.landlineContact} />
              )}
              {hotel.website && (
                <InfoItem 
                  label="Website" 
                  value={
                    <a 
                      href={hotel.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: "#2c3e50", textDecoration: "none" }}
                    >
                      {hotel.website}
                    </a>
                  } 
                />
              )}
              <InfoItem label="Concerning Person" value={hotel.concerningPersonName} />
            </div>

            <div>
              <h3 style={{ color: "#2c3e50", marginTop: "0" }}>Location</h3>
              <p style={{ lineHeight: "1.6", whiteSpace: "pre-line" }}>{hotel.address}</p>
              <p style={{ lineHeight: "1.6", marginTop: "10px" }}>
                <strong>City:</strong> {hotel.city}<br />
                <strong>State:</strong> {hotel.state}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for information items
const InfoItem = ({ label, value }) => (
  <div style={{ marginBottom: "10px" }}>
    <strong style={{ color: "#546e7a" }}>{label}:</strong>{" "}
    <span>{value}</span>
  </div>
);

export default HotelDetails;

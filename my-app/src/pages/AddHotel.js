import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  Tab, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert,
  Box,
  Link
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";

const AddHotel = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    email1: "",
    email2: "",
    address: "",
    mobilePhoneContact: "",
    landlineContact: "",
    concerningPersonName: "",
    preferred: false,
    city: "",
    state: "",
    website: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [csvFile, setCsvFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "ADMIN") {
      navigate("/login");
    }
    console.log("Current token:", token);
    console.log("Current role:", role);
  }, [token, role, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!token) {
      setError("No authentication token found. Please login again.");
      navigate("/login");
      return;
    }

    // Validate required fields
    const requiredFields = {
      hotelName: "Hotel name",
      email1: "Primary email",
      address: "Address",
      mobilePhoneContact: "Mobile phone contact",
      concerningPersonName: "Concerning person name",
      city: "City",
      state: "State"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]?.trim()) {
        setError(`${label} is required`);
        setLoading(false);
        return;
      }
    }

    // Validate website URL if provided
    if (formData.website && !formData.website.startsWith('http://') && !formData.website.startsWith('https://')) {
      setError("Website URL must start with http:// or https://");
      setLoading(false);
      return;
    }

    try {
      const hotelData = {
        hotelName: formData.hotelName.trim(),
        email1: formData.email1.trim(),
        email2: formData.email2.trim() || null,
        address: formData.address.trim(),
        mobilePhoneContact: formData.mobilePhoneContact.trim(),
        landlineContact: formData.landlineContact.trim() || null,
        concerningPersonName: formData.concerningPersonName.trim(),
        preferred: Boolean(formData.preferred),
        city: formData.city.trim(),
        state: formData.state.trim(),
        website: formData.website.trim() || null
      };

      console.log("Sending hotel data:", hotelData);
      
      const response = await axios({
        method: 'post',
        url: 'https://hms-columbus-vacation-backend-production.up.railway.app/hotels/add',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: hotelData
      });

      console.log("Server response:", response);

      if (response.data) {
        setSuccess("Hotel added successfully!");
        setFormData({
          hotelName: "",
          email1: "",
          email2: "",
          address: "",
          mobilePhoneContact: "",
          landlineContact: "",
          concerningPersonName: "",
          preferred: false,
          city: "",
          state: "",
          website: ""
        });
      navigate("/");
      }
    } catch (error) {
      console.error("Error adding hotel:", error);
      
      if (!error.response) {
        setError("Network error: Unable to connect to the server. Please check if the backend is running.");
        console.log("Network Error Details:", {
          message: error.message,
          config: error.config
        });
        return;
      }

      switch (error.response.status) {
        case 401:
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("user");
          navigate("/login");
          break;
        case 403:
          setError("You don't have permission to add hotels. Please login as admin.");
          navigate("/login");
          break;
        case 400: {
          // Try to extract a more detailed error message
          let message;
          if (typeof error.response.data === 'string') {
            message = error.response.data;
          } else if (error.response.data?.message) {
            message = error.response.data.message;
          } else {
            message = 'Please check your input';
          }
          
          // Check for common constraint violations
          if (message.includes("already exists") || 
              message.includes("duplicate") || 
              message.includes("unique")) {
            setError(`Validation Error: ${message}. Please use different values for hotel name, email, or phone number.`);
          } else {
            setError(`Validation Error: ${message}`);
          }
          break;
        }
        default: {
          const message = error.response.data?.message || 'Something went wrong';
          setError(`Server Error: ${message}`);
        }
      }

      console.log("Detailed error:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Accept CSV files with various content types
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
      const isValidType = validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv');
      
      if (isValidType) {
        setCsvFile(selectedFile);
        setError("");
        console.log("Selected file:", selectedFile.name, "Type:", selectedFile.type);
      } else {
        setError(`Please select a valid CSV file. Selected: ${selectedFile.type}`);
        setCsvFile(null);
      }
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      console.log("Uploading CSV file:", csvFile.name, "Type:", csvFile.type);
      
      const response = await axios({
        method: 'post',
        url: 'https://hms-columbus-vacation-backend-production.up.railway.app/hotels/upload-csv',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type here, it will be automatically set with the boundary
        },
        data: formData
      });

      console.log("CSV upload response:", response.data);

      if (response.data) {
        const hotelCount = response.data.hotels ? response.data.hotels.length : 0;
        setSuccess(`Successfully uploaded ${hotelCount} hotels`);
        setCsvFile(null);
        // Reset the file input
        const fileInput = document.getElementById('csv-upload');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error("CSV upload error:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const generateCsvTemplate = () => {
    const headers = "hotelName,email1,email2,address,mobilePhoneContact,landlineContact,concerningPersonName,preferred,city,state,website";
    const sampleData = "Example Hotel,hotel@example.com,secondary@example.com,123 Main St,1234567890,0987654321,John Doe,false,New York,NY,https://example.com";
    const csvContent = `${headers}\n${sampleData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hotel_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    
    if (!error.response) {
      setError("Network error: Unable to connect to the server. Please check if the backend is running.");
      return;
    }

    switch (error.response.status) {
      case 401:
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/login");
        break;
      case 403:
        setError("You don't have permission to add hotels. Please login as admin.");
        navigate("/login");
        break;
      case 400: {
        let message;
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        } else {
          message = 'Please check your input';
        }
        
        if (message.includes("already exists") || 
            message.includes("duplicate") || 
            message.includes("unique")) {
          setError(`Validation Error: ${message}. Please use different values for hotel name, email, or phone number.`);
        } else {
          setError(`Validation Error: ${message}`);
        }
        break;
      }
      default: {
        const message = error.response.data?.message || 'Something went wrong';
        setError(`Server Error: ${message}`);
      }
    }
  };

  return (
    <div style={{ 
      padding: "20px",
      maxWidth: "800px",
      margin: "0 auto",
      marginTop: "40px"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        color: "#2c3e50",
        marginBottom: "30px"
      }}>Add New Hotel</h2>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        style={{ marginBottom: "20px" }}
      >
        <Tab label="Add Single Hotel" />
        <Tab label="Bulk Upload via CSV" />
      </Tabs>

      {error && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" style={{ marginBottom: "20px" }}>
          {success}
        </Alert>
      )}

      {tabValue === 0 && (
        <form onSubmit={handleSubmit} style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input 
              type="text" 
              name="hotelName" 
              value={formData.hotelName}
              placeholder="Hotel Name" 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <input 
              type="email" 
              name="email1" 
              value={formData.email1}
              placeholder="Primary Email" 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
            <input 
              type="email" 
              name="email2" 
              value={formData.email2}
              placeholder="Secondary Email" 
              onChange={handleChange} 
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <textarea 
              name="address" 
              value={formData.address}
              placeholder="Address" 
              onChange={handleChange} 
              required 
              style={{
                ...inputStyle,
                minHeight: "100px",
                resize: "vertical"
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <input 
              type="text" 
              name="city" 
              value={formData.city}
              placeholder="City" 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
            <input 
              type="text" 
              name="state" 
              value={formData.state}
              placeholder="State" 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input 
              type="url" 
              name="website" 
              value={formData.website}
              placeholder="Website URL (https://...)" 
              onChange={handleChange} 
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <input 
              type="tel" 
              name="mobilePhoneContact" 
              value={formData.mobilePhoneContact}
              placeholder="Mobile Phone Contact" 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
            <input 
              type="tel" 
              name="landlineContact" 
              value={formData.landlineContact}
              placeholder="Landline Contact" 
              onChange={handleChange} 
              style={inputStyle}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input 
              type="text" 
              name="concerningPersonName" 
              value={formData.concerningPersonName}
              placeholder="Concerning Person Name" 
              onChange={handleChange} 
              required 
              style={inputStyle}
            />
          </div>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer"
          }}>
            <input 
              type="checkbox" 
              name="preferred" 
              checked={formData.preferred}
              onChange={handleChange} 
            />
            Preferred Hotel
        </label>
          <button 
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: "#2c3e50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontSize: "16px",
              marginTop: "15px"
            }}
          >
            {loading ? "Adding Hotel..." : "Add Hotel"}
          </button>
      </form>
      )}

      {tabValue === 1 && (
        <Paper style={{ padding: "20px", border: "1px dashed #ccc", borderRadius: "8px" }}>
          <Typography variant="h6" style={{ marginBottom: "15px" }}>
            Upload Hotels via CSV
          </Typography>
          
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: "20px" }}>
            Upload a CSV file with hotel details. The file should include the following columns:
            hotelName, email1, email2, address, mobilePhoneContact, landlineContact, 
            concerningPersonName, preferred, city, state, website
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={generateCsvTemplate}
            >
              Download Template
            </Button>
          </Box>

          <div style={{ marginBottom: "20px" }}>
            <input
              accept=".csv"
              style={{ display: "none" }}
              id="csv-upload"
              type="file"
              onChange={handleCsvFileChange}
            />
            <label htmlFor="csv-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={loading}
              >
                Select CSV File
              </Button>
            </label>
          </div>

          {csvFile && (
            <Typography variant="body2" style={{ marginBottom: "20px" }}>
              Selected file: {csvFile.name}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleCsvUpload}
            disabled={!csvFile || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </Paper>
      )}
    </div>
  );
};

const inputStyle = {
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "16px"
};

export default AddHotel;

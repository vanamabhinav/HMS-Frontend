import React, { useState } from "react";
import axios from "axios";
import "./Register.css"; // Import the CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        address: "",
        contactNumber: "",
        mobileNumber: "",
        email: "",
        userName: "",
        password: "",
        concerningPersonName: "",
        city: "",
        state: "",
        website: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("https://hms-columbus-vacation-backend-production.up.railway.app/auth/register", formData, {
                headers: { "Content-Type": "application/json" },
            });

            setSuccess("✅ Registration successful! Your account is pending admin approval. You will be able to login once approved.");
            setFormData({
                companyName: "",
                address: "",
                contactNumber: "",
                mobileNumber: "",
                email: "",
                userName: "",
                password: "",
                concerningPersonName: "",
                city: "",
                state: "",
                website: ""
            });
        } catch (error) {
            setError(error.response?.data?.message || "❌ Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" name="companyName" placeholder="🏢 Company Name" value={formData.companyName} onChange={handleChange} required />
                    <input type="text" name="address" placeholder="📍 Address" value={formData.address} onChange={handleChange} required />
                    <div className="input-group">
                        <input type="text" name="city" placeholder="🏙️ City" value={formData.city} onChange={handleChange} required />
                        <input type="text" name="state" placeholder="🏞️ State" value={formData.state} onChange={handleChange} required />
                    </div>
                    <input type="text" name="contactNumber" placeholder="☎️ Contact Number" value={formData.contactNumber} onChange={handleChange} required />
                    <input type="text" name="mobileNumber" placeholder="📱 Mobile Number" value={formData.mobileNumber} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="✉️ Email" value={formData.email} onChange={handleChange} required />
                    <input type="text" name="website" placeholder="🌐 Website" value={formData.website} onChange={handleChange} />
                    <input type="text" name="userName" placeholder="👤 Username" value={formData.userName} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="🔒 Password" value={formData.password} onChange={handleChange} required />
                    <input type="text" name="concerningPersonName" placeholder="🧑‍💼 Concerning Person Name" value={formData.concerningPersonName} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
                </form>
            </div>
        </div>
    );
};

export default Register;

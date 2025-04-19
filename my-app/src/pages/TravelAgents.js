import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function TravelAgents() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (!authState.isAuthenticated || authState.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [authState, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://hms-columbus-vacation-backend-production.up.railway.app/auth/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get('https://hms-columbus-vacation-backend-production.up.railway.app/auth/users/download-csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });
      
      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'travel_agents.csv');
      
      // Append to html page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error downloading CSV:', err);
      setError('Failed to download CSV. Please try again.');
    }
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    return (
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.companyName && user.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.state && user.state.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Styles
  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const searchContainerStyle = {
    marginBottom: '20px'
  };

  const searchInputStyle = {
    padding: '10px',
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  };

  const thStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '10px',
    textAlign: 'left'
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  };

  const statusBadgeStyle = (isApproved) => ({
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: isApproved ? '#4CAF50' : '#f44336',
    color: 'white'
  });

  const roleBadgeStyle = (role) => ({
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: role === 'ADMIN' ? '#3f51b5' : '#ff9800',
    color: 'white'
  });

  if (loading) {
    return <div style={containerStyle}>Loading travel agents data...</div>;
  }

  if (error) {
    return <div style={containerStyle}>
      <p style={{ color: 'red' }}>{error}</p>
      <button 
        onClick={fetchUsers}
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Travel Agents Directory</h1>
        <button onClick={downloadCSV} style={buttonStyle}>
          Download CSV
        </button>
      </div>
      
      <div style={searchContainerStyle}>
        <input
          type="text"
          placeholder="Search by name, email, company, city, or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>
      
      {filteredUsers.length === 0 ? (
        <p>No users found matching your search criteria.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Contact Person</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Mobile</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td style={tdStyle}>{user.userName}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.companyName || '-'}</td>
                  <td style={tdStyle}>{user.concerningPersonName || '-'}</td>
                  <td style={tdStyle}>{user.contactNumber || '-'}</td>
                  <td style={tdStyle}>{user.mobileNumber || '-'}</td>
                  <td style={tdStyle}>
                    {user.city && user.state ? `${user.city}, ${user.state}` : 
                     user.city || user.state || '-'}
                  </td>
                  <td style={tdStyle}>
                    <span style={roleBadgeStyle(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(user.approved)}>
                      {user.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TravelAgents; 
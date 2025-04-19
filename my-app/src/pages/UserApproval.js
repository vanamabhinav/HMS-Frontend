import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

function UserApproval() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch pending users on component mount
  useEffect(() => {
    // Redirect if not admin
    if (!authState.isAuthenticated || authState.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchPendingUsers();
  }, [authState, navigate]);

  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://hms-columbus-vacation-backend-production.up.railway.app/auth/pending-approvals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPendingUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching pending users:', err);
      setError('Failed to load pending user approvals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(`https://hms-columbus-vacation-backend-production.up.railway.app/auth/approve-user/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Update the UI by removing the approved user
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.delete(`https://hms-columbus-vacation-backend-production.up.railway.app/auth/reject-user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Update the UI by removing the rejected user
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error rejecting user:', err);
      setError('Failed to reject user. Please try again.');
    }
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto'
  };

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px'
  };

  const approveButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  const rejectButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  if (loading) {
    return <div style={containerStyle}>Loading pending approval requests...</div>;
  }

  if (error) {
    return <div style={containerStyle}>
      <p style={{ color: 'red' }}>{error}</p>
      <button 
        onClick={fetchPendingUsers}
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
      <h2>User Approval Dashboard</h2>
      
      {pendingUsers.length === 0 ? (
        <p>No pending approval requests at this time.</p>
      ) : (
        <>
          <p>You have {pendingUsers.length} user registration(s) pending approval.</p>
          
          {pendingUsers.map(user => (
            <div key={user.id} style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3>{user.userName}</h3>
                <div style={buttonContainerStyle}>
                  <button 
                    onClick={() => handleApprove(user.id)}
                    style={approveButtonStyle}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReject(user.id)}
                    style={rejectButtonStyle}
                  >
                    Reject
                  </button>
                </div>
              </div>
              
              <div>
                <p><strong>Company:</strong> {user.companyName}</p>
                <p><strong>Contact Person:</strong> {user.concerningPersonName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <p><strong>Phone:</strong> {user.contactNumber}</p>
                  <p><strong>Mobile:</strong> {user.mobileNumber}</p>
                </div>
                <p><strong>Address:</strong> {user.address}</p>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <p><strong>City:</strong> {user.city}</p>
                  <p><strong>State:</strong> {user.state}</p>
                </div>
                {user.website && <p><strong>Website:</strong> {user.website}</p>}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default UserApproval; 
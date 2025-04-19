import React, { useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CsvUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid CSV file');
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/hotels/upload-csv', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(`Successfully uploaded ${data.hotels.length} hotels`);
                setFile(null);
                if (onUploadSuccess) {
                    onUploadSuccess(data.hotels);
                }
            } else {
                setError(data.message || 'Error uploading file');
            }
        } catch (err) {
            setError('Error uploading file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Upload Hotels via CSV
            </Typography>
            
            <Typography variant="body2" color="textSecondary" paragraph>
                Upload a CSV file with hotel details. The file should include the following columns:
                hotelName, email1, email2, address, mobilePhoneContact, landlineContact, 
                concerningPersonName, preferred, city, state, website
            </Typography>

            <Box sx={{ mt: 2, mb: 2 }}>
                <input
                    accept=".csv"
                    style={{ display: 'none' }}
                    id="csv-upload"
                    type="file"
                    onChange={handleFileChange}
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
            </Box>

            {file && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Selected file: {file.name}
                </Typography>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={!file || loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
            >
                {loading ? 'Uploading...' : 'Upload'}
            </Button>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                </Alert>
            )}
        </Box>
    );
};

export default CsvUpload; 
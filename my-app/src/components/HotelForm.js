import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    FormControlLabel,
    Switch,
    Typography,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const HotelForm = ({ hotel, onSave, onCancel }) => {
    const [formData, setFormData] = useState(hotel || {
        hotelName: '',
        email1: '',
        email2: '',
        address: '',
        mobilePhoneContact: '',
        landlineContact: '',
        concerningPersonName: '',
        preferred: false,
        city: '',
        state: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tabValue, setTabValue] = useState(0);
    const [csvFile, setCsvFile] = useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await onSave(formData);
            setSuccess('Hotel saved successfully!');
            if (!hotel) {
                setFormData({
                    hotelName: '',
                    email1: '',
                    email2: '',
                    address: '',
                    mobilePhoneContact: '',
                    landlineContact: '',
                    concerningPersonName: '',
                    preferred: false,
                    city: '',
                    state: '',
                    website: ''
                });
            }
        } catch (err) {
            setError(err.message || 'Error saving hotel');
        } finally {
            setLoading(false);
        }
    };

    const handleCsvFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setCsvFile(selectedFile);
            setError('');
        } else {
            setError('Please select a valid CSV file');
            setCsvFile(null);
        }
    };

    const handleCsvUpload = async () => {
        if (!csvFile) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', csvFile);

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
                setCsvFile(null);
                if (onSave) {
                    onSave(data.hotels);
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
        <Box>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Add Single Hotel" />
                <Tab label="Bulk Upload via CSV" />
            </Tabs>

            {tabValue === 0 && (
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hotel Name"
                                name="hotelName"
                                value={formData.hotelName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Primary Email"
                                name="email1"
                                type="email"
                                value={formData.email1}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Secondary Email"
                                name="email2"
                                type="email"
                                value={formData.email2}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mobile Phone"
                                name="mobilePhoneContact"
                                value={formData.mobilePhoneContact}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Landline"
                                name="landlineContact"
                                value={formData.landlineContact}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Concerning Person"
                                name="concerningPersonName"
                                value={formData.concerningPersonName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.preferred}
                                        onChange={handleChange}
                                        name="preferred"
                                    />
                                }
                                label="Preferred Hotel"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={onCancel} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </Box>
                </form>
            )}

            {tabValue === 1 && (
                <Paper sx={{ p: 3, border: '1px dashed #ccc', borderRadius: 2 }}>
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
                    </Box>

                    {csvFile && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Selected file: {csvFile.name}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={onCancel} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCsvUpload}
                            disabled={!csvFile || loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </Box>
                </Paper>
            )}

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

export default HotelForm; 
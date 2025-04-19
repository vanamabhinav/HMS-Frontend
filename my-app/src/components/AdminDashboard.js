import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    TextField,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Snackbar,
    Alert,
    Tabs,
    Tab
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import HotelForm from './HotelForm';
import CsvUpload from './CsvUpload';

const AdminDashboard = () => {
    // ... existing state variables ...
    const [tabValue, setTabValue] = useState(0);

    // ... existing code ...

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleUploadSuccess = (newHotels) => {
        setHotels([...hotels, ...newHotels]);
        setSuccessMessage('Hotels uploaded successfully!');
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Manage Hotels" />
                <Tab label="Bulk Upload" />
            </Tabs>

            {tabValue === 0 && (
                <>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setOpenDialog(true)}
                        sx={{ mb: 3 }}
                    >
                        Add New Hotel
                    </Button>

                    <TableContainer component={Paper}>
                        {/* ... existing table code ... */}
                    </TableContainer>

                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                        {/* ... existing dialog code ... */}
                    </Dialog>
                </>
            )}

            {tabValue === 1 && (
                <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                    <CsvUpload onUploadSuccess={handleUploadSuccess} />
                </Box>
            )}

            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={6000} 
                onClose={() => setSuccessMessage('')}
            >
                <Alert onClose={() => setSuccessMessage('')} severity="success">
                    {successMessage}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!errorMessage} 
                autoHideDuration={6000} 
                onClose={() => setErrorMessage('')}
            >
                <Alert onClose={() => setErrorMessage('')} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminDashboard; 
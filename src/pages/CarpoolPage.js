import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Chip
} from '@mui/material';
import { Delete as DeleteIcon, DirectionsCar as CarIcon } from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../components/api';

const CarpoolPage = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Rides
    const fetchRides = async () => {
        try {
            const response = await api.get('/carpool/all');
            setRides(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rides:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRides();
    }, []);

    // Delete Ride
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ride?')) {
            try {
                await axios.delete(`http://localhost:5000/api/carpool/${id}`);
                fetchRides();
            } catch (error) {
                console.error("Error deleting ride:", error);
                alert('Failed to delete ride');
            }
        }
    };

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Carpool Management
                </Typography>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Driver</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>To</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Seats</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rides.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="textSecondary">
                                        No active rides found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rides.map((ride) => (
                                <TableRow key={ride._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CarIcon color="action" fontSize="small" />
                                            <Typography variant="body2" fontWeight="medium">{ride.driverName}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{ride.source}</TableCell>
                                    <TableCell>{ride.destination}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{ride.date}</Typography>
                                        <Typography variant="caption" color="textSecondary">{ride.time}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={ride.seatsAvailable} size="small" color="secondary" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{ride.contactNumber}</TableCell>
                                    <TableCell>
                                        <IconButton color="error" onClick={() => handleDelete(ride._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Layout>
    );
};

export default CarpoolPage;

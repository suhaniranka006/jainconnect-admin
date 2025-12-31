// =================================================================================================
// 📅 EVENTS PAGE
// =================================================================================================
// This page manages the "Events" section of the app.
// Features: List Events, Add New Event, Edit Event, Delete Event.
// It uses a Dialog (Modal) for the Add/Edit form.

import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const EventsPage = () => {
    // 1. STATE VARIABLES
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false); // Controls Modal visibility
    const [currentEvent, setCurrentEvent] = useState({ title: '', city: '', startDate: '', endDate: '', date: '', time: '', description: '', contact: '', latitude: null, longitude: null });
    const [isEdit, setIsEdit] = useState(false); // Are we editing or creating?
    const [selectedFile, setSelectedFile] = useState(null); // File upload state

    // 2. FETCH DATA ON LOAD
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 3. DELETE HANDLER
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(e => e._id !== id)); // Optimistic update
            } catch (err) {
                console.error(err);
            }
        }
    };

    // 4. MODAL HANDLERS
    const handleOpen = (event = null) => {
        if (event) {
            // EDIT MODE: Populate form with existing data
            setCurrentEvent({
                ...event,
                startDate: event.startDate || (event.date ? event.date.split('T')[0] : ''),
                endDate: event.endDate || '',
                date: event.date || ''
            });
            setIsEdit(true);
        } else {
            // ADD MODE: Reset form
            setCurrentEvent({ title: '', city: '', startDate: '', endDate: '', date: '', time: '', description: '', contact: '', latitude: null, longitude: null });
            setIsEdit(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 5. FORM SUBMISSION (CREATE/UPDATE)
    const handleSubmit = async () => {
        let response;
        try {
            // Use FormData because we may be uploading an image file
            const formData = new FormData();
            formData.append('title', currentEvent.title);
            formData.append('city', currentEvent.city);
            formData.append('startDate', currentEvent.startDate);
            formData.append('endDate', currentEvent.endDate);
            formData.append('date', currentEvent.startDate); // Sort mapping
            formData.append('time', currentEvent.time);
            formData.append('contact', currentEvent.contact || '');
            formData.append('description', currentEvent.description);
            if (currentEvent.latitude) formData.append('latitude', currentEvent.latitude);
            if (currentEvent.longitude) formData.append('longitude', currentEvent.longitude);

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            // Decide Endpoint based on EDIT vs ADD and IMAGE vs NO-IMAGE
            if (isEdit) {
                if (selectedFile) {
                    response = await api.put(`/events/upload/${currentEvent._id}`, formData);
                } else {
                    response = await api.put(`/events/${currentEvent._id}`, currentEvent);
                }
            } else {
                if (selectedFile) {
                    response = await api.post('/events/with-image', formData);
                } else {
                    response = await api.post('/events', currentEvent);
                }
            }

            // Show Feedback Alert
            if (response && response.data && response.data.event) {
                const e = response.data.event;
                const debugMsg = e.geocodeDebug || "No Debug Information";

                if (e.latitude && e.longitude) {
                    alert(`Event "${e.title}" Saved!\nLocation: ${e.latitude}, ${e.longitude}\n[Debug: ${debugMsg}]`);
                } else {
                    alert(`Event "${e.title}" Saved!\nWARNING: Location NOT Found.\nReason: ${debugMsg}`);
                }
            }

            fetchEvents(); // Refresh List
            handleClose(); // Close Modal
        } catch (err) {
            console.error(err);
            alert("Error: " + (err.response?.data?.message || err.message));
        }
    };

    // Handle Input Change
    const handleChange = (e) => {
        setCurrentEvent({ ...currentEvent, [e.target.name]: e.target.value });
    };

    // 6. RENDER UI
    return (
        <Layout>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary">Events Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Event
                </Button>
            </Box>

            {/* Events Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dates (Start - End)</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <Avatar src={row.image} alt={row.title} variant="rounded">
                                        {row.title.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{row.startDate} {row.endDate ? ' - ' + row.endDate : ''}</TableCell>
                                <TableCell>{row.time}</TableCell>
                                <TableCell>{row.contact}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpen(row)}><Edit /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(row._id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Title" name="title" value={currentEvent.title} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="City" name="city" value={currentEvent.city} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Time" name="time" value={currentEvent.time} onChange={handleChange} />
                        </Grid>
                        {/* Dates: Shrink label to avoid overlap with date placeholder */}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                name="startDate"
                                value={currentEvent.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                name="endDate"
                                value={currentEvent.endDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Contact Number" name="contact" value={currentEvent.contact} onChange={handleChange} />
                        </Grid>

                        {/* File Upload Button */}
                        <Grid item xs={12}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="outlined" component="span" fullWidth>
                                    {selectedFile ? selectedFile.name : "Upload Image"}
                                </Button>
                            </label>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={3}
                                value={currentEvent.description}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default EventsPage;

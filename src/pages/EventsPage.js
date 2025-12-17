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
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({ title: '', city: '', date: '', time: '', description: '' });
    const [isEdit, setIsEdit] = useState(false);

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(e => e._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpen = (event = null) => {
        if (event) {
            setCurrentEvent({
                ...event,
                // Ensure date is formatted for input type="date" if needed, 
                // though we are using text fields here initially similar to Maharaj.
                // If API returns ISO string, we might want to slice it for date input.
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
            });
            setIsEdit(true);
        } else {
            setCurrentEvent({ title: '', city: '', date: '', time: '', description: '' });
            setIsEdit(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
    };

    const [selectedFile, setSelectedFile] = useState(null); // State for file

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        try {
            // Use FormData for File Upload
            const formData = new FormData();
            formData.append('title', currentEvent.title);
            formData.append('city', currentEvent.city);
            formData.append('date', currentEvent.date);
            formData.append('date', currentEvent.date);
            formData.append('time', currentEvent.time);
            formData.append('contact', currentEvent.contact || '');
            formData.append('description', currentEvent.description);

            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            if (isEdit) {
                if (selectedFile) {
                    await api.put(`/events/upload/${currentEvent._id}`, formData);
                } else {
                    await api.put(`/events/${currentEvent._id}`, currentEvent);
                }
            } else {
                if (selectedFile) {
                    await api.post('/events/with-image', formData);
                } else {
                    await api.post('/events', currentEvent);
                }
            }
            fetchEvents();
            handleClose();
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setCurrentEvent({ ...currentEvent, [e.target.name]: e.target.value });
    };

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary">Events Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Event
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
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
                                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
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
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                value={currentEvent.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Time" name="time" value={currentEvent.time} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Contact Number" name="contact" value={currentEvent.contact} onChange={handleChange} />
                        </Grid>
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

import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid
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
    };

    const handleSubmit = async () => {
        try {
            if (isEdit) {
                await api.put(`/events/${currentEvent._id}`, currentEvent);
            } else {
                await api.post('/events', currentEvent);
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
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                <TableCell>{row.time}</TableCell>
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

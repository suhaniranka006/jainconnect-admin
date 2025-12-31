// =================================================================================================
// 🧘 MAHARAJ PAGE
// =================================================================================================
// Manages the list of Jain Monks/Saints.
// Features: Upload Photo, Add Details (Name, Location, Vihar), List, Edit, Delete.

import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar
} from '@mui/material';
import { Edit, Delete, Add, PhotoCamera, Person as PersonIcon } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const MaharajPage = () => {
    // 1. STATE MANAGEMENT
    const [maharajs, setMaharajs] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentMaharaj, setCurrentMaharaj] = useState({
        name: '', city: '', title: '', contactInfo: '', date: '',
        arrivalDate: '', viharDate: '', description: ''
    });
    const [imageFile, setImageFile] = useState(null); // Actual File Object
    const [imagePreview, setImagePreview] = useState(null); // Preview URL
    const [isEdit, setIsEdit] = useState(false);

    // 2. FETCH DATA
    useEffect(() => {
        fetchMaharajs();
    }, []);

    const fetchMaharajs = async () => {
        try {
            const res = await api.get('/maharaj');
            setMaharajs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 3. DELETE
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Maharaj?')) {
            try {
                await api.delete(`/maharaj/${id}`);
                setMaharajs(maharajs.filter(m => m._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };


    // === HELPER: Fix Image URL ===
    // Backend returns relative path (e.g., "uploads/image.jpg").
    // We need to prepend the server URL to display it.
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) return imagePath;

        const cleanPath = imagePath.replace(/\\/g, '/');
        // Admin Panel Base URL (adjust if needed, or use api.defaults.baseURL)
        return `https://jainconnect-backened-2.onrender.com/${cleanPath}`;
    };

    // 4. MODAL LOGIC
    const handleOpen = (maharaj = null) => {
        if (maharaj) {
            // Edit Mode
            setCurrentMaharaj(maharaj);
            setIsEdit(true);
            setImagePreview(getImageUrl(maharaj.image) || null);
        } else {
            // Add Mode
            setCurrentMaharaj({
                name: '', city: '', title: '', contactInfo: '', date: '',
                arrivalDate: '', viharDate: '', description: ''
            });
            setIsEdit(false);
            setImagePreview(null);
        }
        setImageFile(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Make it visible instantly
        }
    };

    // 5. SUBMIT (MULTIPART FORM DATA)
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', currentMaharaj.name);
            formData.append('city', currentMaharaj.city);
            formData.append('title', currentMaharaj.title || '');
            formData.append('contactInfo', currentMaharaj.contactInfo || '');
            formData.append('description', currentMaharaj.description || '');
            if (currentMaharaj.date) formData.append('date', currentMaharaj.date);
            if (currentMaharaj.arrivalDate) formData.append('arrivalDate', currentMaharaj.arrivalDate);
            if (currentMaharaj.viharDate) formData.append('viharDate', currentMaharaj.viharDate);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Route Logic: Support separate endpoints for With/Without Image
            if (isEdit) {
                const endpoint = imageFile
                    ? `/maharaj/${currentMaharaj._id}/with-image`
                    : `/maharaj/${currentMaharaj._id}`;

                if (!imageFile) {
                    await api.put(`/maharaj/${currentMaharaj._id}`, currentMaharaj);
                } else {
                    // Axios automatically sets Content-Type to multipart/form-data
                    await api.put(endpoint, formData);
                }
            } else {
                const endpoint = imageFile ? '/maharaj/with-image' : '/maharaj';

                if (!imageFile) {
                    await api.post('/maharaj', currentMaharaj);
                } else {
                    await api.post(endpoint, formData);
                }
            }
            fetchMaharajs();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Error saving Maharaj');
        }
    };

    const handleChange = (e) => {
        setCurrentMaharaj({ ...currentMaharaj, [e.target.name]: e.target.value });
    };

    // 6. RENDER
    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary">Maharaj Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Maharaj
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dates (Arrival - Vihar)</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maharajs.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <Avatar src={getImageUrl(row.image)} alt={row.name}>
                                        {row.name.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>
                                    {row.arrivalDate ? row.arrivalDate : '?'} - {row.viharDate ? row.viharDate : '?'}
                                </TableCell>
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
                <DialogTitle>{isEdit ? 'Edit Maharaj' : 'Add New Maharaj'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                        >
                            {!imagePreview && <PersonIcon fontSize="large" />}
                        </Avatar>
                        <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                            Upload Photo
                            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Name" name="name" value={currentMaharaj.name} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Title" name="title" value={currentMaharaj.title} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="City" name="city" value={currentMaharaj.city} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Contact Info" name="contactInfo" value={currentMaharaj.contactInfo} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Arrival Date"
                                name="arrivalDate"
                                value={currentMaharaj.arrivalDate ? new Date(currentMaharaj.arrivalDate).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Vihar Date"
                                name="viharDate"
                                value={currentMaharaj.viharDate ? new Date(currentMaharaj.viharDate).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                name="description"
                                value={currentMaharaj.description}
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

export default MaharajPage;

// =================================================================================================
// 🕍 TEMPLE PAGE
// =================================================================================================
// Manages the list of Temples.
// Features: List, Add, Edit, Delete, Photo Upload.

import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar
} from '@mui/material';
import { Edit, Delete, Add, PhotoCamera, AccountBalance as TempleIcon } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const TemplePage = () => {
    // 1. STATE VARIABLES
    const [temples, setTemples] = useState([]);
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState({ name: '', city: '', address: '', description: '', contact: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    // 2. FETCH DATA
    useEffect(() => {
        fetchTemples();
    }, []);

    const fetchTemples = async () => {
        try {
            const res = await api.get('/temples');
            setTemples(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 3. DELETE HANDLER
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Temple?')) {
            try {
                await api.delete(`/temples/${id}`);
                setTemples(temples.filter(e => e._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    // 4. MODAL LOGIC
    const handleOpen = (item = null) => {
        if (item) {
            setCurrent({ ...item });
            setIsEdit(true);
            setImagePreview(item.image || null);
        } else {
            setCurrent({ name: '', city: '', address: '', description: '', contact: '' });
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
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // 5. SUBMIT HANDLER
    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', current.name);
            formData.append('city', current.city);
            formData.append('address', current.address || '');
            formData.append('description', current.description || '');
            formData.append('contact', current.contact || '');

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEdit) {
                // Update Logic
                // Note: Similar to Bhojanshala, this logic assumes standard PUT.
                // If multipart is required for updates with NO new image, check API.
                // Usually PUT to /temples/:id with JSON works if no file, 
                // but checking original code: it was "api.put ... current". 
                // This implies JSON update unless logic for image upload was missing/implicit.
                // We preserve functionality.
                await api.put(`/temples/${current._id}`, current);
                // Note: Existing code for PUT doesn't seem to handle Image Update if 'current' is used.
                // If user uploads new file during edit, it might be ignored here based on original 'current' only call.
                // However, verification shows we shouldn't change logic, just document.
            } else {
                // Create Logic
                const endpoint = imageFile ? '/temples/with-image' : '/temples';

                if (!imageFile) {
                    await api.post('/temples', current);
                } else {
                    await api.post(endpoint, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }
            fetchTemples();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Error saving Temple');
        }
    };

    const handleChange = (e) => {
        setCurrent({ ...current, [e.target.name]: e.target.value });
    };

    // 6. RENDER
    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary">Temple Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Temple
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {temples.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <Avatar src={row.image} alt={row.name}>
                                        {row.name.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.contact}</TableCell>
                                <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {row.description}
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
                <DialogTitle>{isEdit ? 'Edit Temple' : 'Add New Temple'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, mt: 2 }}>
                        <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                        >
                            {!imagePreview && <TempleIcon fontSize="large" />}
                        </Avatar>
                        <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                            Upload Photo
                            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Name" name="name" value={current.name} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="City" name="city" value={current.city} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Contact" name="contact" value={current.contact} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Address" name="address" value={current.address} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={3}
                                value={current.description}
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

export default TemplePage;

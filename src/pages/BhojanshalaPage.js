import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar
} from '@mui/material';
import { Edit, Delete, Add, PhotoCamera, Restaurant as RestaurantIcon } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const BhojanshalaPage = () => {
    const [bhojanshalas, setBhojanshalas] = useState([]);
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState({ name: '', city: '', address: '', openingTime: '', closingTime: '', contact: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchBhojanshalas();
    }, []);

    const fetchBhojanshalas = async () => {
        try {
            const res = await api.get('/bhojanshala');
            setBhojanshalas(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Bhojanshala?')) {
            try {
                await api.delete(`/bhojanshala/${id}`);
                setBhojanshalas(bhojanshalas.filter(e => e._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setCurrent({ ...item, openingTime: item.openingTime || '', closingTime: item.closingTime || '' });
            setIsEdit(true);
            setImagePreview(item.image || null);
        } else {
            setCurrent({ name: '', city: '', address: '', openingTime: '', closingTime: '', contact: '', description: '' });
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

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', current.name);
            formData.append('city', current.city);
            formData.append('address', current.address);
            formData.append('openingTime', current.openingTime);
            formData.append('closingTime', current.closingTime);
            // Combine for backward compatibility if needed, using a dummy value or the new values
            formData.append('timings', `${current.openingTime} - ${current.closingTime}`);
            formData.append('contact', current.contact);
            formData.append('description', current.description || '');

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEdit) {
                await api.put(`/bhojanshala/${current._id}`, current);
            } else {
                const endpoint = imageFile ? '/bhojanshala/with-image' : '/bhojanshala';

                if (!imageFile) {
                    await api.post('/bhojanshala', current); // Note: current object needs to be updated if sending JSON not FormData for no-image case
                    // But wait, the existing code for no-image handles JSON? 
                    // Let's ensure 'current' has the new fields properly set if we use it directly.
                    // Actually, let's fix the logic below to use FormData consistently OR ensure 'current' is right.
                    // Given the existing structure, let's assume JSON body update:
                } else {
                    await api.post(endpoint, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }

                // Fix for the JSON path:
                if (!imageFile) {
                    await api.post('/bhojanshala', { ...current, timings: `${current.openingTime} - ${current.closingTime}` });
                }
            }
            fetchBhojanshalas();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Error saving Bhojanshala');
        }
    };

    const handleChange = (e) => {
        setCurrent({ ...current, [e.target.name]: e.target.value });
    };

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary">Bhojanshala Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Bhojanshala
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
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Opening</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Closing</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bhojanshalas.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <Avatar src={row.image} alt={row.name}>
                                        {row.name.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.openingTime || row.timings?.split('-')[0]}</TableCell>
                                <TableCell>{row.closingTime || row.timings?.split('-')[1]}</TableCell>
                                <TableCell>{row.contact}</TableCell>
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
                <DialogTitle>{isEdit ? 'Edit Bhojanshala' : 'Add New Bhojanshala'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, mt: 2 }}>
                        <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                        >
                            {!imagePreview && <RestaurantIcon fontSize="large" />}
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
                            <TextField fullWidth label="Opening Time" name="openingTime" placeholder="e.g. 11:00 AM" value={current.openingTime} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Closing Time" name="closingTime" placeholder="e.g. 02:00 PM" value={current.closingTime} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Address" name="address" value={current.address} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Contact" name="contact" value={current.contact} onChange={handleChange} />
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

export default BhojanshalaPage;

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
    const [current, setCurrent] = useState({ name: '', city: '', address: '', timings: '', contact: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchBhojanshalas();
    }, []);

    const fetchBhojanshalas = async () => {
        try {
            const res = await api.get('/bhojanshalas');
            setBhojanshalas(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Bhojanshala?')) {
            try {
                await api.delete(`/bhojanshalas/${id}`);
                setBhojanshalas(bhojanshalas.filter(e => e._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setCurrent({ ...item });
            setIsEdit(true);
            setImagePreview(item.image || null);
        } else {
            setCurrent({ name: '', city: '', address: '', timings: '', contact: '', description: '' });
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
            formData.append('timings', current.timings);
            formData.append('contact', current.contact);
            formData.append('description', current.description || '');

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEdit) {
                // Note: Image update might require specific backend support if not handled.
                // Assuming standard JSON update for now if no image, or Multipart if needed.
                // For simplified flow, we send JSON for edit unless image logic is added to PUT.
                await api.put(`/bhojanshalas/${current._id}`, current);
            } else {
                const endpoint = imageFile ? '/bhojanshalas/with-image' : '/bhojanshalas';

                if (!imageFile) {
                    await api.post('/bhojanshalas', current);
                } else {
                    await api.post(endpoint, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
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
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Timings</TableCell>
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
                                <TableCell>{row.timings}</TableCell>
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
                            <TextField fullWidth label="Timings" name="timings" value={current.timings} onChange={handleChange} />
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

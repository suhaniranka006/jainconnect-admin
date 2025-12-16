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
    const [maharajs, setMaharajs] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentMaharaj, setCurrentMaharaj] = useState({ name: '', city: '', title: '', contactInfo: '', date: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchMaharajs();
    }, []);

    const fetchMaharajs = async () => {
        try {
            const res = await api.get('/maharajs');
            setMaharajs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Maharaj?')) {
            try {
                await api.delete(`/maharajs/${id}`);
                setMaharajs(maharajs.filter(m => m._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpen = (maharaj = null) => {
        if (maharaj) {
            setCurrentMaharaj(maharaj);
            setIsEdit(true);
            setImagePreview(maharaj.image || null);
        } else {
            setCurrentMaharaj({ name: '', city: '', title: '', contactInfo: '', date: '' });
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
            formData.append('name', currentMaharaj.name);
            formData.append('city', currentMaharaj.city);
            formData.append('title', currentMaharaj.title || '');
            formData.append('contactInfo', currentMaharaj.contactInfo || '');
            if (currentMaharaj.date) formData.append('date', currentMaharaj.date);

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };

            if (isEdit) {
                const endpoint = imageFile
                    ? `/maharajs/${currentMaharaj._id}/with-image`
                    : `/maharajs/${currentMaharaj._id}`;

                if (!imageFile) {
                    await api.put(`/maharajs/${currentMaharaj._id}`, currentMaharaj);
                } else {
                    await api.put(endpoint, formData, config);
                }
            } else {
                const endpoint = imageFile ? '/maharajs/with-image' : '/maharajs';

                if (!imageFile) {
                    await api.post('/maharajs', currentMaharaj);
                } else {
                    await api.post(endpoint, formData, config);
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
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maharajs.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <Avatar src={row.image} alt={row.name}>
                                        {row.name.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{row.contactInfo}</TableCell>
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                value={currentMaharaj.date ? new Date(currentMaharaj.date).toISOString().split('T')[0] : ''}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
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

import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const BhojanshalaPage = () => {
    const [bhojanshalas, setBhojanshalas] = useState([]);
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState({ name: '', city: '', address: '', timings: '', contact: '', description: '' });
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
        } else {
            setCurrent({ name: '', city: '', address: '', timings: '', contact: '', description: '' });
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
                await api.put(`/bhojanshalas/${current._id}`, current);
            } else {
                await api.post('/bhojanshalas', current);
            }
            fetchBhojanshalas();
            handleClose();
        } catch (err) {
            console.error(err);
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
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Address</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Timings</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Contact</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bhojanshalas.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{row.address}</TableCell>
                                <TableCell>{row.timings}</TableCell>
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
                <DialogTitle>{isEdit ? 'Edit Bhojanshala' : 'Add New Bhojanshala'}</DialogTitle>
                <DialogContent>
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

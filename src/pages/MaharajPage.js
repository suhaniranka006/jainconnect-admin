import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const MaharajPage = () => {
    const [maharajs, setMaharajs] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentMaharaj, setCurrentMaharaj] = useState({ name: '', city: '', title: '', contactInfo: '', date: '' });
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
        } else {
            setCurrentMaharaj({ name: '', city: '', title: '', contactInfo: '', date: '' });
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
                await api.put(`/maharajs/${currentMaharaj._id}`, currentMaharaj);
            } else {
                await api.post('/maharajs', currentMaharaj);
            }
            fetchMaharajs();
            handleClose();
        } catch (err) {
            console.error(err);
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

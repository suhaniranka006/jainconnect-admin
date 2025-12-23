import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid, FormControlLabel, Checkbox
} from '@mui/material';
import { Edit, Delete, Add, Star, StarBorder } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const TithiPage = () => {
    const [tithis, setTithis] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentTithi, setCurrentTithi] = useState({ tithi: '', date: '', description: '', isMajor: false });
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        fetchTithis();
    }, []);

    const fetchTithis = async () => {
        try {
            const res = await api.get('/tithis');
            setTithis(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Tithi?')) {
            try {
                await api.delete(`/tithis/${id}`);
                setTithis(tithis.filter(t => t._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpen = (tithi = null) => {
        if (tithi) {
            setCurrentTithi({
                ...tithi,
                date: tithi.date ? new Date(tithi.date).toISOString().split('T')[0] : '',
                isMajor: tithi.isMajor || false
            });
            setIsEdit(true);
        } else {
            setCurrentTithi({ tithi: '', date: '', description: '', isMajor: false });
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
                await api.put(`/tithis/${currentTithi._id}`, currentTithi);
            } else {
                await api.post('/tithis', currentTithi);
            }
            fetchTithis();
            handleClose();
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentTithi({
            ...currentTithi,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary">Tithi Management</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Tithi
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Important</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tithi</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tithis.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    {row.isMajor ? <Star color="warning" /> : <StarBorder color="disabled" />}
                                </TableCell>
                                <TableCell>{row.tithi}</TableCell>
                                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
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
                <DialogTitle>{isEdit ? 'Edit Tithi' : 'Add New Tithi'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={currentTithi.isMajor}
                                        onChange={handleChange}
                                        name="isMajor"
                                        color="primary"
                                    />
                                }
                                label="Major Parva (Important Festival)"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Tithi Name" name="tithi" value={currentTithi.tithi} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                value={currentTithi.date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={2}
                                value={currentTithi.description}
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

export default TithiPage;

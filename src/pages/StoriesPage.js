import React, { useState, useEffect } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Grid, Avatar
} from '@mui/material';
import { Edit, Delete, Add, PhotoCamera, AutoStories as StoryIcon } from '@mui/icons-material';
import api from '../components/api';
import Layout from '../components/Layout';

const StoriesPage = () => {
    const [stories, setStories] = useState([]);
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState({ title: '', summary: '', content: '', source: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const res = await api.get('/stories/all');
            setStories(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this Story?')) {
            try {
                await api.delete(`/stories/${id}`);
                setStories(stories.filter(e => e._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpen = (item = null) => {
        if (item) {
            setCurrent({ ...item });
            setEditId(item._id);
            setIsEdit(true);
            setImagePreview(item.imageUrl || null);
        } else {
            setCurrent({ title: '', summary: '', content: '', source: '' });
            setEditId(null);
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
            formData.append('title', current.title);
            formData.append('summary', current.summary);
            formData.append('content', current.content);
            formData.append('source', current.source || '');

            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (isEdit) {
                await api.put(`/stories/update/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/stories/add', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchStories();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Error saving Story');
        }
    };

    const handleChange = (e) => {
        setCurrent({ ...current, [e.target.name]: e.target.value });
    };

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" color="primary">Jain Legacy Stories</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Add Story
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ bgcolor: 'secondary.light' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Summary</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Likes</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stories.map((row) => (
                            <TableRow key={row._id}>
                                <TableCell>
                                    <Avatar src={row.imageUrl} alt={row.title} variant="rounded">
                                        <StoryIcon />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.summary}</TableCell>
                                <TableCell>{row.likes || 0}</TableCell>
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
                <DialogTitle>{isEdit ? 'Edit Story' : 'Add New Story'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, mt: 2 }}>
                        <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100, mb: 2, bgcolor: 'primary.main' }}
                            variant="rounded"
                        >
                            {!imagePreview && <StoryIcon fontSize="large" />}
                        </Avatar>
                        <Button variant="contained" component="label" startIcon={<PhotoCamera />}>
                            Upload Photo
                            <input hidden accept="image/*" type="file" onChange={handleFileChange} />
                        </Button>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Title" name="title" value={current.title} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Short Summary" name="summary" value={current.summary} onChange={handleChange} required multiline rows={2} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Full Content/Details" name="content" value={current.content} onChange={handleChange} required multiline rows={4} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Source (Optional)" name="source" value={current.source} onChange={handleChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!imageFile && !isEdit}>Save</Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default StoriesPage;

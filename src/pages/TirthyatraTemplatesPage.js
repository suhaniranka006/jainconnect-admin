// =================================================================================================
// 🗺️ TIRTHYATRA TEMPLATES PAGE
// =================================================================================================
// Manages predefined trips/templates for Tirthyatras (Pilgrimages).
// Features: List Templates, Add/Edit Template details (Title, Duration, Image), Mark as Popular.

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    Switch,
    FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../components/api';
import Layout from '../components/Layout';

const TirthyatraTemplatesPage = () => {
    // 1. STATE VARIABLES
    const [templates, setTemplates] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState({
        title: '',
        description: '',
        durationDays: 1,
        image: '',
        isPopular: false,
        defaultItinerary: [] // Simplified for now, can be expanded later
    });

    // 2. FETCH TEMPLATES
    const fetchTemplates = async () => {
        try {
            const response = await api.get('/tirthyatra/templates');
            if (response.data.success) {
                setTemplates(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const [selectedImage, setSelectedImage] = useState(null);

    // 3. DIALOG HANDLERS
    const handleOpenDialog = (template = null) => {
        if (template) {
            setCurrentTemplate(template);
            setSelectedImage(null); // Reset new image selection but keep existing URL in currentTemplate.image
        } else {
            setCurrentTemplate({
                title: '',
                description: '',
                durationDays: 1,
                image: '',
                isPopular: false,
                defaultItinerary: []
            });
            setSelectedImage(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value, checked, type } = e.target;
        setCurrentTemplate({
            ...currentTemplate,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    // 4. SUBMIT HANDLER (MULTIPART)
    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('title', currentTemplate.title);
            formData.append('description', currentTemplate.description);
            formData.append('durationDays', currentTemplate.durationDays);
            formData.append('isPopular', currentTemplate.isPopular);

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            // Note: Cloudinary middleware in backend handles file upload.
            // If updating and no new image, backend preserves the old one if logic allows.

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (currentTemplate._id) {
                await api.put(`/tirthyatra/templates/${currentTemplate._id}`, formData, config);
            } else {
                await api.post('/tirthyatra/templates', formData, config);
            }
            fetchTemplates();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Failed to save template');
        }
    };

    // 5. DELETE HANDLER
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await api.delete(`/tirthyatra/templates/${id}`);
                fetchTemplates();
            } catch (error) {
                console.error('Error deleting template:', error);
                alert('Failed to delete template');
            }
        }
    };

    // 6. RENDER
    return (
        <Layout>
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
                    <Typography variant="h4">Tirthyatra Templates</Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                        Add Template
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Days</TableCell>
                                <TableCell>Popular</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {templates.map((template) => (
                                <TableRow key={template._id}>
                                    <TableCell>
                                        {template.image && (
                                            <img src={template.image} alt={template.title} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                                        )}
                                    </TableCell>
                                    <TableCell>{template.title}</TableCell>
                                    <TableCell>{template.durationDays}</TableCell>
                                    <TableCell>{template.isPopular ? 'Yes' : 'No'}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(template)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDelete(template._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>{currentTemplate._id ? 'Edit Template' : 'Add Template'}</DialogTitle>
                    <DialogContent>
                        <Box mb={2} display="flex" flexDirection="column" alignItems="center">
                            {/* Image Preview */}
                            {(selectedImage || currentTemplate.image) && (
                                <img
                                    src={selectedImage ? URL.createObjectURL(selectedImage) : currentTemplate.image}
                                    alt="Preview"
                                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                                />
                            )}
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="raised-button-file"
                                type="file"
                                onChange={handleImageChange}
                            />
                            <label htmlFor="raised-button-file">
                                <Button variant="outlined" component="span">
                                    {currentTemplate.image || selectedImage ? 'Change Image' : 'Upload Image'}
                                </Button>
                            </label>
                        </Box>

                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Template Title"
                            fullWidth
                            value={currentTemplate.title}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={currentTemplate.description}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="durationDays"
                            label="Duration (Days)"
                            type="number"
                            fullWidth
                            value={currentTemplate.durationDays}
                            onChange={handleInputChange}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={currentTemplate.isPopular}
                                    onChange={handleInputChange}
                                    name="isPopular"
                                />
                            }
                            label="Mark as Popular"
                        />

                        {/* Itinerary editing can be complex, simplifying for MVP to just basic details */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Layout>
    );
};

export default TirthyatraTemplatesPage;

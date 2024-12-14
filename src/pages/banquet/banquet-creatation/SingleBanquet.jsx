// import React, { useEffect, useState } from "react";
// import {
//     Avatar,
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Grid,
//     MenuItem,
//     Paper,
//     TextField,
//     Typography,
//     InputLabel,
// } from "@mui/material";
// import { FiEdit } from "react-icons/fi";
// import { useParams } from "react-router-dom";
// import ReactQuill from "react-quill";


// import { fetchBanquetDetails, updateBanquetDetails } from "../../../api/banquet";
// import { showToast } from "../../../api/toast";

// const SingleBanquet = () => {
//     const { id } = useParams();
//     const [banquet, setBanquet] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editCategory, setEditCategory] = useState({});

//     // Fetch category details by ID
//     const getCategoryById = async (id) => {
//         try {
//             const response = await fetchBanquetDetails(id);
//             if (response?.status === 200) {
//                 setCategory(response.data.data);
//                 setEditCategory(response.data.data);
//             }
//         } catch (error) {
//             console.error("Failed to fetch category details:", error);
//             showToast("Failed to fetch category details. Please try again.", "error");
//         }
//     };

//     useEffect(() => {
//         getCategoryById(id);
//     }, [id]);

//     // Handle edit dialog open
//     const handleEditClick = () => {
//         setEditDialogOpen(true);
//     };

//     // Handle edit dialog close
//     const handleDialogClose = () => {
//         setEditDialogOpen(false);
//     };

//     // Handle input changes in the edit form
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditCategory((prev) => ({ ...prev, [name]: value }));
//     };

//     // Save changes to the category
//     const handleSaveChanges = async () => {
//         try {
//             const response = await updateBanquetDetails(id, editCategory);
//             if (response.status === 200) {
//                 // setCategory(response.data.category);
//                 // setEditCategory(response.data.category);
//                 getCategoryById(id);
//                 setEditDialogOpen(false);
//                 showToast("Category details updated successfully!", "success");
//             }
//         } catch (error) {
//             console.error("Failed to update category details:", error);
//             showToast("Failed to update category details. Please try again.", "error");
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Typography variant="h4" sx={{ mb: 3 }}>
//                 Banquet Details
//             </Typography>
//             <Paper
//                 elevation={3}
//                 sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: "12px",
//                     border: "1px solid",
//                     borderColor: "divider",
//                 }}
//             >
//                 <Grid container spacing={4}>
//                     <Grid item xs={12} md={7}>
//                         <Typography variant="h5">{category.name || "N/A"}</Typography>

//                         <Typography variant="body1" sx={{ mb: 2 }}>
//                             <strong>Description:</strong>
//                             <div
//                                 dangerouslySetInnerHTML={{
//                                     __html: category.description || "N/A",
//                                 }}
//                             />
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 2 }}>
//                             <strong>Status:</strong>{" "}
//                             {category.status}
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<FiEdit />}
//                             onClick={handleEditClick}
//                         >
//                             Edit Category
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Paper>

//             {/* Edit Dialog */}
//             <Dialog
//                 open={isEditDialogOpen}
//                 onClose={handleDialogClose}
//                 fullWidth
//                 maxWidth="sm"
//             >
//                 <DialogTitle>Edit Category Details</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         label="Category Name"
//                         fullWidth
//                         margin="dense"
//                         name="name"
//                         value={editCategory.name || ""}
//                         onChange={handleInputChange}
//                     />
//                     <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>
//                         Description
//                     </InputLabel>
//                     <ReactQuill
//                         value={editCategory.description || ""}
//                         onChange={(value) =>
//                             setEditCategory((prev) => ({ ...prev, description: value }))
//                         }
//                         style={{ height: "150px", marginBottom: "20px" }}
//                     />
//                     <TextField
//                         label="Status"
//                         select
//                         fullWidth
//                         margin="dense"
//                         name="status"
//                         value={editCategory.status}
//                         onChange={handleInputChange}
//                     >
//                         <MenuItem value="Active">Active</MenuItem>
//                         <MenuItem value="Inactive">Inactive</MenuItem>
//                     </TextField>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSaveChanges} color="primary">
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default SingleBanquet;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
    InputLabel,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { fetchBanquetDetails, updateBanquetDetails } from "../../../api/banquet";
import { showToast } from "../../../api/toast";

const SingleBanquet = () => {
    const { id } = useParams();
    const [banquet, setBanquet] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editBanquet, setEditBanquet] = useState({});

    // Fetch banquet details by ID
    const getBanquetById = async (id) => {
        try {
            const response = await fetchBanquetDetails(id);
            if (response?.status === 200) {
                setBanquet(response.data.data);
                setEditBanquet(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch banquet details:", error);
            showToast("Failed to fetch banquet details. Please try again.", "error");
        }
    };

    useEffect(() => {
        getBanquetById(id);
    }, [id]);

    // Handle edit dialog open
    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    // Handle edit dialog close
    const handleDialogClose = () => {
        setEditDialogOpen(false);
    };

    // Handle input changes in the edit form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditBanquet((prev) => ({ ...prev, [name]: value }));
    };

    // Save changes to the banquet
    const handleSaveChanges = async () => {
        try {
            const response = await updateBanquetDetails(id, editBanquet);
            if (response.status === 200) {
                getBanquetById(id);
                setEditDialogOpen(false);
                showToast("Banquet details updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update banquet details:", error);
            showToast("Failed to update banquet details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Banquet Details
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{banquet.banquetName?.name || "N/A"}</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Description:</strong>{" "}
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: banquet.banquetName?.description || "N/A",
                                }}
                            />
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Status:</strong> {banquet.status || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Price Range:</strong> ₹{banquet.priceRange?.minPrice || 0} - ₹
                            {banquet.priceRange?.maxPrice || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Features:</strong>
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary={`Smoking Allowed: ${banquet.features?.smokingAllowed ? "Yes" : "No"}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Pet Friendly: ${banquet.features?.petFriendly ? "Yes" : "No"}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={`Accessible: ${banquet.features?.accessible ? "Yes" : "No"}`}
                                />
                            </ListItem>
                        </List>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Amenities:</strong>{" "}
                            {banquet.amenities?.map((amenity) => amenity.name).join(", ") || "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                        >
                            Edit Banquet
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Banquet Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Banquet Name"
                        fullWidth
                        margin="dense"
                        name="name"
                        value={editBanquet.banquetName?.name || ""}
                        onChange={(e) =>
                            setEditBanquet((prev) => ({
                                ...prev,
                                banquetName: { ...prev.banquetName, name: e.target.value },
                            }))
                        }
                    />
                    <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>Description</InputLabel>
                    <ReactQuill
                        value={editBanquet.banquetName?.description || ""}
                        onChange={(value) =>
                            setEditBanquet((prev) => ({
                                ...prev,
                                banquetName: { ...prev.banquetName, description: value },
                            }))
                        }
                        style={{ height: "150px", marginBottom: "20px" }}
                    />
                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editBanquet.status || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveChanges} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SingleBanquet;

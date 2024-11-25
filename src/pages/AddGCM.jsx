// import React, { useState } from "react";
// import {
//     Box,
//     Button,
//     CircularProgress,
//     FormControl,
//     InputAdornment,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     TextField,
//     Typography,
//     Grid,
//     IconButton,
// } from "@mui/material";
// import { Add, Delete, Person, Title, Work, Phone, UploadFile } from "@mui/icons-material";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addGCM } from "../api/gcm";

// const statusOptions = ["Active", "Inactive"];
// const categoryOptions = ["Chairperson", "Co-Chairperson", "Member"]; // Sample category options
// const subCategoryOptions = ["Go Green", "Rooms", "Catering", "Sports"]; // Sample subcategory options

// const AddGCM = () => {
//     const [gcmData, setGcmData] = useState({
//         title: "",
//         name: "",
//         memberId: "",
//         designation: "",
//         contactNumber: "",
//         status: "Active",
//     });
//     const [categories, setCategories] = useState([{ category: "", subCategories: [""] }]);
//     const [profileImage, setProfileImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setGcmData((prev) => ({ ...prev, [name]: value }));
//         validateField(name, value);
//     };

//     // Handle profile image change
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfileImage(file);
//         }
//     };

//     // Validation logic
//     const validateField = (name, value) => {
//         const newErrors = { ...errors };

//         // Name validation
//         if (name === "name" && !value.trim()) {
//             newErrors.name = "Name is required.";
//         } else {
//             delete newErrors.name;
//         }

//         // Member ID validation
//         if (name === "memberId" && !value.trim()) {
//             newErrors.memberId = "Member ID is required.";
//         } else {
//             delete newErrors.memberId;
//         }

//         // Contact number validation
//         if (name === "contactNumber" && (!/^\d{10}$/.test(value) || value.trim().length !== 10)) {
//             newErrors.contactNumber = "Contact number must be a valid 10-digit number.";
//         } else {
//             delete newErrors.contactNumber;
//         }

//         setErrors(newErrors);
//     };

//     // Handle category and subcategory changes
//     const handleCategoryChange = (index, value) => {
//         const updatedCategories = [...categories];
//         updatedCategories[index].category = value;
//         setCategories(updatedCategories);
//     };

//     const handleSubCategoryChange = (catIndex, subIndex, value) => {
//         const updatedCategories = [...categories];
//         updatedCategories[catIndex].subCategories[subIndex] = value;
//         setCategories(updatedCategories);
//     };

//     // Add and remove category
//     const addCategory = () => {
//         setCategories((prev) => [...prev, { category: "", subCategories: [""] }]);
//     };

//     const removeCategory = (index) => {
//         const updatedCategories = [...categories];
//         updatedCategories.splice(index, 1);
//         setCategories(updatedCategories);
//     };

//     // Add and remove subcategory
//     const addSubCategory = (catIndex) => {
//         const updatedCategories = [...categories];
//         updatedCategories[catIndex].subCategories.push("");
//         setCategories(updatedCategories);
//     };

//     const removeSubCategory = (catIndex, subIndex) => {
//         const updatedCategories = [...categories];
//         updatedCategories[catIndex].subCategories.splice(subIndex, 1);
//         setCategories(updatedCategories);
//     };

//     // Form submission handler
//     const handleSubmit = async () => {
//         if (!gcmData.name || !gcmData.memberId || !gcmData.contactNumber) {
//             showToast("Please fill out all required fields.", "error");
//             return;
//         }

//         setLoading(true);

//         const formData = new FormData();
//         Object.entries(gcmData).forEach(([key, value]) => {
//             formData.append(key, value);
//         });

//         if (profileImage) {
//             formData.append("profileImage", profileImage);
//         }

//         formData.append("categories", JSON.stringify(categories));

//         try {
//             const response = await addGCM(formData);
//             if (response.status === 201) {
//                 showToast("General Committee Member added successfully!", "success");
//                 navigate("/gcm");
//             } else {
//                 showToast(response.message || "Failed to add General Committee Member.", "error");
//             }
//         } catch (error) {
//             showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
//             <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
//                 Add General Committee Member
//             </Typography>
//             <Paper elevation={3} sx={{ p: 4, borderRadius: "10px", maxWidth: "800px", margin: "0 auto" }}>
//                 <Grid container spacing={2}>
//                     {/* Title */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel sx={{ fontWeight: "bold" }}>Title</InputLabel>
//                         <Select
//                             name="title"
//                             value={gcmData.title}
//                             onChange={handleInputChange}
//                             fullWidth
//                             size="small"
//                             displayEmpty
//                         >
//                             <MenuItem value="" disabled>
//                                 Select Title
//                             </MenuItem>
//                             <MenuItem value="Mr.">Mr.</MenuItem>
//                             <MenuItem value="Mrs.">Mrs.</MenuItem>
//                             <MenuItem value="Ms.">Ms.</MenuItem>
//                             <MenuItem value="Dr.">Dr.</MenuItem>
//                         </Select>
//                     </Grid>


//                     {/* Name */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel>Name</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="name"
//                             value={gcmData.name}
//                             onChange={handleInputChange}
//                             error={!!errors.name}
//                             helperText={errors.name}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Person />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                     </Grid>

//                     {/* Member ID */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel>Member ID</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="memberId"
//                             value={gcmData.memberId}
//                             onChange={handleInputChange}
//                             error={!!errors.memberId}
//                             helperText={errors.memberId}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Title />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                     </Grid>

//                     {/* Contact Number */}
//                     <Grid item xs={12} md={6}>
//                         <InputLabel>Contact Number</InputLabel>
//                         <TextField
//                             fullWidth
//                             name="contactNumber"
//                             value={gcmData.contactNumber}
//                             onChange={handleInputChange}
//                             error={!!errors.contactNumber}
//                             helperText={errors.contactNumber}
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Phone />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />
//                     </Grid>

//                     {/* Categories */}
//                     <Grid item xs={12}>
//                         <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
//                             Categories & Subcategories
//                         </Typography>
//                         {categories.map((cat, catIndex) => (
//                             <Box key={catIndex} sx={{ mb: 2 }}>
//                                 <Grid container spacing={2}>
//                                     {/* Category Dropdown */}
//                                     <Grid item xs={12} md={5}>
//                                         <FormControl fullWidth>
//                                             <InputLabel>Category</InputLabel>
//                                             <Select
//                                                 value={cat.category}
//                                                 onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
//                                             >
//                                                 {categoryOptions.map((option) => (
//                                                     <MenuItem key={option} value={option}>
//                                                         {option}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl>
//                                     </Grid>

//                                     {/* Add/Remove Category */}
//                                     <Grid item xs={12} md={2}>
//                                         <IconButton onClick={addCategory}>
//                                             <Add />
//                                         </IconButton>
//                                         {categories.length > 1 && (
//                                             <IconButton color="error" onClick={() => removeCategory(catIndex)}>
//                                                 <Delete />
//                                             </IconButton>
//                                         )}
//                                     </Grid>

//                                     {/* Subcategories Dropdown */}
//                                     <Grid item xs={12} md={5}>
//                                         {cat.subCategories.map((subCat, subIndex) => (
//                                             <Box key={subIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                                                 <FormControl fullWidth>
//                                                     <InputLabel>Subcategory</InputLabel>
//                                                     <Select
//                                                         value={subCat}
//                                                         onChange={(e) =>
//                                                             handleSubCategoryChange(catIndex, subIndex, e.target.value)
//                                                         }
//                                                     >
//                                                         {subCategoryOptions.map((option) => (
//                                                             <MenuItem key={option} value={option}>
//                                                                 {option}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                                 <IconButton onClick={() => addSubCategory(catIndex)}>
//                                                     <Add />
//                                                 </IconButton>
//                                                 {cat.subCategories.length > 1 && (
//                                                     <IconButton
//                                                         color="error"
//                                                         onClick={() => removeSubCategory(catIndex, subIndex)}
//                                                     >
//                                                         <Delete />
//                                                     </IconButton>
//                                                 )}
//                                             </Box>
//                                         ))}
//                                     </Grid>
//                                 </Grid>
//                             </Box>
//                         ))}
//                     </Grid>

//                     {/* Status */}
//                     <Grid item xs={12} md={2}>
//                         <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
//                         <FormControl fullWidth>
//                             <Select
//                                 name="status"
//                                 value={gcmData.status}
//                                 onChange={handleInputChange}
//                                 displayEmpty
//                             >
//                                 {statusOptions.map((option) => (
//                                     <MenuItem key={option} value={option}>
//                                         {option}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>

//                     {/* Profile Image */}
//                     <Grid item xs={12}>
//                         <Button variant="contained" component="label" fullWidth>
//                             Upload Image
//                             <input type="file" hidden onChange={handleImageChange} />
//                         </Button>
//                         {profileImage && (
//                             <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                                 {profileImage.name}
//                             </Typography>
//                         )}
//                     </Grid>
//                 </Grid>

//                 {/* Submit Button */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         onClick={handleSubmit}
//                         disabled={loading}
//                     >
//                         {loading ? <CircularProgress size={20} /> : "Add General Committee Member"}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default AddGCM;


import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Grid,
    IconButton,
} from "@mui/material";
import { Add, Delete, Person, Title, Work, Phone, UploadFile } from "@mui/icons-material";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addGCM } from "../api/gcm";

const statusOptions = ["Active", "Inactive"];
const categoryOptions = ["Chairperson", "Co-Chairperson", "Member"]; // Sample category options
const subCategoryOptions = ["Go Green", "Rooms", "Catering", "Sports"]; // Sample subcategory options

const AddGCM = () => {
    const [gcmData, setGcmData] = useState({
        title: "",
        name: "",
        memberId: "",
        designation: "",
        contactNumber: "",
        status: "Active",
    });
    const [categories, setCategories] = useState([{ name: "", subCategories: [{ name: "" }] }]);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGcmData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Handle profile image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    // Validation logic
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Name validation
        if (name === "name" && !value.trim()) {
            newErrors.name = "Name is required.";
        } else {
            delete newErrors.name;
        }

        // Member ID validation
        if (name === "memberId" && !value.trim()) {
            newErrors.memberId = "Member ID is required.";
        } else {
            delete newErrors.memberId;
        }

        // Contact number validation
        if (name === "contactNumber" && (!/^\d{10}$/.test(value) || value.trim().length !== 10)) {
            newErrors.contactNumber = "Contact number must be a valid 10-digit number.";
        } else {
            delete newErrors.contactNumber;
        }

        setErrors(newErrors);
    };

    // Handle category and subcategory changes
    const handleCategoryChange = (index, value) => {
        const updatedCategories = [...categories];
        updatedCategories[index].name = value;
        setCategories(updatedCategories);
    };

    const handleSubCategoryChange = (catIndex, subIndex, value) => {
        const updatedCategories = [...categories];
        updatedCategories[catIndex].subCategories[subIndex].name = value;
        setCategories(updatedCategories);
    };

    // Add and remove category
    const addCategory = () => {
        setCategories((prev) => [...prev, { name: "", subCategories: [{ name: "" }] }]);
    };

    const removeCategory = (index) => {
        const updatedCategories = [...categories];
        updatedCategories.splice(index, 1);
        setCategories(updatedCategories);
    };

    // Add and remove subcategory
    const addSubCategory = (catIndex) => {
        const updatedCategories = [...categories];
        updatedCategories[catIndex].subCategories.push({ name: "" });
        setCategories(updatedCategories);
    };

    const removeSubCategory = (catIndex, subIndex) => {
        const updatedCategories = [...categories];
        updatedCategories[catIndex].subCategories.splice(subIndex, 1);
        setCategories(updatedCategories);
    };

    // Form submission handler
    const handleSubmit = async () => {
        if (!gcmData.name || !gcmData.memberId || !gcmData.contactNumber) {
            showToast("Please fill out all required fields.", "error");
            return;
        }

        // Validate categories
        for (const category of categories) {
            if (!category.name) {
                showToast("Each category must have a name.", "error");
                return;
            }
            for (const subCategory of category.subCategories) {
                if (!subCategory.name) {
                    showToast(`Each subcategory in "${category.name}" must have a name.`, "error");
                    return;
                }
            }
        }

        setLoading(true);

        const formData = new FormData();
        Object.entries(gcmData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        formData.append("categories", JSON.stringify(categories));

        try {
            const response = await addGCM(formData);
            if (response.status === 201) {
                showToast("General Committee Member added successfully!", "success");
                navigate("/gcms");
            } else {
                showToast(response.message || "Failed to add General Committee Member.", "error");
            }
        } catch (error) {
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Add General Committee Member
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: "10px", maxWidth: "800px", margin: "0 auto" }}>
                <Grid container spacing={2}>
                    {/* Title */}
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Title</InputLabel>
                        <Select
                            name="title"
                            value={gcmData.title}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select Title
                            </MenuItem>
                            <MenuItem value="Mr.">Mr.</MenuItem>
                            <MenuItem value="Mrs.">Mrs.</MenuItem>
                            <MenuItem value="Ms.">Ms.</MenuItem>
                            <MenuItem value="Dr.">Dr.</MenuItem>
                        </Select>
                    </Grid>

                    {/* Name */}
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Name</InputLabel>
                        <TextField
                            fullWidth
                            name="name"
                            value={gcmData.name}
                            onChange={handleInputChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Member ID */}
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Member ID</InputLabel>
                        <TextField
                            fullWidth
                            name="memberId"
                            value={gcmData.memberId}
                            onChange={handleInputChange}
                            error={!!errors.memberId}
                            helperText={errors.memberId}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Title />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Designation</InputLabel>
                        <TextField
                            fullWidth
                            name="memberId"
                            value={gcmData.designation}
                            onChange={handleInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Work />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Contact Number */}
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Contact Number</InputLabel>
                        <TextField
                            fullWidth
                            name="contactNumber"
                            value={gcmData.contactNumber}
                            onChange={handleInputChange}
                            error={!!errors.contactNumber}
                            helperText={errors.contactNumber}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    {/* Status */}
                    <Grid item xs={12} md={6}>
                        <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                name="status"
                                value={gcmData.status}
                                onChange={handleInputChange}
                                displayEmpty
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Categories */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                            Categories & Subcategories
                        </Typography>
                        {categories.map((cat, catIndex) => (
                            <Box key={catIndex} sx={{ mb: 2 }}>
                                <Grid container spacing={2}>
                                    {/* Category Dropdown */}
                                    <Grid item xs={12} md={5}>
                                        <FormControl fullWidth>
                                            <Select
                                                value={cat.name}
                                                onChange={(e) => handleCategoryChange(catIndex, e.target.value)}
                                                displayEmpty
                                            >
                                                <MenuItem value="" disabled>
                                                    Please select category
                                                </MenuItem>
                                                {categoryOptions.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {/* Add/Remove Category */}
                                    <Grid item xs={12} md={2}>
                                        <IconButton onClick={addCategory}>
                                            <Add />
                                        </IconButton>
                                        {categories.length > 1 && (
                                            <IconButton color="error" onClick={() => removeCategory(catIndex)}>
                                                <Delete />
                                            </IconButton>
                                        )}
                                    </Grid>

                                    {/* Subcategories Dropdown */}
                                    <Grid item xs={12} md={5}>
                                        {cat.subCategories.map((subCat, subIndex) => (
                                            <Box key={subIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <FormControl fullWidth>
                                                    {/* <InputLabel>Subcategory</InputLabel> */}
                                                    <Select
                                                        value={subCat.name}
                                                        onChange={(e) =>
                                                            handleSubCategoryChange(catIndex, subIndex, e.target.value)
                                                        }
                                                        displayEmpty
                                                    >
                                                        <MenuItem value="" disabled>
                                                            Please select sub category
                                                        </MenuItem>
                                                        {subCategoryOptions.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <IconButton onClick={() => addSubCategory(catIndex)}>
                                                    <Add />
                                                </IconButton>
                                                {cat.subCategories.length > 1 && (
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => removeSubCategory(catIndex, subIndex)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Grid>



                    {/* Profile Image */}
                    <Grid item xs={12}>
                        <Button variant="contained" component="label" fullWidth>
                            Upload Image
                            <input type="file" hidden onChange={handleImageChange} />
                        </Button>
                        {profileImage && (
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                {profileImage.name}
                            </Typography>
                        )}
                    </Grid>
                </Grid>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : "Add General Committee Member"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddGCM;

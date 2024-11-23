// import React, { useRef, useState } from "react";
// import styled from "@emotion/styled";
// import {
//     Box,
//     Button,
//     CircularProgress,
//     FormControl,
//     InputLabel,
//     MenuItem,
//     Paper,
//     Select,
//     TextField,
//     Typography,
// } from "@mui/material";
// import { BiImageAdd } from "react-icons/bi";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addHod } from "../api/clubhods";

// const UploadBox = styled(Box)(({ theme }) => ({
//     marginTop: 20,
//     height: 180,
//     borderRadius: "12px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "column",
//     border: `2px dashed ${theme.palette.divider}`,
//     cursor: "pointer",
//     backgroundColor: theme.palette.background.paper,
//     transition: "0.3s",
//     "&:hover": {
//         backgroundColor: theme.palette.action.hover,
//     },
// }));

// const statusOptions = ["Active", "Inactive"];
// const departmentOptions = ["Admin", "HR", "Finance", "IT", "Marketing", "Other"];

// const AddHod = () => {
//     const [hodData, setHodData] = useState({
//         name: "",
//         designation: "",
//         department: "",
//         contactNumber: "",
//         status: "Active",
//     });
//     const [image, setImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const imageInput = useRef(null);
//     const navigate = useNavigate();

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setHodData((prev) => ({ ...prev, [name]: value }));
//         validateField(name, value);
//     };

//     // Handle image change
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setImage(file);
//         }
//     };

//     // Validation logic for individual fields
//     const validateField = (name, value) => {
//         const newErrors = { ...errors };

//         // Name validation
//         if (name === "name" && !value.trim()) {
//             newErrors.name = "Name is required.";
//         } else {
//             delete newErrors.name;
//         }

//         // Designation validation
//         if (name === "designation" && !value.trim()) {
//             newErrors.designation = "Designation is required.";
//         } else {
//             delete newErrors.designation;
//         }

//         // Department validation
//         if (name === "department" && !value.trim()) {
//             newErrors.department = "Department is required.";
//         } else {
//             delete newErrors.department;
//         }

//         // Contact number validation
//         if (name === "contactNumber" && (!/^\d{10}$/.test(value) || value.trim().length !== 10)) {
//             newErrors.contactNumber = "Contact number must be a valid 10-digit number.";
//         } else {
//             delete newErrors.contactNumber;
//         }

//         setErrors(newErrors);
//     };

//     // Validate the entire form before submission
//     const validateForm = () => {
//         const validationErrors = {};
//         if (!hodData.name) validationErrors.name = "Name is required.";
//         if (!hodData.designation) validationErrors.designation = "Designation is required.";
//         if (!hodData.department) validationErrors.department = "Department is required.";
//         if (!/^\d{10}$/.test(hodData.contactNumber)) {
//             validationErrors.contactNumber = "Contact number must be a valid 10-digit number.";
//         }
//         setErrors(validationErrors);
//         return Object.keys(validationErrors).length === 0;
//     };

//     // Handle form submission
//     const handleSubmit = async () => {
//         if (!validateForm()) return;

//         setLoading(true);

//         const formData = new FormData();
//         Object.entries(hodData).forEach(([key, value]) => {
//             formData.append(key, value);
//         });

//         if (image) {
//             formData.append("profileImage", image);
//         }

//         try {
//             const response = await addHod(formData);
//             if (response.status === 201) {
//                 showToast("HOD added successfully!", "success");
//                 navigate("/hods");
//             } else {
//                 showToast(response.message || "Failed to add HOD. Please try again.", "error");
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
//                 Add New HOD
//             </Typography>
//             <Paper
//                 elevation={3}
//                 sx={{
//                     p: 4,
//                     borderRadius: "10px",
//                     maxWidth: "600px",
//                     margin: "0 auto",
//                 }}
//             >
//                 {/* Name */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Name</InputLabel>
//                     <TextField
//                         placeholder="Enter name"
//                         fullWidth
//                         name="name"
//                         value={hodData.name}
//                         onChange={handleInputChange}
//                         error={!!errors.name}
//                         helperText={errors.name}
//                     />
//                 </Box>

//                 {/* Designation */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Designation</InputLabel>
//                     <TextField
//                         placeholder="Enter designation"
//                         fullWidth
//                         name="designation"
//                         value={hodData.designation}
//                         onChange={handleInputChange}
//                         error={!!errors.designation}
//                         helperText={errors.designation}
//                     />
//                 </Box>

//                 {/* Department */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Department</InputLabel>
//                     <FormControl fullWidth error={!!errors.department}>
//                         <Select
//                             name="department"
//                             value={hodData.department}
//                             onChange={handleInputChange}
//                             displayEmpty
//                         >
//                             <MenuItem value="" disabled>
//                                 Select department
//                             </MenuItem>
//                             {departmentOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                         {errors.department && (
//                             <Typography color="error" variant="body2">
//                                 {errors.department}
//                             </Typography>
//                         )}
//                     </FormControl>
//                 </Box>

//                 {/* Contact Number */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Contact Number</InputLabel>
//                     <TextField
//                         type="text"
//                         placeholder="Enter 10-digit contact number"
//                         fullWidth
//                         name="contactNumber"
//                         value={hodData.contactNumber}
//                         onChange={handleInputChange}
//                         error={!!errors.contactNumber}
//                         helperText={errors.contactNumber}
//                     />
//                 </Box>

//                 {/* Status */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
//                     <FormControl fullWidth>
//                         <Select
//                             name="status"
//                             value={hodData.status}
//                             onChange={handleInputChange}
//                         >
//                             {statusOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>

//                 {/* Profile Image */}
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Profile Image</InputLabel>
//                     <UploadBox onClick={() => imageInput.current.click()}>
//                         {image ? (
//                             <img
//                                 src={URL.createObjectURL(image)}
//                                 alt="Profile"
//                                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                             />
//                         ) : (
//                             <Box sx={{ textAlign: "center" }}>
//                                 <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
//                                 <Typography variant="body2" color="textSecondary">
//                                     Click to upload image
//                                 </Typography>
//                             </Box>
//                         )}
//                         <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
//                     </UploadBox>
//                 </Box>

//                 {/* Submit Button */}
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         sx={{
//                             borderRadius: "10px",
//                             px: 4,
//                             py: 1,
//                             fontWeight: "bold",
//                         }}
//                         disabled={loading}
//                         onClick={handleSubmit}
//                     >
//                         {loading ? <CircularProgress size={20} color="inherit" /> : "Add HOD"}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default AddHod;


import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
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
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addHod } from "../api/clubhods";
import { Person, Work, Apartment, Phone, CheckCircle } from "@mui/icons-material";

const UploadBox = styled(Box)(({ theme }) => ({
    marginTop: 20,
    height: 180,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    border: `2px dashed ${theme.palette.divider}`,
    cursor: "pointer",
    backgroundColor: theme.palette.background.paper,
    transition: "0.3s",
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const statusOptions = ["Active", "Inactive"];
const departmentOptions = ["Admin", "HR", "Finance", "IT", "Marketing", "Other"];

const AddHod = () => {
    const [hodData, setHodData] = useState({
        name: "",
        designation: "",
        department: "",
        contactNumber: "",
        status: "Active",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setHodData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Name validation
        if (name === "name" && !value.trim()) {
            newErrors.name = "Name is required.";
        } else {
            delete newErrors.name;
        }

        // Designation validation
        if (name === "designation" && !value.trim()) {
            newErrors.designation = "Designation is required.";
        } else {
            delete newErrors.designation;
        }

        // Department validation
        if (name === "department" && !value.trim()) {
            newErrors.department = "Department is required.";
        } else {
            delete newErrors.department;
        }

        // Contact number validation
        if (name === "contactNumber" && (!/^\d{10}$/.test(value) || value.trim().length !== 10)) {
            newErrors.contactNumber = "Contact number must be a valid 10-digit number.";
        } else {
            delete newErrors.contactNumber;
        }

        setErrors(newErrors);
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const validationErrors = {};
        if (!hodData.name) validationErrors.name = "Name is required.";
        if (!hodData.designation) validationErrors.designation = "Designation is required.";
        if (!hodData.department) validationErrors.department = "Department is required.";
        if (!/^\d{10}$/.test(hodData.contactNumber)) {
            validationErrors.contactNumber = "Contact number must be a valid 10-digit number.";
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const formData = new FormData();
        Object.entries(hodData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await addHod(formData);
            if (response.status === 201) {
                showToast("HOD added successfully!", "success");
                navigate("/hods");
            } else {
                showToast(response.message || "Failed to add HOD. Please try again.", "error");
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
                Add New HOD
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: "10px",
                    maxWidth: "600px",
                    margin: "0 auto",
                }}
            >
                {/* Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Name</InputLabel>
                    <TextField
                        placeholder="Enter name"
                        fullWidth
                        name="name"
                        value={hodData.name}
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
                </Box>

                {/* Designation */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Designation</InputLabel>
                    <TextField
                        placeholder="Enter designation"
                        fullWidth
                        name="designation"
                        value={hodData.designation}
                        onChange={handleInputChange}
                        error={!!errors.designation}
                        helperText={errors.designation}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Work />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Department */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Department</InputLabel>
                    <FormControl fullWidth error={!!errors.department}>
                        <Select
                            name="department"
                            value={hodData.department}
                            onChange={handleInputChange}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select department
                            </MenuItem>
                            {departmentOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.department && (
                            <Typography color="error" variant="body2">
                                {errors.department}
                            </Typography>
                        )}
                    </FormControl>
                </Box>

                {/* Contact Number */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Contact Number</InputLabel>
                    <TextField
                        type="text"
                        placeholder="Enter 10-digit contact number"
                        fullWidth
                        name="contactNumber"
                        value={hodData.contactNumber}
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
                </Box>

                {/* Status */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Status</InputLabel>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={hodData.status}
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
                </Box>

                {/* Profile Image */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Profile Image</InputLabel>
                    <UploadBox onClick={() => imageInput.current.click()}>
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Profile"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
                                <Typography variant="body2" color="textSecondary">
                                    Click to upload image
                                </Typography>
                            </Box>
                        )}
                        <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
                    </UploadBox>
                </Box>

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: "10px",
                            px: 4,
                            py: 1,
                            fontWeight: "bold",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add HOD"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddHod;
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
} from "@mui/material";
import { Description } from "@mui/icons-material"; // Optional for icons if necessary
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../api/toast";
import { addAmenitie } from "../../../api/masterData/amenities";

const statusOptions = ["active", "inactive"]; // Tax type status options

const AddAmenitie = () => {
    const [taxTypeData, setTaxTypeData] = useState({
        name: "",
        percentage: "",
        status: "active",
        icon: null, // To hold the selected icon file
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [iconPreview, setIconPreview] = useState(null); // State to show icon preview
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaxTypeData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    // Handle file input change (SVG icon upload)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "image/svg+xml") {
            setTaxTypeData((prev) => ({ ...prev, icon: file }));
            setIconPreview(URL.createObjectURL(file)); // Set the icon preview
        } else {
            showToast("Please select a valid SVG file.", "error");
        }
    };

    // Validation logic for individual fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Tax Type Name validation
        if (name === "name" && !value.trim()) {
            newErrors.name = "Tax Type Name is required.";
        } else {
            delete newErrors.name;
        }

        // Percentage validation
        if (name === "percentage" && !value.trim()) {
            newErrors.percentage = "Percentage is required.";
        } else if (name === "percentage" && isNaN(value)) {
            newErrors.percentage = "Percentage must be a number.";
        } else {
            delete newErrors.percentage;
        }

        setErrors(newErrors);
    };

    // Validate the entire form before submission
    const validateForm = () => {
        const validationErrors = {};

        if (!taxTypeData.name) validationErrors.name = "Tax Type Name is required.";
        if (!taxTypeData.percentage) validationErrors.percentage = "Percentage is required.";
        if (isNaN(taxTypeData.percentage)) validationErrors.percentage = "Percentage must be a valid number.";

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", taxTypeData.name);
            formData.append("percentage", taxTypeData.percentage);
            formData.append("status", taxTypeData.status);
            if (taxTypeData.icon) formData.append("icon", taxTypeData.icon); // Append the icon if selected

            const response = await addAmenitie(formData); // API call for amenity creation
            if (response.status === 201) {
                showToast("Amenity added successfully!", "success");
                navigate("/amenities"); // Redirect after successful creation
            } else {
                showToast(response.message || "Failed to add amenity. Please try again.", "error");
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
                Add New Amenity
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
                {/* Amenity Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Amenity Name</InputLabel>
                    <TextField
                        placeholder="Enter Amenity Name"
                        fullWidth
                        name="name"
                        value={taxTypeData.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Description />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Percentage */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Percentage</InputLabel>
                    <TextField
                        placeholder="Enter Percentage"
                        fullWidth
                        name="percentage"
                        value={taxTypeData.percentage}
                        onChange={handleInputChange}
                        error={!!errors.percentage}
                        helperText={errors.percentage}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">%</InputAdornment>
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
                            value={taxTypeData.status}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Icon Upload */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Icon (SVG Only)</InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ textAlign: "center", padding: "12px", fontWeight: "bold" }}
                    >
                        Upload SVG Icon
                        <input
                            type="file"
                            accept="image/svg+xml"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    {iconPreview && (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <img src={iconPreview} alt="Icon Preview" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                        </Box>
                    )}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Amenity"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddAmenitie;

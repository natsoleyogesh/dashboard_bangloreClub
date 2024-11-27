import React, { useState } from "react";
import styled from "@emotion/styled";
import {
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Add, Delete } from "@mui/icons-material";
import { BiImageAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { addFoodAndBeverage } from "../api/foodAndBeverage";
import { showToast } from "../api/toast";

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

const formatTo12Hour = (time) => {
    if (!time) return ""; // Return empty if no time is selected

    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    console.log(`${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`, "dhdh")
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};


const statusOptions = ["Active", "Inactive"];
const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AddFoodAndBeverage = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active",
        subCategories: [
            { name: "", description: "", timings: [], images: [], menu: null },
        ],
    });
    const [bannerImage, setBannerImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input changes for main fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle input changes for subcategories
    const handleSubCategoryChange = (index, field, value) => {
        const updatedSubCategories = [...formData.subCategories];
        updatedSubCategories[index][field] = value;
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    // Handle timing updates for a subcategory
    const handleTimingChange = (index, timingIndex, field, value) => {
        const updatedSubCategories = [...formData.subCategories];
        const updatedTimings = [...updatedSubCategories[index].timings];
        updatedTimings[timingIndex][field] = formatTo12Hour(value);
        updatedSubCategories[index].timings = updatedTimings;
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    // Handle timing updates for a subcategory
    const handleDayChange = (index, timingIndex, field, value) => {
        const updatedSubCategories = [...formData.subCategories];
        const updatedTimings = [...updatedSubCategories[index].timings];
        updatedTimings[timingIndex][field] = value;
        updatedSubCategories[index].timings = updatedTimings;
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    // Add a new subcategory
    const addSubCategory = () => {
        setFormData((prev) => ({
            ...prev,
            subCategories: [
                ...prev.subCategories,
                { name: "", description: "", timings: [], images: [], menu: null },
            ],
        }));
    };

    // Remove a subcategory
    const removeSubCategory = (index) => {
        const updatedSubCategories = [...formData.subCategories];
        updatedSubCategories.splice(index, 1);
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    // Add a timing entry for a subcategory
    const addTiming = (index) => {
        const updatedSubCategories = [...formData.subCategories];
        updatedSubCategories[index].timings.push({
            startDay: "",
            endDay: "",
            startTime: "",
            endTime: "",
        });
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    // Remove a timing entry for a subcategory
    const removeTiming = (index, timingIndex) => {
        const updatedSubCategories = [...formData.subCategories];
        updatedSubCategories[index].timings.splice(timingIndex, 1);
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    // Handle file upload for subcategories
    const handleFileChange = (e, index, field) => {
        const files = Array.from(e.target.files);
        const updatedSubCategories = [...formData.subCategories];
        if (field === "images") {
            updatedSubCategories[index].images = files;
        } else if (field === "menu") {
            updatedSubCategories[index].menu = files[0];
        }
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    // Handle banner image upload
    const handleBannerImageChange = (e) => {
        setBannerImage(e.target.files[0]);
    };

    // Submit the form
    const handleSubmit = async () => {
        setLoading(true);
        const data = new FormData();

        // Append main fields
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("status", formData.status);

        // Append banner image
        if (bannerImage) {
            data.append("bannerImage", bannerImage);
        }

        // Append subcategories
        formData.subCategories.forEach((subCategory, index) => {
            subCategory.images.forEach((image) => {
                data.append(`subCategoryImages_${index}`, image);
            });
            if (subCategory.menu) {
                data.append(`menuFile_${index}`, subCategory.menu);
            }
        });
        data.append("subCategories", JSON.stringify(formData.subCategories));

        try {
            const response = await addFoodAndBeverage(data);
            if (response.status === 201) {
                showToast("Food & Beverage category added successfully!", "success");
                navigate("/foodAndBeverages");
            } else {
                showToast("Failed to add Food & Beverage category.", "error");
            }
        } catch (error) {
            console.error("Error adding Food & Beverage:", error);
            showToast("An error occurred while adding Food & Beverage.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: "bold" }}>
                Add New Food & Beverage
            </Typography>
            <Paper elevation={3} sx={{ p: 4, borderRadius: "10px", maxWidth: "800px", margin: "0 auto" }}>
                {/* Main Fields */}
                <TextField
                    label="Name"
                    fullWidth
                    margin="dense"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <TextField
                    label="Description"
                    fullWidth
                    margin="dense"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={formData.status} onChange={handleInputChange}>
                        {statusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" component="label" sx={{ mt: 1 }}>
                    Upload Banner Image
                    <input type="file" accept="image/*" hidden onChange={handleBannerImageChange} />
                </Button>

                {/* Subcategories */}
                {formData.subCategories.map((subCategory, index) => (
                    <Box key={index} sx={{ mt: 3, border: "1px solid #ccc", p: 2, borderRadius: "8px" }}>
                        <Typography variant="h6">Subcategory {index + 1}</Typography>
                        <TextField
                            label="Subcategory Name"
                            fullWidth
                            margin="dense"
                            value={subCategory.name}
                            onChange={(e) => handleSubCategoryChange(index, "name", e.target.value)}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            margin="dense"
                            value={subCategory.description}
                            onChange={(e) => handleSubCategoryChange(index, "description", e.target.value)}
                        />
                        <TextField
                            label="Location"
                            fullWidth
                            margin="dense"
                            value={subCategory.location}
                            onChange={(e) => handleSubCategoryChange(index, "location", e.target.value)}
                        />
                        <TextField
                            label="Extansion No"
                            fullWidth
                            margin="dense"
                            value={subCategory.extansion_no}
                            onChange={(e) => handleSubCategoryChange(index, "extansion_no", e.target.value)}
                        />
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Timings:
                        </Typography>
                        {subCategory.timings.map((timing, timingIndex) => (
                            <Box
                                key={timingIndex}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    mt: 2,
                                    p: 2,
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <TextField
                                    label="Title"
                                    fullWidth
                                    margin="dense"
                                    value={subCategory.title}
                                    onChange={(e) => handleDayChange(index, timingIndex, "title", e.target.value)}
                                />
                                {/* Row 1: Day Selectors */}
                                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Start Day</InputLabel>
                                        <Select
                                            value={timing.startDay}
                                            onChange={(e) =>
                                                handleDayChange(index, timingIndex, "startDay", e.target.value)
                                            }
                                        >
                                            {dayOptions.map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>End Day</InputLabel>
                                        <Select
                                            value={timing.endDay}
                                            onChange={(e) =>
                                                handleDayChange(index, timingIndex, "endDay", e.target.value)
                                            }
                                        >
                                            {dayOptions.map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* Row 2: Time Selectors */}
                                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontSize: "14px",
                                                color: "#333",
                                                fontWeight: "bold",
                                                mb: 1,
                                            }}
                                        >
                                            Start Time
                                        </Typography>
                                        <TimePicker
                                            value={timing.startTime}
                                            onChange={(value) =>
                                                handleTimingChange(index, timingIndex, "startTime", value)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiInputBase-root": {
                                                            borderRadius: "6px",
                                                            backgroundColor: "#fff",
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontSize: "14px",
                                                color: "#333",
                                                fontWeight: "bold",
                                                mb: 1,
                                            }}
                                        >
                                            End Time
                                        </Typography>
                                        <TimePicker
                                            value={timing.endTime}
                                            onChange={(value) =>
                                                handleTimingChange(index, timingIndex, "endTime", value)
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiInputBase-root": {
                                                            borderRadius: "6px",
                                                            backgroundColor: "#fff",
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </Box>
                                </Box>

                                {/* Remove Timing Button */}
                                <Box sx={{ textAlign: "right" }}>
                                    <IconButton
                                        color="error"
                                        onClick={() => removeTiming(index, timingIndex)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}

                        <Button variant="contained" sx={{ mt: 1 }} onClick={() => addTiming(index)}>
                            <Add /> Add Timing
                        </Button>
                        <Divider sx={{ my: 2 }} />
                        <Button variant="contained" component="label" fullWidth sx={{ mt: 1 }}>
                            Upload Images
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                multiple
                                onChange={(e) => handleFileChange(e, index, "images")}
                            />
                        </Button>
                        <Button variant="contained" component="label" fullWidth sx={{ mt: 1 }}>
                            Upload Menu
                            <input
                                type="file"
                                accept="application/pdf"
                                hidden
                                onChange={(e) => handleFileChange(e, index, "menu")}
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: 1 }}
                            onClick={() => removeSubCategory(index)}
                        >
                            Remove Subcategory
                        </Button>
                    </Box>
                ))}
                <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={addSubCategory}>
                    <Add /> Add Subcategory
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, width: "100%", py: 1.5 }}
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Add Food & Beverage"}
                </Button>
            </Paper>
        </Box>
    );
};

export default AddFoodAndBeverage;

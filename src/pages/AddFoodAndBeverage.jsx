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
    FormHelperText,
} from "@mui/material";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { Add, Delete } from "@mui/icons-material";
import { BiImageAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { addFoodAndBeverage } from "../api/foodAndBeverage";
import { showToast } from "../api/toast";
import ReactQuill from "react-quill";

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
        timings: [{ startDay: "", endDay: "", startTime: null, endTime: null }],
        extansion_no: "",
        location: "",
        subCategories: [
            { name: "", description: "", timings: [], images: [], menu: null },
        ],
    });
    const [bannerImage, setBannerImage] = useState(null);
    const [mainmenu, setMainmenu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
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
    // const handleTimingChange = (index, timingIndex, field, value) => {
    //     const updatedSubCategories = [...formData.subCategories];
    //     const updatedTimings = [...updatedSubCategories[index].timings];
    //     updatedTimings[timingIndex][field] = formatTo12Hour(value);
    //     updatedSubCategories[index].timings = updatedTimings;
    //     setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    // };
    // Handle timing updates for a subcategory
    const handleTimingChange = (index, timingIndex, field, value) => {
        const updatedSubCategories = [...formData.subCategories];
        const updatedTimings = [...updatedSubCategories[index].timings];
        updatedTimings[timingIndex][field] = formatTo12Hour(value); // Assuming this is formatting correctly
        updatedSubCategories[index].timings = updatedTimings;

        // Update formData state
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));

        // Revalidate the form after timing change
        validateForm();
    };

    // Handle timing updates for a subcategory
    const handleDayChange = (index, timingIndex, field, value) => {
        const updatedSubCategories = [...formData.subCategories];
        const updatedTimings = [...updatedSubCategories[index].timings];
        updatedTimings[timingIndex][field] = value;
        updatedSubCategories[index].timings = updatedTimings;
        setFormData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };


    // Validate the form data
    const validateForm = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = "Name is required.";
        if (!formData.location) formErrors.location = "location is required.";
        if (!formData.extansion_no) formErrors.extansion_no = "Extation No is required.";

        if (!formData.description) formErrors.description = "Description is required.";

        // Validate subcategories
        formData.subCategories.forEach((subCategory, index) => {
            if (!subCategory.name) formErrors[`subCategoryName_${index}`] = `Subcategory ${index + 1} name is required.`;
            if (!subCategory.description) formErrors[`subCategoryDescription_${index}`] = `Subcategory ${index + 1} description is required.`;

            if (!subCategory.location) formErrors[`location_${index}`] = `Subcategory ${index + 1} location is required.`;
            if (!subCategory.extansion_no) formErrors[`extansion_no_${index}`] = `Subcategory ${index + 1} extansion_no is required.`;

            // Validate timings for subcategory
            subCategory.timings.forEach((timing, timingIndex) => {
                if (!timing.startDay) {
                    formErrors[`startDay_${index}_${timingIndex}`] = `Start day are required for timing ${timingIndex + 1}.`;
                }
                if (!timing.endDay) {
                    formErrors[`endDay_${index}_${timingIndex}`] = `End day are required for timing ${timingIndex + 1}.`;
                }
                if (!timing.startTime) {
                    formErrors[`startTime_${index}_${timingIndex}`] = `Start time is required for timing ${timingIndex + 1}.`;
                }
                if (!timing.endTime) {
                    formErrors[`endTime_${index}_${timingIndex}`] = `End time is required for timing ${timingIndex + 1}.`;
                }
            });

            // Validate images
            if (subCategory.images.length === 0) {
                formErrors[`subCategoryImages_${index}`] = `Subcategory ${index + 1} images are required.`;
            }

            // Validate menu file
            if (!subCategory.menu) {
                formErrors[`subCategoryMenu_${index}`] = `Subcategory ${index + 1} menu file is required.`;
            }
        });

        // Validate banner image
        if (!bannerImage) formErrors.bannerImage = "Banner image is required.";
        if (!mainmenu) formErrors.mainmenu = "main Menu is required.";


        setErrors(formErrors);  // Update error state
        console.log(formErrors); // Check if errors are being set correctly

        return Object.keys(formErrors).length === 0;  // Return false if there are errors
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
    // Handle banner image upload
    const handleMainmenuChange = (e) => {
        setMainmenu(e.target.files[0]);
    };


    // Submit the form
    const handleSubmit = async () => {
        if (!validateForm()) return; // If validation fails, stop submission

        setLoading(true);
        const data = new FormData();

        // Append main fields
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("location", formData.location);
        data.append("extansion_no", formData.extansion_no);
        data.append("status", formData.status);

        // Append banner image
        if (bannerImage) {
            data.append("bannerImage", bannerImage);
        }
        // Append banner image
        if (mainmenu) {
            data.append("mainmenu", mainmenu);
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

    const handleDescriptionChange = (value) => {
        setFormData({ ...formData, description: value });
    };


    const handleCategoryTimingChange = (timingIndex, field, value) => {
        const updatedTimings = [...formData.timings];
        updatedTimings[timingIndex][field] = formatTo12Hour(value); // Assuming this is formatting correctly
        setFormData((prev) => ({ ...prev, timings: updatedTimings }));
        validateForm();
    };

    // Handle day changes (start and end day for each timing)
    const handleCategoryDayChange = (timingIndex, field, value) => {
        const updatedTimings = [...formData.timings];
        updatedTimings[timingIndex][field] = value;
        setFormData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    // Function to add new timing slot
    const addCategoryTiming = () => {
        setFormData((prev) => ({
            ...prev,
            timings: [
                ...prev.timings,
                { startDay: "", endDay: "", startTime: null, endTime: null },
            ],
        }));
    };

    // Function to remove a timing slot
    const removeCategoryTiming = (timingIndex) => {
        const updatedTimings = formData.timings.filter((_, index) => index !== timingIndex);
        setFormData((prev) => ({ ...prev, timings: updatedTimings }));
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
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                />



                {/* <TextField
                    label="Description"
                    fullWidth
                    margin="dense"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    error={Boolean(errors.description)}
                    helperText={errors.description}
                /> */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                    <ReactQuill
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter Description"
                        style={{
                            height: "150px",
                            borderRadius: "8px",
                            marginBottom: "80px"
                            // border: "1px solid #ccc", // Optionally add a border
                        }}
                    />
                    {errors.description && (
                        <FormHelperText error>{errors.description}</FormHelperText>
                    )}
                </Box>

                <TextField
                    label="Location"
                    fullWidth
                    margin="dense"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={Boolean(errors.location)}
                    helperText={errors.location}

                />
                <TextField
                    label="Extansion No"
                    fullWidth
                    margin="dense"
                    name="extansion_no"
                    value={formData.extansion_no}
                    onChange={handleInputChange}
                    error={Boolean(errors.extansion_no)}
                    helperText={errors.extansion_no}
                />


                <Box sx={{ mb: 2 }}>
                    {formData.timings.map((timing, timingIndex) => (
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
                            {/* Row 1: Day Selectors */}
                            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                                <FormControl fullWidth error={Boolean(errors[`startDay_${timingIndex}`])}>
                                    <InputLabel>Start Day</InputLabel>
                                    <Select
                                        value={timing.startDay}
                                        onChange={(e) => handleCategoryDayChange(timingIndex, "startDay", e.target.value)}
                                    >
                                        {dayOptions.map((day) => (
                                            <MenuItem key={day} value={day}>
                                                {day}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors[`startDay_${timingIndex}`] && (
                                        <FormHelperText>{errors[`startDay_${timingIndex}`]}</FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl fullWidth error={Boolean(errors[`endDay_${timingIndex}`])}>
                                    <InputLabel>End Day</InputLabel>
                                    <Select
                                        value={timing.endDay}
                                        onChange={(e) => handleCategoryDayChange(timingIndex, "endDay", e.target.value)}
                                    >
                                        {dayOptions.map((day) => (
                                            <MenuItem key={day} value={day}>
                                                {day}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors[`endDay_${timingIndex}`] && (
                                        <FormHelperText>{errors[`endDay_${timingIndex}`]}</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            {/* Row 2: Start and End Times */}
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>
                                        Start Time
                                    </Typography>
                                    <TimePicker
                                        value={timing.startTime}
                                        onChange={(value) => handleCategoryTimingChange(timingIndex, "startTime", value)}
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
                                    {errors[`startTime_${timingIndex}`] && (
                                        <FormHelperText sx={{ color: "red" }}>{errors[`startTime_${timingIndex}`]}</FormHelperText>
                                    )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>
                                        End Time
                                    </Typography>
                                    <TimePicker
                                        value={timing.endTime}
                                        onChange={(value) => handleCategoryTimingChange(timingIndex, "endTime", value)}
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
                                    {errors[`endTime_${timingIndex}`] && (
                                        <FormHelperText sx={{ color: "red" }}>{errors[`endTime_${timingIndex}`]}</FormHelperText>
                                    )}
                                </Box>
                            </Box>

                            {/* Remove Timing Button */}
                            <Box sx={{ textAlign: "right" }}>
                                <IconButton
                                    color="error"
                                    onClick={() => removeCategoryTiming(timingIndex)}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}

                    {/* Add Timing Button */}
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                        <Button variant="outlined" onClick={addTiming}>
                            Add Timing
                        </Button>
                    </Box>
                </Box>




                <FormControl fullWidth margin="dense" error={Boolean(errors.status)}>
                    <InputLabel>Status</InputLabel>
                    <Select name="status" value={formData.status} onChange={handleInputChange}>
                        {statusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                </FormControl>
                {/* Banner Image */}
                <UploadBox onClick={() => document.getElementById("bannerImageInput").click()}>
                    <input
                        type="file"
                        id="bannerImageInput"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleBannerImageChange}
                    />
                    <BiImageAdd size={30} />
                    <Typography variant="body2">Click to upload banner image</Typography>
                    {errors.bannerImage && <FormHelperText error>{errors.bannerImage}</FormHelperText>}
                </UploadBox>
                <UploadBox onClick={() => document.getElementById("mainmenuInput").click()}>
                    <input
                        type="file"
                        id="mainmenuInput"
                        // accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={handleMainmenuChange}
                    />
                    <BiImageAdd size={30} />
                    <Typography variant="body2">Click to upload main menu</Typography>
                    {errors.mainmenu && <FormHelperText error>{errors.mainmenu}</FormHelperText>}
                </UploadBox>

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
                            error={Boolean(errors[`subCategoryName_${index}`])}
                            helperText={errors[`subCategoryName_${index}`]}
                        />
                        {/* <TextField
                            label="Description"
                            fullWidth
                            margin="dense"
                            value={subCategory.description}
                            onChange={(e) => handleSubCategoryChange(index, "description", e.target.value)}
                            error={Boolean(errors[`subCategoryDescription_${index}`])}
                            helperText={errors[`subCategoryDescription_${index}`]}
                        /> */}
                        <Box sx={{ mb: 2 }}>
                            <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Description</InputLabel>
                            <ReactQuill
                                value={subCategory.description} // Bind to subCategory.description for dynamic content
                                onChange={(value) => handleSubCategoryChange(index, "description", value)} // Handle changes
                                placeholder="Enter Description"
                                style={{
                                    height: "150px",
                                    borderRadius: "8px",
                                    marginBottom: "80px", // Adjust margin as needed
                                    // border: "1px solid #ccc", // Optionally add a border for styling
                                }}
                            />
                            {errors[`subCategoryDescription_${index}`] && ( // Display error based on the specific index
                                <FormHelperText error>{errors[`subCategoryDescription_${index}`]}</FormHelperText>
                            )}
                        </Box>
                        <TextField
                            label="Location"
                            fullWidth
                            margin="dense"
                            value={subCategory.location}
                            onChange={(e) => handleSubCategoryChange(index, "location", e.target.value)}
                            error={Boolean(errors[`location_${index}`])}
                            helperText={errors[`location_${index}`]}

                        />
                        <TextField
                            label="Extansion No"
                            fullWidth
                            margin="dense"
                            value={subCategory.extansion_no}
                            onChange={(e) => handleSubCategoryChange(index, "extansion_no", e.target.value)}
                            error={Boolean(errors[`extansion_no_${index}`])}
                            helperText={errors[`extansion_no_${index}`]}
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

                                    <FormControl fullWidth error={Boolean(errors[`startDay_${index}_${timingIndex}`])}>
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
                                        {errors[`startDay_${index}_${timingIndex}`] && (
                                            <FormHelperText>{errors[`startDay_${index}_${timingIndex}`]}</FormHelperText>
                                        )}
                                    </FormControl>
                                    <FormControl fullWidth error={Boolean(errors[`endDay_${index}_${timingIndex}`])}>
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
                                        {errors[`endDay_${index}_${timingIndex}`] && (
                                            <FormHelperText>{errors[`endDay_${index}_${timingIndex}`]}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Box>

                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>
                                            Start Time
                                        </Typography>
                                        <TimePicker
                                            value={timing.startTime}
                                            onChange={(value) => handleTimingChange(index, timingIndex, "startTime", value)}
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
                                        {errors[`startTime_${index}_${timingIndex}`] && (
                                            <FormHelperText sx={{ color: 'red' }}>{errors[`startTime_${index}_${timingIndex}`]}</FormHelperText>
                                        )}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>
                                            End Time
                                        </Typography>
                                        <TimePicker
                                            value={timing.endTime}
                                            onChange={(value) => handleTimingChange(index, timingIndex, "endTime", value)}
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
                                        {errors[`endTime_${index}_${timingIndex}`] && (
                                            <FormHelperText sx={{ color: 'red' }}>{errors[`endTime_${index}_${timingIndex}`]}</FormHelperText>
                                        )}
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
                        <UploadBox onClick={(e) => document.getElementById(`subCategoryImagesInput_${index}`).click()}>
                            <input
                                type="file"
                                id={`subCategoryImagesInput_${index}`}
                                multiple
                                style={{ display: "none" }}
                                onChange={(e) => handleFileChange(e, index, "images")}
                            />
                            <BiImageAdd size={30} />
                            <Typography variant="body2">Click to upload images</Typography>
                            {errors[`subCategoryImages_${index}`] && (
                                <FormHelperText error>{errors[`subCategoryImages_${index}`]}</FormHelperText>
                            )}
                        </UploadBox>
                        {/* Subcategory Menu */}
                        <UploadBox onClick={(e) => document.getElementById(`subCategoryMenuInput_${index}`).click()}>
                            <input
                                type="file"
                                id={`subCategoryMenuInput_${index}`}
                                style={{ display: "none" }}
                                onChange={(e) => handleFileChange(e, index, "menu")}
                            />
                            <Typography variant="body2">Click to upload menu</Typography>
                            {errors[`subCategoryMenu_${index}`] && (
                                <FormHelperText error>{errors[`subCategoryMenu_${index}`]}</FormHelperText>
                            )}
                        </UploadBox>
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
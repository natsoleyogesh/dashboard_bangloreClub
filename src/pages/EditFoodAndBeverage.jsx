import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
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
import { Add, Delete, Save } from "@mui/icons-material";
import { fetchEditFoodAndBeverageDetails, fetchFoodAndBeverageDetails, updateFoodAndBeverageDetails } from "../api/foodAndBeverage";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { fetchAllActiveRestaurants } from "../api/masterData/restaurant";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";

const formatTo12Hour = (time) => {
    if (!time) return ""; // Return empty if no time is selected

    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    console.log(`${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`, "dhdh")
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};


const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EditFoodAndBeverage = ({ categoryId, isOpen, onClose, onSave }) => {
    const { id } = useParams();
    const [editData, setEditData] = useState({});
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [mainmenu, setMainmenu] = useState(null);
    const [subCategoryFiles, setSubCategoryFiles] = useState({});

    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetchAllActiveRestaurants();
                setRestaurants(response?.data?.activeRestaurants || []);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                showToast(error.message || "Failed to fetch restaurants.", "error");
            }
        };

        fetchRestaurants();
    }, []);

    useEffect(() => {
        const getFoodAndBeverageById = async (categoryId) => {
            try {
                const response = await fetchEditFoodAndBeverageDetails(categoryId);
                setEditData(response.data.foodAndBeverage);
            } catch (error) {
                console.error("Failed to fetch food and beverage details:", error);
                // showToast("Failed to fetch food and beverage details. Please try again.", "error");
            }
        };

        getFoodAndBeverageById(id);
    }, [categoryId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, index, field) => {
        const file = e.target.files[0];
        if (field === "bannerImage") {
            setSelectedBanner(file);
        } else if (field === "mainmenu") {
            setMainmenu(file);
        } else {
            setSubCategoryFiles((prev) => ({
                ...prev,
                [`${field}_${index}`]: file,
            }));
        }
    };

    const handleSubCategoryChange = (index, field, value) => {
        const updatedSubCategories = [...editData.subCategories];
        updatedSubCategories[index][field] = value;
        setEditData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    const handleTimingChange = (subCategoryIndex, timingIndex, field, value) => {
        setEditData((prev) => {
            const updatedSubCategories = [...prev.subCategories];
            const updatedTimings = [...updatedSubCategories[subCategoryIndex].timings];
            updatedTimings[timingIndex][field] = value;
            updatedSubCategories[subCategoryIndex].timings = updatedTimings;
            return { ...prev, subCategories: updatedSubCategories };
        });
    };

    const addSubCategory = () => {
        const newSubCategory = {
            name: "",
            description: "",
            timings: [],
            images: [],
            menu: null,
        };
        setEditData((prev) => ({
            ...prev,
            subCategories: [...prev.subCategories, newSubCategory],
        }));
    };

    const removeSubCategory = (index) => {
        const updatedSubCategories = [...editData.subCategories];
        updatedSubCategories.splice(index, 1);
        setEditData((prev) => ({ ...prev, subCategories: updatedSubCategories }));
    };

    const addTiming = (subCategoryIndex) => {
        const newTiming = { startDay: "", endDay: "", startTime: "", endTime: "" };
        setEditData((prev) => {
            const updatedSubCategories = [...prev.subCategories];
            updatedSubCategories[subCategoryIndex].timings.push(newTiming);
            return { ...prev, subCategories: updatedSubCategories };
        });
    };

    const removeTiming = (subCategoryIndex, timingIndex) => {
        setEditData((prev) => {
            const updatedSubCategories = [...prev.subCategories];
            updatedSubCategories[subCategoryIndex].timings.splice(timingIndex, 1);
            return { ...prev, subCategories: updatedSubCategories };
        });
    };


    const handleCategoryTimingChange = (timingIndex, field, value) => {
        const updatedTimings = [...editData.timings];
        updatedTimings[timingIndex][field] = formatTo12Hour(value); // Assuming this is formatting correctly
        setEditData((prev) => ({ ...prev, timings: updatedTimings }));
        // validateForm();
    };

    // Handle day changes (start and end day for each timing)
    const handleCategoryDayChange = (timingIndex, field, value) => {
        const updatedTimings = [...editData.timings];
        updatedTimings[timingIndex][field] = value;
        setEditData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    // Function to add new timing slot
    const addCategoryTiming = () => {
        setEditData((prev) => ({
            ...prev,
            timings: [
                ...prev.timings,
                { startDay: "", endDay: "", startTime: "12:00", endTime: "11:00" },
            ],
        }));
    };

    // Function to remove a timing slot
    const removeCategoryTiming = (timingIndex) => {
        const updatedTimings = editData.timings.filter((_, index) => index !== timingIndex);
        setEditData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editData).forEach(([key, value]) => {
                if (key === "subCategories") {
                    formData.append(key, JSON.stringify(value));
                }
                else if (key === "timings") {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (selectedBanner) {
                formData.append("bannerImage", selectedBanner);
            }
            if (mainmenu) {
                formData.append("mainmenu", mainmenu);
            }

            Object.entries(subCategoryFiles).forEach(([key, file]) => {
                formData.append(key, file);
            });

            const response = await updateFoodAndBeverageDetails(editData._id, formData);

            if (response.status === 200) {
                onSave(response.data.foodAndBeverage);
                showToast("Food & Beverage details updated successfully!", "success");
                onClose();
            } else {
                showToast("Failed to update food and beverage details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update food and beverage details:", error);
            showToast("Failed to update food and beverage details. Please try again.", "error");
        }
    };

    const handleDescriptionChange = (value) => {
        setEditData({ ...editData, description: value });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Food & Beverage Details</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        General Information
                    </Typography>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Restaurant Name</InputLabel>
                        <Select
                            name="name"
                            value={editData.name || ""}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="" disabled>
                                Please Choose Restaurant Category
                            </MenuItem>
                            {restaurants.map((type) => (
                                <MenuItem key={type._id} value={type._id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <ReactQuill
                        value={editData.description || ""}
                        onChange={handleDescriptionChange}
                        placeholder="Enter Description"
                        style={{
                            height: "150px",
                            borderRadius: "8px",
                            marginBottom: "80px"
                            // border: "1px solid #ccc", // Optionally add a border
                        }}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={editData.status || ""}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ mb: 2 }}>
                        {editData?.timings?.map((timing, timingIndex) => (
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
                                    <FormControl fullWidth >
                                        <InputLabel>Start Day</InputLabel>
                                        <Select
                                            value={timing.startDay || ""}
                                            onChange={(e) => handleCategoryDayChange(timingIndex, "startDay", e.target.value)}
                                        >
                                            {dayOptions.map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                    </FormControl>
                                    <FormControl fullWidth >
                                        <InputLabel>End Day</InputLabel>
                                        <Select
                                            value={timing.endDay || ""}
                                            onChange={(e) => handleCategoryDayChange(timingIndex, "endDay", e.target.value)}
                                        >
                                            {dayOptions.map((day) => (
                                                <MenuItem key={day} value={day}>
                                                    {day}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                    </FormControl>
                                </Box>

                                {/* Row 2: Start and End Times */}
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>
                                            Start Time
                                        </Typography>
                                        <TimePicker
                                            value={timing.startTime || ""}
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

                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontSize: "14px", fontWeight: "bold", mb: 1 }}>
                                            End Time
                                        </Typography>
                                        <TimePicker
                                            value={timing.endTime || ""}
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
                            <Button variant="outlined" onClick={addCategoryTiming}>
                                Add Timing
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Existing Banner Image:</Typography>
                        {editData.bannerImage && (
                            <img
                                src={`${PUBLIC_API_URI}${editData.bannerImage}`}
                                alt="Existing Banner"
                                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                            />
                        )}
                    </Box>
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{ mt: 2, textTransform: "none" }}
                        fullWidth
                    >
                        Upload New Banner Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, undefined, "bannerImage")}
                        />
                    </Button>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Existing Menu:</Typography>
                        {editData.mainmenu ? (
                            <a
                                href={`${PUBLIC_API_URI}${editData.mainmenu}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: "block", marginTop: "10px" }}
                            >
                                View Existing Menu
                            </a>
                        ) : (
                            <Typography>No menu available</Typography>
                        )}
                    </Box>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Upload New Menu File
                        <input
                            type="file"
                            hidden
                            accept=".pdf"
                            onChange={(e) => handleFileChange(e, undefined, "mainmenu")}
                        />
                    </Button>
                </Box>

                <Divider sx={{ my: 4 }} />

                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Subcategories
                    </Typography>
                    {editData.subCategories?.map((subCategory, index) => (
                        <Paper
                            key={index}
                            elevation={3}
                            sx={{
                                p: 3,
                                mb: 3,
                                borderRadius: "12px",
                                border: "1px solid #ddd",
                            }}
                        >
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Subcategory {index + 1}
                            </Typography>
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Subcategory Name</InputLabel>
                                <Select
                                    value={subCategory.name || ""}
                                    onChange={(e) =>
                                        handleSubCategoryChange(index, "name", e.target.value)
                                    }
                                >
                                    <MenuItem value="" disabled>
                                        Please Choose Subcategory
                                    </MenuItem>
                                    {restaurants.map((type) => (
                                        <MenuItem key={type._id} value={type._id}>
                                            {type.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <ReactQuill
                                value={subCategory.description || ""} // Bind to subCategory.description for dynamic content
                                onChange={(value) => handleSubCategoryChange(index, "description", value)} // Handle changes
                                placeholder="Enter Description"
                                style={{
                                    height: "150px",
                                    borderRadius: "8px",
                                    marginBottom: "80px", // Adjust margin as needed
                                    // border: "1px solid #ccc", // Optionally add a border for styling
                                }}
                            />
                            <TextField
                                label="Location"
                                fullWidth
                                margin="dense"
                                value={subCategory.location || ""}
                                onChange={(e) =>
                                    handleSubCategoryChange(index, "location", e.target.value)
                                }
                            />
                            <TextField
                                label="Extension No"
                                fullWidth
                                margin="dense"
                                value={subCategory.extansion_no || ""}
                                onChange={(e) =>
                                    handleSubCategoryChange(index, "extansion_no", e.target.value)
                                }
                            />

                            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                Timings
                            </Typography>
                            {subCategory.timings?.map((timing, timingIndex) => (
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
                                        value={timing.title || ""}
                                        onChange={(e) =>
                                            handleTimingChange(
                                                index,
                                                timingIndex,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>Start Day</InputLabel>
                                            <Select
                                                value={timing.startDay || ""}
                                                onChange={(e) =>
                                                    handleTimingChange(
                                                        index,
                                                        timingIndex,
                                                        "startDay",
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                {dayOptions.map((day) => (
                                                    <MenuItem key={day} value={day}>
                                                        {day}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel>End Day</InputLabel>
                                            <Select
                                                value={timing.endDay || ""}
                                                onChange={(e) =>
                                                    handleTimingChange(
                                                        index,
                                                        timingIndex,
                                                        "endDay",
                                                        e.target.value
                                                    )
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
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                Start Time
                                            </Typography>
                                            <TimePicker
                                                value={timing.startTime || null}
                                                onChange={(value) =>
                                                    handleTimingChange(
                                                        index,
                                                        timingIndex,
                                                        "startTime",
                                                        value
                                                    )
                                                }
                                            />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                End Time
                                            </Typography>
                                            <TimePicker
                                                value={timing.endTime || null}
                                                onChange={(value) =>
                                                    handleTimingChange(
                                                        index,
                                                        timingIndex,
                                                        "endTime",
                                                        value
                                                    )
                                                }
                                            />
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                        <IconButton
                                            color="error"
                                            onClick={() => removeTiming(index, timingIndex)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => addTiming(index)}
                            >
                                Add Timing
                            </Button>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Existing Images:</Typography>
                                {subCategory.images?.length > 0 ? (
                                    subCategory.images.map((image, i) => (
                                        <img
                                            key={i}
                                            src={`${PUBLIC_API_URI}${image}`}
                                            alt={`Subcategory Image ${i + 1}`}
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                objectFit: "cover",
                                                marginRight: "10px",
                                                marginTop: "10px",
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography>No images available</Typography>
                                )}
                            </Box>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Upload New Images
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange(e, index, "images")}
                                />
                            </Button>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1">Existing Menu:</Typography>
                                {subCategory.menu ? (
                                    <a
                                        href={`${PUBLIC_API_URI}${subCategory.menu}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ display: "block", marginTop: "10px" }}
                                    >
                                        View Existing Menu
                                    </a>
                                ) : (
                                    <Typography>No menu available</Typography>
                                )}
                            </Box>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Upload New Menu File
                                <input
                                    type="file"
                                    hidden
                                    accept=".pdf"
                                    onChange={(e) => handleFileChange(e, index, "menu")}
                                />
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => removeSubCategory(index)}
                            >
                                Remove Subcategory
                            </Button>
                        </Paper>
                    ))}
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={addSubCategory}>
                        Add Subcategory
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSaveChanges} color="primary" startIcon={<Save />}>
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditFoodAndBeverage;

import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import { Delete, Save } from "@mui/icons-material";
import { deleteFoodAndBeverage, deleteFoodAndbeverageImage, fetchEditFoodAndBeverageDetails, updateFoodAndBeverageDetails, uploadFoodAndbeveragesImage } from "../api/foodAndBeverage";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import ReactQuill from "react-quill";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EditFoodAndBeverage = ({ categoryId, isOpen, onClose, onSave }) => {
    const [editData, setEditData] = useState({});
    const [bannerImage, setBannerImages] = useState([]);
    const [mainmenu, setMainmenu] = useState(null);
    const imageInput = useRef(null);

    useEffect(() => {


        if (categoryId) getFoodAndBeverageById(categoryId);
    }, [categoryId]);


    const getFoodAndBeverageById = async (categoryId) => {
        try {
            const response = await fetchEditFoodAndBeverageDetails(categoryId);
            setEditData(response.data.foodAndBeverage);
            setBannerImages(response.data.foodAndBeverage.bannerImage || []);
        } catch (error) {
            console.error("Failed to fetch food and beverage details:", error);
            showToast("Failed to fetch food and beverage details. Please try again.", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const files = Array.from(e.target.files);
        if (field === "bannerImage") {
            setBannerImages((prev) => [...prev, ...files]);
        } else if (field === "mainmenu") {
            setMainmenu(files[0]);
        }
    };

    const removeBannerImage = (index) => {
        handleDeleteImage(index)
        setBannerImages((prev) => prev.filter((_, i) => i !== index));
        onSave();
        getFoodAndBeverageById(categoryId)
    };

    const handleDeleteImage = async (index) => {
        try {
            await deleteFoodAndbeverageImage(categoryId, index);
            onSave();
            // getBanquetById();
            getFoodAndBeverageById(categoryId)
            showToast("Image deleted successfully.", "success");
        } catch (error) {
            showToast("Failed to delete image.", "error");
        }
    };

    const handleTimingChange = (timingIndex, field, value) => {
        const updatedTimings = [...editData.timings];
        updatedTimings[timingIndex][field] = value;
        setEditData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    const addTiming = () => {
        setEditData((prev) => ({
            ...prev,
            timings: [
                ...prev.timings,
                { startDay: "", endDay: "", startTime: "", endTime: "" },
            ],
        }));
    };

    const removeTiming = (timingIndex) => {
        const updatedTimings = editData.timings.filter((_, index) => index !== timingIndex);
        setEditData((prev) => ({ ...prev, timings: updatedTimings }));
    };

    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editData).forEach(([key, value]) => {
                if (key === "timings") {
                    formData.append(key, JSON.stringify(value));
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            bannerImage.forEach((image) => {
                if (image instanceof File) {
                    formData.append("bannerImage", image);
                }
            });

            if (mainmenu) {
                formData.append("mainmenu", mainmenu);
            }

            const response = await updateFoodAndBeverageDetails(editData._id, formData);

            if (response.status === 200) {
                onSave();
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


    const handleUploadImage = async (event) => {
        const files = Array.from(event.target.files);
        if (!files || files.length === 0) {
            showToast("No files selected.", "error");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            const response = await uploadFoodAndbeveragesImage(categoryId, formData);
            if (response.status === 200) {
                onSave()
                getFoodAndBeverageById(categoryId)
                showToast("Images uploaded successfully.", "success");
            }
        } catch (error) {
            showToast("Failed to upload images.", "error");
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Food & Beverage Details</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        General Information
                    </Typography>
                    <ReactQuill
                        value={editData.description || ""}
                        onChange={handleDescriptionChange}
                        placeholder="Enter Description"
                        style={{ height: "150px", borderRadius: "8px" }}
                    />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Banner Images:</Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                            {bannerImage.map((image, index) => (
                                <Box key={index} sx={{ position: "relative" }}>
                                    <img
                                        src={
                                            image instanceof File
                                                ? URL.createObjectURL(image)
                                                : `${PUBLIC_API_URI}${image}`
                                        }
                                        alt={`Banner ${index + 1}`}
                                        style={{ width: 100, height: 100, borderRadius: 8 }}
                                    />
                                    <IconButton
                                        onClick={() => removeBannerImage(index)}
                                        sx={{ position: "absolute", top: 0, right: 0 }}
                                    >
                                        <Delete color="error" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                        {/* <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => imageInput.current.click()
                        >
                            Upload Banner Images
                            <input type="file" hidden ref={imageInput} multiple onChange={handleUploadImage} />
                        </Button> */}
                        <input type="file" hidden ref={imageInput} multiple onChange={handleUploadImage} />
                        <Button variant="outlined" component="label" fullWidth
                            sx={{ mt: 2 }} onClick={() => imageInput.current.click()}>
                            Upload New Banner Image
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Menu:</Typography>
                        {editData.mainmenu && (
                            <a
                                href={`${PUBLIC_API_URI}${editData.mainmenu}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: "block", marginTop: "10px" }}
                            >
                                View Existing Menu
                            </a>
                        )}
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
                                onChange={(e) => handleFileChange(e, "mainmenu")}
                            />
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6">Timings</Typography>
                    {editData?.timings?.map((timing, timingIndex) => (
                        <Box key={timingIndex} sx={{ mt: 2 }}>
                            <TextField
                                label="Start Day"
                                value={timing.startDay}
                                onChange={(e) =>
                                    handleTimingChange(timingIndex, "startDay", e.target.value)
                                }
                                fullWidth
                            />
                            <TextField
                                label="End Day"
                                value={timing.endDay}
                                onChange={(e) =>
                                    handleTimingChange(timingIndex, "endDay", e.target.value)
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                label="Start Time"
                                value={timing.startTime}
                                onChange={(e) =>
                                    handleTimingChange(timingIndex, "startTime", e.target.value)
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                label="End Time"
                                value={timing.endTime}
                                onChange={(e) =>
                                    handleTimingChange(timingIndex, "endTime", e.target.value)
                                }
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                            <Button
                                color="error"
                                onClick={() => removeTiming(timingIndex)}
                                sx={{ mt: 2 }}
                            >
                                Remove Timing
                            </Button>
                        </Box>
                    ))}
                    <Button variant="contained" onClick={addTiming} sx={{ mt: 2 }}>
                        Add Timing
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

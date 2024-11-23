import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDownloadDetails, updateDownloadDetails } from "../api/download";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import { fetchNoticeDetails, updateNoticeetails } from "../api/clubNotice";

const SingleNotice = () => {
    const { id } = useParams();
    const [notice, setNotice] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editNotice, setEditNotice] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);

    // Allowed file types
    const allowedFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
    ];

    // Fetch Notice details by ID
    useEffect(() => {
        const getNoticeById = async (noticeId) => {
            try {
                const response = await fetchNoticeDetails(noticeId);
                setNotice(response.data.notice);
                setEditNotice(response.data.notice);
            } catch (error) {
                console.error("Failed to fetch notice details:", error);
                showToast("Failed to fetch notice details. Please try again.", "error");
            }
        };

        getNoticeById(id);
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Expired date validation
        if (name === "expiredDate") {
            const selectedDate = new Date(value);
            const currentDate = new Date();

            if (selectedDate < currentDate) {
                showToast("Expiration date cannot be in the past.", "error");
                return;
            }
        }

        setEditNotice((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && allowedFileTypes.includes(file.type)) {
            setSelectedFile(file);
        } else {
            showToast("Invalid file type. Only JPEG, JPG, PNG, WEBP, and PDF are allowed.", "error");
        }
    };

    // Handle dialog open/close
    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedFile(null);
    };

    // Save changes to the notice
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editNotice).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (selectedFile) {
                formData.append("fileUrl", selectedFile);
            }

            const response = await updateNoticeetails(id, formData);
            if (response.status === 200 && response.data.notice) {
                setNotice(response.data.notice);
                setEditNotice(response.data.notice);
                setEditDialogOpen(false);
                showToast("Notice details updated successfully!", "success");
            } else {
                showToast("Failed to update notice details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update notice details:", error);
            showToast("Failed to update notice details. Please try again.", "error");
        }
    };

    const formatDate = (date) => {
        const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
        };
        return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Notice Details
            </Typography>
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Grid container spacing={4}>
                    {/* Notice File Preview */}
                    <Grid item xs={12} md={5}>
                        {notice.fileUrl && (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                href={`${PUBLIC_API_URI}${notice.fileUrl}`}
                                target="_blank"
                            >
                                {notice.fileUrl.endsWith(".pdf") ? "View PDF" : "View Image"}
                            </Button>
                        )}
                    </Grid>

                    {/* Notice Details */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5">{notice.title || "N/A"}</Typography>
                        <Typography variant="body1">
                            <strong>Description:</strong> {notice.description || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Status:</strong> {notice.status || "N/A"}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Expiration Date:</strong>{" "}
                            {notice.expiredDate ? formatDate(notice.expiredDate) : "N/A"}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiEdit />}
                            onClick={handleEditClick}
                            sx={{ mt: 2 }}
                        >
                            Edit Notice Details
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
                <DialogTitle>Edit Notice Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="dense"
                        name="title"
                        value={editNotice.title || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="dense"
                        name="description"
                        multiline
                        rows={3}
                        value={editNotice.description || ""}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Expiration Date"
                        type="date"
                        fullWidth
                        margin="dense"
                        name="expiredDate"
                        value={
                            editNotice.expiredDate
                                ? new Date(editNotice.expiredDate).toISOString().split("T")[0]
                                : ""
                        }
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Status"
                        select
                        fullWidth
                        margin="dense"
                        name="status"
                        value={editNotice.status || ""}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>

                    <Button variant="contained" component="label" fullWidth>
                        Upload New File (JPEG, PNG, WEBP, PDF)
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
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

export default SingleNotice;

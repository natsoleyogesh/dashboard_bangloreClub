import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchEventDetails, updateEventDetails } from "../api/event";
import { PUBLIC_API_URI } from "../api/config";
import { showToast } from "../api/toast";
import { FiEdit } from "react-icons/fi";
import ReactQuill from "react-quill";

const SingleEvent = () => {
    const { id } = useParams();
    const [event, setEvent] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editEvent, setEditEvent] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetch event details by ID
    const getEventById = async (id) => {
        try {
            const response = await fetchEventDetails(id);
            setEvent(response.data.event);
            setEditEvent(response.data.event);
        } catch (error) {
            console.error("Failed to fetch event details:", error);
        }
    };

    useEffect(() => {
        getEventById(id);
    }, [id]);

    // Format time to "01:25 PM"
    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        const [hour, minute] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Handle edit button click
    const handleEditClick = () => {
        setEditDialogOpen(true);
    };

    // Handle dialog close
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setSelectedImage(null);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditEvent({ ...editEvent, [name]: value });
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    // Handle save changes
    const handleSaveChanges = async () => {
        try {
            const formData = new FormData();
            Object.entries(editEvent).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append new image if selected
            if (selectedImage) {
                formData.append("eventImage", selectedImage);
            }

            const response = await updateEventDetails(id, formData);
            if (response.status === 200 && response.data.event) {
                setEvent(response.data.event);
                setEditEvent(response.data.event);
                setEditDialogOpen(false);
                showToast("Event details updated successfully!", "success");
            }
        } catch (error) {
            console.error("Failed to update event details:", error);
            showToast("Failed to update event details. Please try again.", "error");
        }
    };

    // Get color for status
    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "primary";
            case "Inactive":
                return "error";
            case "Complete":
                return "success";
            default:
                return "default";
        }
    };

    // Get color for RSVP status
    const getRsvpColor = (rsvpStatus) => {
        switch (rsvpStatus) {
            case "Attending":
                return "success";
            case "Not Attending":
                return "error";
            case "Maybe":
                return "warning";
            case "Pending":
                return "info";
            case "Cancelled":
                return "default";
            case "N/A":
                return "error";
            default:
                return "default";
        }
    };


    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Event Details
            </Typography>
            <Paper sx={{ p: 3, mb: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Avatar
                            src={event.eventImage ? `${PUBLIC_API_URI}${event.eventImage}` : ""}
                            alt={event.eventTitle}
                            variant="rounded"
                            sx={{ width: "100%", height: "300px", objectFit: "cover" }}
                        />
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Typography variant="h4">{event.eventTitle}</Typography>
                        <Typography variant="subtitle1">{event.eventSubtitle}</Typography>
                        <Typography variant="body1">
                            <strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Time:</strong> {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Ticket Price:</strong> {event.currency} {event.ticketPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Primary Member Ticket Price:</strong> {event.currency} {event.primaryMemberPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Dependent Member Ticket Price:</strong> {event.currency} {event.dependentMemberPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Guest Member Ticket Price:</strong> {event.currency} {event.guestMemberPrice}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Tax Rate:</strong>{event.taxRate} %
                        </Typography>
                        <Typography variant="body1">
                            <strong>Location:</strong> {event.location}
                        </Typography>
                        <Typography variant="body1" sx={{ color: getRsvpColor(event.rsvpStatus) }}>
                            <strong>RSVP Status:</strong> {event.rsvpStatus}
                        </Typography>
                        <Typography variant="body1" sx={{ color: getStatusColor(event.status) }}>
                            <strong>Status:</strong> {event.status}
                        </Typography>
                        <Button variant="contained" color="primary" startIcon={<FiEdit />} onClick={handleEditClick}>
                            Edit Event
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Event Details</DialogTitle>
                <DialogContent>
                    <TextField label="Event Title" fullWidth margin="dense" name="eventTitle" value={editEvent.eventTitle || ""} onChange={handleInputChange} />
                    <TextField label="Event Subtitle" fullWidth margin="dense" name="eventSubtitle" value={editEvent.eventSubtitle || ""} onChange={handleInputChange} />
                    <TextField label="Event Date" type="date" fullWidth margin="dense" name="eventDate" value={editEvent.eventDate?.slice(0, 10) || ""} onChange={handleInputChange} />
                    <TextField label="Start Time" type="time" fullWidth margin="dense" name="startTime" value={editEvent.startTime || ""} onChange={handleInputChange} />
                    <TextField label="End Time" type="time" fullWidth margin="dense" name="endTime" value={editEvent.endTime || ""} onChange={handleInputChange} />
                    <TextField label="Ticket Price" fullWidth margin="dense" name="ticketPrice" value={editEvent.ticketPrice || ""} onChange={handleInputChange} />
                    <TextField label="Primary Member Ticket Price" fullWidth margin="dense" name="primaryMemberPrice" value={editEvent.primaryMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Dependent Member Ticket Price" fullWidth margin="dense" name="dependentMemberPrice" value={editEvent.dependentMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Guest Member Ticket Price" fullWidth margin="dense" name="guestMemberPrice" value={editEvent.guestMemberPrice || ""} onChange={handleInputChange} />
                    <TextField label="Tax Rate In %" fullWidth margin="dense" name="taxRate" value={editEvent.taxRate || ""} onChange={handleInputChange} />
                    {/* Use ReactQuill for About Event */}
                    <InputLabel sx={{ fontWeight: "bold", mt: 2 }}>About Event</InputLabel>
                    <ReactQuill
                        value={editEvent.aboutEvent || ""}
                        onChange={(value) => setEditEvent({ ...editEvent, aboutEvent: value })}
                        style={{ height: "150px", marginBottom: "20px" }}
                    />
                    <TextField label="Status" select fullWidth margin="dense" name="status" value={editEvent.status || ""} onChange={handleInputChange}>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Complete">Complete</MenuItem>
                    </TextField>
                    <TextField label="RSVP Status" select fullWidth margin="dense" name="rsvpStatus" value={editEvent.rsvpStatus || ""} onChange={handleInputChange}>
                        <MenuItem value="Attending">Attending</MenuItem>
                        <MenuItem value="Not Attending">Not Attending</MenuItem>
                        <MenuItem value="Maybe">Maybe</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Cancelled">Cancelled</MenuItem>
                        <MenuItem value="N/A">N/A</MenuItem>
                    </TextField>
                    {/* <Avatar src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`} alt="Event Image" variant="rounded" sx={{ width: "100%", height: "200px", mb: 2 }} /> */}
                    <Avatar
                        src={selectedImage ? URL.createObjectURL(selectedImage) : `${PUBLIC_API_URI}${editEvent.eventImage}`}
                        alt="Event Image"
                        variant="rounded"
                        sx={{ width: "100%", height: "200px", objectFit: "cover", mb: 2 }}
                    />
                    <Button variant="contained" component="label" fullWidth>
                        Upload New Image
                        <input type="file" hidden onChange={handleImageChange} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default SingleEvent;



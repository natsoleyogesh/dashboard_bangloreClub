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
// import React, { useRef, useState } from "react";
// import { BiImageAdd } from "react-icons/bi";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addEvent } from "../api/event";

// const rsvpOptions = ["Attending", "Not Attending", "Maybe", "Pending", "Cancelled", "N/A"];
// const currencyOptions = ["INR", "USD", "EUR", "GBP"];
// const statusOptions = ["Active", "Inactive", "Complete"];

// const AddEvent = () => {
//     const [eventData, setEventData] = useState({
//         eventTitle: "",
//         eventSubtitle: "",
//         eventDate: "",
//         startTime: "",
//         endTime: "",
//         ticketPrice: "",
//         currency: "INR",
//         rsvpStatus: "N/A",
//         availableTickets: "",
//         location: "",
//         aboutEvent: "",
//         organizer: "",
//         status: "Active",
//     });
//     const [image, setImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const imageInput = useRef(null);
//     const navigate = useNavigate();

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEventData({ ...eventData, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setImage(e.target.files[0]);
//     };

//     const handleSubmit = async () => {
//         if (!eventData.eventTitle || !eventData.eventDate || !eventData.startTime || !eventData.endTime) {
//             showToast("Please fill in all required fields", "error");
//             return;
//         }

//         const formData = new FormData();
//         Object.entries(eventData).forEach(([key, value]) => {
//             formData.append(key, value);
//         });

//         if (image) {
//             formData.append("eventImage", image);
//         }

//         try {
//             const response = await addEvent(formData);
//             if (response.status === 201) {
//                 showToast("Member added successfully!", "success");
//                 navigate("/events");
//             } else {
//                 showToast(response.message || "Failed to add member. Please try again.", "error");
//             }
//         } catch (error) {
//             console.log(error.response.data.message, "erer")
//             showToast(error.response.data.message || "An error occurred. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const UploadBox = styled(Box)({
//         marginTop: 30,
//         height: 200,
//         borderRadius: "10px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexDirection: "column",
//         borderStyle: "dashed",
//         borderWidth: "2px",
//         borderColor: "divider",
//     });

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Typography variant="h6" sx={{ marginBottom: "14px" }}>
//                 Add Event
//             </Typography>
//             <Paper sx={{ p: 3, borderRadius: "12px", border: "1px solid", borderColor: "divider", maxWidth: "800px", margin: "0 auto" }}>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Event Title</InputLabel>
//                     <TextField
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="eventTitle"
//                         value={eventData.eventTitle}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Event Subtitle</InputLabel>
//                     <TextField
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="eventSubtitle"
//                         value={eventData.eventSubtitle}
//                         onChange={handleInputChange}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Event Date</InputLabel>
//                     <TextField
//                         type="date"
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="eventDate"
//                         value={eventData.eventDate}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Start Time</InputLabel>
//                     <TextField
//                         type="time"
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="startTime"
//                         value={eventData.startTime}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>End Time</InputLabel>
//                     <TextField
//                         type="time"
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="endTime"
//                         value={eventData.endTime}
//                         onChange={handleInputChange}
//                         required
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Ticket Price</InputLabel>
//                     <TextField
//                         type="number"
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="ticketPrice"
//                         value={eventData.ticketPrice}
//                         onChange={handleInputChange}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Currency</InputLabel>
//                     <FormControl fullWidth margin="dense">
//                         <Select name="currency" value={eventData.currency} onChange={handleInputChange}>
//                             {currencyOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>RSVP Status</InputLabel>
//                     <FormControl fullWidth margin="dense">
//                         <Select name="rsvpStatus" value={eventData.rsvpStatus} onChange={handleInputChange}>
//                             {rsvpOptions.map((option) => (
//                                 <MenuItem key={option} value={option}>
//                                     {option}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Available Tickets</InputLabel>
//                     <TextField
//                         type="number"
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="availableTickets"
//                         value={eventData.availableTickets}
//                         onChange={handleInputChange}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Location</InputLabel>
//                     <TextField
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="location"
//                         value={eventData.location}
//                         onChange={handleInputChange}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>About Event</InputLabel>
//                     <TextField
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         multiline
//                         rows={3}
//                         name="aboutEvent"
//                         value={eventData.aboutEvent}
//                         onChange={handleInputChange}
//                     />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                     <InputLabel>Organizer</InputLabel>
//                     <TextField
//                         variant="outlined"
//                         fullWidth
//                         margin="dense"
//                         name="organizer"
//                         value={eventData.organizer}
//                         onChange={handleInputChange}
//                     />
//                 </Box>
//                 <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
//                 <UploadBox onClick={() => imageInput.current.click()}>
//                     {image ? (
//                         <img src={URL.createObjectURL(image)} alt="Event" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
//                     ) : (
//                         <Box sx={{ textAlign: "center" }}>
//                             <BiImageAdd style={{ fontSize: "50px", color: "#027edd" }} />
//                             <Typography>Drop your Event Banner image here or <span style={{ color: "#027edd" }}>browse</span></Typography>
//                             <Typography sx={{ fontSize: "12px" }}>JPG, PNG, and GIF images are allowed</Typography>
//                         </Box>
//                     )}
//                 </UploadBox>
//                 <Box sx={{ display: "flex", justifyContent: "center", mt: "30px" }}>
//                     <Button type="submit" variant="contained" sx={{ borderRadius: "20px" }} disabled={loading} onClick={handleSubmit}>
//                         {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default AddEvent;


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
//     Box,
// } from "@mui/material";
// import React, { useRef, useState } from "react";
// import { BiImageAdd } from "react-icons/bi";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addEvent } from "../api/event";

// const rsvpOptions = ["Attending", "Not Attending", "Maybe", "Pending", "Cancelled", "N/A"];
// const currencyOptions = ["INR", "USD", "EUR", "GBP"];
// const statusOptions = ["Active", "Inactive", "Complete"];

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

// const AddEvent = () => {
//     const [eventData, setEventData] = useState({
//         eventTitle: "",
//         eventSubtitle: "",
//         eventDate: "",
//         startTime: "",
//         endTime: "",
//         ticketPrice: "",
//         currency: "INR",
//         rsvpStatus: "N/A",
//         availableTickets: "",
//         location: "",
//         aboutEvent: "",
//         organizer: "",
//         status: "Active",
//     });
//     const [image, setImage] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const imageInput = useRef(null);
//     const navigate = useNavigate();

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEventData({ ...eventData, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setImage(e.target.files[0]);
//     };

//     const handleSubmit = async () => {
//         if (!eventData.eventTitle || !eventData.eventDate || !eventData.startTime || !eventData.endTime) {
//             showToast("Please fill in all required fields", "error");
//             return;
//         }

//         const formData = new FormData();
//         Object.entries(eventData).forEach(([key, value]) => {
//             formData.append(key, value);
//         });

//         if (image) {
//             formData.append("eventImage", image);
//         }

//         try {
//             const response = await addEvent(formData);
//             if (response.status === 201) {
//                 showToast("Event added successfully!", "success");
//                 navigate("/events");
//             } else {
//                 showToast(response.message || "Failed to add event. Please try again.", "error");
//             }
//         } catch (error) {
//             showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Paper sx={{ p: 4, maxWidth: "600px", mx: "auto", borderRadius: "16px", boxShadow: 3 }}>
//                 <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
//                     Create New Event
//                 </Typography>
//                 <form>
//                     <Grid container spacing={3}>
//                         <Grid sx={{ mb: 2 }}>
//                             <TextField
//                                 label="Event Title"
//                                 placeholder="Enter event title"
//                                 fullWidth
//                                 name="eventTitle"
//                                 value={eventData.eventTitle}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="Event Subtitle"
//                                 placeholder="Enter event subtitle"
//                                 fullWidth
//                                 name="eventSubtitle"
//                                 value={eventData.eventSubtitle}
//                                 onChange={handleInputChange}
//                             />
//                         </Grid>
//                         <Grid sx={{ mb: 2 }}>
//                             <TextField
//                                 label="Event Date"
//                                 type="date"
//                                 fullWidth
//                                 name="eventDate"
//                                 value={eventData.eventDate}
//                                 onChange={handleInputChange}
//                                 InputLabelProps={{ shrink: true }}
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 label="Start Time"
//                                 type="time"
//                                 fullWidth
//                                 name="startTime"
//                                 value={eventData.startTime}
//                                 onChange={handleInputChange}
//                                 InputLabelProps={{ shrink: true }}
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 label="End Time"
//                                 type="time"
//                                 fullWidth
//                                 name="endTime"
//                                 value={eventData.endTime}
//                                 onChange={handleInputChange}
//                                 InputLabelProps={{ shrink: true }}
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <TextField
//                                 label="Ticket Price"
//                                 type="number"
//                                 placeholder="Enter ticket price"
//                                 fullWidth
//                                 name="ticketPrice"
//                                 value={eventData.ticketPrice}
//                                 onChange={handleInputChange}
//                             />
//                         </Grid>
//                         <Grid item xs={6}>
//                             <FormControl fullWidth>
//                                 <InputLabel>Currency</InputLabel>
//                                 <Select name="currency" value={eventData.currency} onChange={handleInputChange}>
//                                     {currencyOptions.map((option) => (
//                                         <MenuItem key={option} value={option}>
//                                             {option}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={6}>
//                             <FormControl fullWidth>
//                                 <InputLabel>RSVP Status</InputLabel>
//                                 <Select name="rsvpStatus" value={eventData.rsvpStatus} onChange={handleInputChange}>
//                                     {rsvpOptions.map((option) => (
//                                         <MenuItem key={option} value={option}>
//                                             {option}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="Available Tickets"
//                                 type="number"
//                                 placeholder="Enter number of available tickets"
//                                 fullWidth
//                                 name="availableTickets"
//                                 value={eventData.availableTickets}
//                                 onChange={handleInputChange}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="Location"
//                                 placeholder="Enter event location"
//                                 fullWidth
//                                 name="location"
//                                 value={eventData.location}
//                                 onChange={handleInputChange}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="About Event"
//                                 placeholder="Describe the event"
//                                 fullWidth
//                                 multiline
//                                 rows={3}
//                                 name="aboutEvent"
//                                 value={eventData.aboutEvent}
//                                 onChange={handleInputChange}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 label="Organizer"
//                                 placeholder="Enter organizer name"
//                                 fullWidth
//                                 name="organizer"
//                                 value={eventData.organizer}
//                                 onChange={handleInputChange}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <UploadBox onClick={() => imageInput.current.click()}>
//                                 {image ? (
//                                     <img src={URL.createObjectURL(image)} alt="Event" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                                 ) : (
//                                     <BiImageAdd style={{ fontSize: "50px", color: "#027edd" }} />
//                                 )}
//                                 <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
//                             </UploadBox>
//                         </Grid>
//                         <Grid item xs={12}>
//                             <Button
//                                 type="button"
//                                 variant="contained"
//                                 color="primary"
//                                 fullWidth
//                                 onClick={handleSubmit}
//                                 disabled={loading}
//                             >
//                                 {loading ? <CircularProgress size={24} color="inherit" /> : "Create Event"}
//                             </Button>
//                         </Grid>
//                     </Grid>
//                 </form>
//             </Paper>
//         </Box>
//     );
// };

// export default AddEvent;



import styled from "@emotion/styled";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Grid,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { BiImageAdd } from "react-icons/bi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addEvent } from "../api/event";
import { AccessTime, AccessTimeFilled, AirplaneTicket, CurrencyRupee, CalendarToday, Category, Code, Description, Event, Info, LocationOn, People, ToggleOff, ToggleOn } from "@mui/icons-material";
import ReactQuill from "react-quill";


const rsvpOptions = ["Attending", "Not Attending", "Maybe", "Pending", "Cancelled", "N/A"];
const currencyOptions = ["INR", "USD", "EUR", "GBP"];
const statusOptions = ["Active", "Inactive", "Complete"];

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

const AddEvent = () => {
    const [eventData, setEventData] = useState({
        eventTitle: "",
        eventSubtitle: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        ticketPrice: "",
        currency: "INR",
        rsvpStatus: "N/A",
        availableTickets: "",
        location: "",
        aboutEvent: "",
        organizer: "",
        status: "Active",
        primaryMemberPrice: "",
        dependentMemberPrice: "",
        guestMemberPrice: "",
        taxRate: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();

    // Handle input changes and validate fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
        validateField(name, value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };
    // Handle the rich text editor changes
    const handleEditorChange = (value) => {
        setEventData({ ...eventData, aboutEvent: value });
    };


    // Field validation function
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        // Validate event title
        if (name === "eventTitle" && !value) {
            newErrors.eventTitle = "Event title is required.";
        } else if (name === "eventTitle") {
            delete newErrors.eventTitle;
        }

        // Validate event date
        if (name === "eventDate" && value) {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
                newErrors.eventDate = "Event date cannot be in the past.";
            } else {
                delete newErrors.eventDate;
            }
        }

        // Validate end time
        if (name === "endTime" && value && eventData.startTime) {
            const start = new Date(`1970-01-01T${eventData.startTime}:00`);
            const end = new Date(`1970-01-01T${value}:00`);
            const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);

            if (end <= oneHourLater) {
                newErrors.endTime = "End time must be at least 1 hour after start time.";
            } else {
                delete newErrors.endTime;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate the entire form before submission
    // const validateForm = () => {
    //     const validationErrors = {};

    //     if (!eventData.eventTitle) {
    //         validationErrors.eventTitle = "Event title is required.";
    //     }

    //     if (!eventData.eventDate) {
    //         validationErrors.eventDate = "Event date is required.";
    //     } else {
    //         const selectedDate = new Date(eventData.eventDate);
    //         const currentDate = new Date();
    //         if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
    //             validationErrors.eventDate = "Event date cannot be in the past.";
    //         }
    //     }

    //     if (!eventData.startTime) {
    //         validationErrors.startTime = "Start time is required.";
    //     }

    //     if (!eventData.endTime) {
    //         validationErrors.endTime = "End time is required.";
    //     } else if (eventData.startTime) {
    //         const start = new Date(`1970-01-01T${eventData.startTime}:00`);
    //         const end = new Date(`1970-01-01T${eventData.endTime}:00`);
    //         const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);

    //         if (end <= oneHourLater) {
    //             validationErrors.endTime = "End time must be at least 1 hour after start time.";
    //         }
    //     }

    //     setErrors(validationErrors);
    //     return Object.keys(validationErrors).length === 0;
    // };
    const validateForm = () => {
        const validationErrors = {};

        // Validate event title
        if (!eventData.eventTitle) {
            validationErrors.eventTitle = "Event title is required.";
        }

        // Validate event date
        if (!eventData.eventDate) {
            validationErrors.eventDate = "Event date is required.";
        } else {
            const selectedDate = new Date(eventData.eventDate);
            const currentDate = new Date();
            if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
                validationErrors.eventDate = "Event date cannot be in the past.";
            }
        }

        // Validate start time
        if (!eventData.startTime) {
            validationErrors.startTime = "Start time is required.";
        }

        // Validate end time
        if (!eventData.endTime) {
            validationErrors.endTime = "End time is required.";
        } else if (eventData.startTime) {
            const start = new Date(`1970-01-01T${eventData.startTime}:00`);
            const end = new Date(`1970-01-01T${eventData.endTime}:00`);
            const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);

            if (end <= oneHourLater) {
                validationErrors.endTime = "End time must be at least 1 hour after start time.";
            }
        }

        // Validate ticket price
        if (!eventData.ticketPrice) {
            validationErrors.ticketPrice = "Ticket price is required.";
        } else if (isNaN(eventData.ticketPrice) || Number(eventData.ticketPrice) < 0) {
            validationErrors.ticketPrice = "Ticket price must be a valid positive number.";
        }

        // Validate currency
        if (!eventData.currency) {
            validationErrors.currency = "Currency is required.";
        }

        // Validate RSVP status
        if (!eventData.rsvpStatus) {
            validationErrors.rsvpStatus = "RSVP status is required.";
        }

        // Validate available tickets
        if (!eventData.availableTickets) {
            validationErrors.availableTickets = "Available tickets are required.";
        } else if (isNaN(eventData.availableTickets) || Number(eventData.availableTickets) <= 0) {
            validationErrors.availableTickets = "Available tickets must be a valid positive number.";
        }

        // Validate location
        if (!eventData.location) {
            validationErrors.location = "Location is required.";
        }

        // Validate about event
        if (!eventData.aboutEvent) {
            validationErrors.aboutEvent = "About event is required.";
        }

        // Validate organizer
        if (!eventData.organizer) {
            validationErrors.organizer = "Organizer information is required.";
        }

        // Validate status
        if (!eventData.status) {
            validationErrors.status = "Event status is required.";
        }

        // Validate status
        if (!eventData.primaryMemberPrice) {
            validationErrors.primaryMemberPrice = "Event primaryMemberPrice is required.";
        }
        // Validate status
        if (!eventData.dependentMemberPrice) {
            validationErrors.dependentMemberPrice = "Event dependentMemberPrice is required.";
        }
        // Validate status
        if (!eventData.guestMemberPrice) {
            validationErrors.guestMemberPrice = "Event guestMemberPrice is required.";
        }
        // Validate status
        if (!eventData.taxRate) {
            validationErrors.taxRate = "Event taxRate is required.";
        }

        // Update the errors state
        setErrors(validationErrors);

        // Return true if no errors, false otherwise
        return Object.keys(validationErrors).length === 0;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails
        // if (!eventData.eventTitle || !eventData.eventDate || !eventData.startTime || !eventData.endTime) {
        //     showToast("Please fill in all required fields", "error");
        //     return;
        // }

        // if (Object.keys(errors).length > 0) {
        //     showToast("Please fix the validation errors", "error");
        //     return;
        // }

        setLoading(true);


        const formData = new FormData();
        Object.entries(eventData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        if (image) {
            formData.append("eventImage", image);
        }

        try {
            const response = await addEvent(formData);
            if (response.status === 201) {
                showToast("Event added successfully!", "success");
                navigate("/events");
            } else {
                showToast(response.message || "Failed to add event. Please try again.", "error");
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
                Create New Event
            </Typography>
            {/* <Paper sx={{ p: 4, maxWidth: "600px", mx: "auto", borderRadius: "16px", boxShadow: 3 }}> */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: "10px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    // backgroundColor: "#f9f9f9",
                }}
            >


                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Title</InputLabel>
                    <TextField
                        // label="Event Title"
                        placeholder="Enter event title"
                        fullWidth
                        name="eventTitle"
                        value={eventData.eventTitle}
                        onChange={handleInputChange}
                        required
                        error={!!errors.eventTitle}
                        helperText={errors.eventTitle}
                        InputProps={{
                            startAdornment: <Event sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Subtitle</InputLabel>
                    <TextField
                        placeholder="Enter event subtitle"
                        fullWidth
                        name="eventSubtitle"
                        value={eventData.eventSubtitle}
                        onChange={handleInputChange}
                        InputProps={{ startAdornment: <Description sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Date</InputLabel>
                    <TextField
                        type="date"
                        fullWidth
                        name="eventDate"
                        value={eventData.eventDate}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!!errors.eventDate}
                        helperText={errors.eventDate}
                        InputProps={{ startAdornment: <CalendarToday sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Start Time</InputLabel>
                    <TextField
                        type="time"
                        fullWidth
                        name="startTime"
                        value={eventData.startTime}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!!errors.startTime}
                        helperText={errors.startTime}
                        InputProps={{ startAdornment: <AccessTimeFilled sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>End Time</InputLabel>
                    <TextField
                        type="time"
                        fullWidth
                        name="endTime"
                        value={eventData.endTime}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        required
                        error={!!errors.endTime}
                        helperText={errors.endTime}
                        InputProps={{ startAdornment: <AccessTime sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter ticket price"
                        fullWidth
                        name="ticketPrice"
                        value={eventData.ticketPrice}
                        onChange={handleInputChange}
                        error={!!errors.ticketPrice}
                        helperText={errors.ticketPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Primary Member Ticket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter primery member ticket price"
                        fullWidth
                        name="primaryMemberPrice"
                        value={eventData.primaryMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.primaryMemberPrice}
                        helperText={errors.primaryMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Dependent MemberTicket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Dependent Member ticket price"
                        fullWidth
                        name="dependentMemberPrice"
                        value={eventData.dependentMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.dependentMemberPrice}
                        helperText={errors.dependentMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}> Guest MemberTicket Price</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Guest Member ticket price"
                        fullWidth
                        name="guestMemberPrice"
                        value={eventData.guestMemberPrice}
                        onChange={handleInputChange}
                        error={!!errors.guestMemberPrice}
                        helperText={errors.guestMemberPrice}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Tax Rate In %</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter Tax Rate In %"
                        fullWidth
                        name="taxRate"
                        value={eventData.taxRate}
                        onChange={handleInputChange}
                        error={!!errors.taxRate}
                        helperText={errors.taxRate}
                        InputProps={{ startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Currency</InputLabel>
                    <FormControl fullWidth error={!!errors.currency}>
                        <Select name="currency" value={eventData.currency} onChange={handleInputChange}
                            startAdornment={<CurrencyRupee sx={{ color: "gray", mr: 1 }} />}>
                            {currencyOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.currency && (
                            <Typography color="error" variant="body2">
                                {errors.currency}
                            </Typography>
                        )}
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>RSVP Status</InputLabel>
                    <FormControl fullWidth error={!!errors.rsvpStatus}>
                        <Select name="rsvpStatus" value={eventData.rsvpStatus} onChange={handleInputChange}
                            startAdornment={<ToggleOff sx={{ color: "gray", mr: 1 }} />}
                        >
                            {rsvpOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.rsvpStatus && (
                            <Typography color="error" variant="body2">
                                {errors.rsvpStatus}
                            </Typography>
                        )}
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Available Tickets</InputLabel>
                    <TextField
                        type="number"
                        placeholder="Enter number of available tickets"
                        fullWidth
                        name="availableTickets"
                        value={eventData.availableTickets}
                        onChange={handleInputChange}
                        error={!!errors.availableTickets}
                        helperText={errors.availableTickets}
                        InputProps={{ startAdornment: <AirplaneTicket sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Location</InputLabel>
                    <TextField
                        placeholder="Enter event location"
                        fullWidth
                        name="location"
                        value={eventData.location}
                        onChange={handleInputChange}
                        error={!!errors.location}
                        helperText={errors.location}
                        InputProps={{ startAdornment: <LocationOn sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>About Event</InputLabel>
                    {/* <TextField
                        placeholder="Describe the event"
                        fullWidth
                        multiline
                        rows={3}
                        name="aboutEvent"
                        value={eventData.aboutEvent}
                        onChange={handleInputChange}
                        InputProps={{ startAdornment: <Info sx={{ color: "gray", mr: 1 }} /> }}
                    /> */}
                    <ReactQuill
                        value={eventData.aboutEvent}
                        onChange={handleEditorChange}
                        placeholder="Describe the event"
                        style={{
                            height: "150px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Organizer</InputLabel>
                    <TextField
                        placeholder="Enter organizer name"
                        fullWidth
                        name="organizer"
                        value={eventData.organizer}
                        onChange={handleInputChange}
                        error={!!errors.organizer}
                        helperText={errors.organizer}
                        InputProps={{ startAdornment: <People sx={{ color: "gray", mr: 1 }} /> }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Event Image</InputLabel>
                    <UploadBox onClick={() => imageInput.current.click()}>
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="Event" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <Box sx={{ textAlign: "center" }}>
                                <BiImageAdd style={{ fontSize: "40px", color: "#027edd" }} />
                                <Typography variant="body2" color="textSecondary">
                                    Click to upload Event image
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    (JPG, PNG, GIF)
                                </Typography>
                            </Box>
                        )}
                        <input type="file" hidden ref={imageInput} onChange={handleImageChange} />
                    </UploadBox>
                </Box>
                {/* <Box sx={{ mb: 2 }}>
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Create Event"}
                    </Button>
                </Box> */}
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
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                        }}
                        disabled={loading}
                        onClick={handleSubmit}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Event"}
                    </Button>
                </Box>

            </Paper>
        </Box>
    );
};

export default AddEvent;

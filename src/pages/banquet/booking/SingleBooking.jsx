// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     Grid,
//     Paper,
//     TextField,
//     Typography,
//     MenuItem,
//     Select,
//     InputLabel,
//     FormControl,
//     Chip,
//     ListItem,
//     List,
//     ListItemText,
// } from "@mui/material";
// import { useParams } from "react-router-dom";

// import { FiEdit } from "react-icons/fi";
// import { fetchBanquetBookingDetails, updateBanquetBooking } from "../../../api/banquet";
// import { showToast } from "../../../api/toast";

// // Function to format time to IST (Indian Standard Time) in AM/PM format
// const formatTimeInIST = (timeStr) => {
//     if (!timeStr) return "N/A";

//     const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

//     // Combine today's date with the time string and create a new Date object
//     const timeInUTC = new Date(`${todayDate}T${timeStr}:00Z`);

//     // Format the time in IST (Indian Standard Time) with AM/PM
//     const options = {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//         timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
//     };

//     return new Intl.DateTimeFormat('en-IN', options).format(timeInUTC);
// };

// const statusOptions = ['Pending', 'Confirmed', 'Cancelled']

// const SingleBooking = () => {
//     const { id } = useParams();
//     const [booking, setBooking] = useState({});
//     const [isEditDialogOpen, setEditDialogOpen] = useState(false);
//     const [editBooking, setEditBooking] = useState({
//         bookingId: id,
//         bookingStatus: ""
//     });

//     // Fetch booking details by ID
//     useEffect(() => {


//         getBookingById(id);
//     }, [id]);

//     const getBookingById = async (bookingId) => {
//         try {
//             const response = await fetchBanquetBookingDetails(bookingId);
//             setBooking(response.data.booking);
//             setEditBooking({
//                 bookingStatus: response?.data?.booking?.bookingStatus
//             });
//         } catch (error) {
//             console.error("Failed to fetch booking details:", error);
//             showToast("Failed to fetch booking details. Please try again.", "error");
//         }
//     };

//     // Handle input changes for the edit form
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditBooking((prev) => ({ ...prev, [name]: value }));
//     };

//     // Open and close the edit dialog
//     const handleEditClick = () => setEditDialogOpen(true);
//     const handleDialogClose = () => setEditDialogOpen(false);


//     // Save changes to the booking
//     const handleSaveChanges = async () => {
//         try {
//             const response = await updateBanquetBooking({ bookingId: id, bookingStatus: editBooking.bookingStatus });
//             if (response.status === 200) {
//                 // setBooking(response.data.booking);
//                 getBookingById(id)
//                 setEditDialogOpen(false);
//                 showToast("Booking details updated successfully!", "success");
//             } else {
//                 showToast("Failed to update booking details. Please try again.", "error");
//             }
//         } catch (error) {
//             console.error("Failed to update booking details:", error);
//             showToast("Failed to update booking details. Please try again.", "error");
//         }
//     };

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Typography variant="h4" sx={{ mb: 2 }}>
//                 Booking Details
//             </Typography>
//             <Paper
//                 sx={{
//                     p: 3,
//                     mb: 3,
//                     borderRadius: "12px",
//                     border: "1px solid",
//                     borderColor: "divider",
//                 }}
//             >
//                 <Grid container spacing={4}>
//                     {/* Booking Details Display */}
//                     <Grid item xs={12} sm={6}>
//                         <Typography variant="h6">Banquet: {booking?.banquetType?.banquetName?.name || "N/A"}</Typography>
//                         <Typography variant="body1">
//                             <strong>Banquet Booking Dates:</strong> {new Date(booking.bookingDates?.checkIn).toLocaleDateString() || "N/A"} - {new Date(booking.bookingDates?.checkOut).toLocaleDateString() || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Banquet Booking Time:</strong>  {booking.bookingTime ? formatTimeInIST(booking.bookingTime.from) : "N/A"} -  {booking.bookingTime ? formatTimeInIST(booking.bookingTime.to) : "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Booking Status:</strong>  <Chip
//                                 label={booking.bookingStatus}
//                                 color={booking.bookingStatus === "Confirmed" ? "success" : "default"} // Approved, Pending, Rejected
//                                 size="small"
//                             />

//                         </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <Typography variant="h6">Banquet Pricing Details</Typography>
//                         <Box sx={{ mb: 2 }}>
//                             <Typography variant="body1" sx={{ mb: 1 }}>
//                                 <strong>Tax Charges:</strong>
//                             </Typography>
//                             {booking.pricingDetails?.taxTypes?.length > 0 ? (
//                                 <List>
//                                     {booking.pricingDetails.taxTypes.map((tax, index) => (
//                                         <ListItem key={index} disableGutters>
//                                             <ListItemText
//                                                 primary={
//                                                     <>
//                                                         <Typography variant="body2">
//                                                             <strong>Tax Type:</strong> {tax.taxType || "N/A"}
//                                                         </Typography>
//                                                         <Typography variant="body2">
//                                                             <strong>Tax Rate:</strong> {tax.taxRate || "N/A"}%
//                                                         </Typography>
//                                                         <Typography variant="body2">
//                                                             <strong>Tax Amount:</strong> ₹{tax.taxAmount || "N/A"}
//                                                         </Typography>
//                                                     </>
//                                                 }
//                                             />
//                                         </ListItem>
//                                     ))}
//                                 </List>
//                             ) : (
//                                 <Typography variant="body2">No tax charges available.</Typography>
//                             )}
//                         </Box>

//                         <Typography variant="body1">
//                             <strong>Special Day Charges:</strong> ₹{booking.pricingDetails?.specialDayExtraCharge || 0}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Total:</strong> ₹{booking.pricingDetails?.totalAmount || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Tax Amount:</strong> ₹{booking.pricingDetails?.totalTaxAmount || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Final Total Amount :</strong>(<span>included all tax.</span>) ₹{booking.pricingDetails?.final_totalAmount || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Payment Status:</strong>  <Chip
//                                 label={booking.paymentStatus}
//                                 color={booking.paymentStatus === "Completed" ? "success" : "default"} // Approved, Pending, Rejected
//                                 size="small"
//                             />
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Payment Mode :</strong> {booking?.paymentMode || "N/A"}
//                         </Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                         <Typography variant="h6">Members</Typography>
//                         <Typography variant="body1">
//                             <strong>Primary Member:</strong> {booking.primaryMemberId?.name || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Invitation Of Member:</strong> {booking.invitationOfmember || "N/A"}
//                         </Typography>

//                         <Typography variant="body1">
//                             <strong>Total Attending Guest:</strong> {booking.attendingGuests || "N/A"}
//                         </Typography>
//                         <Typography variant="body1">
//                             <strong>Mobile Number:</strong> {booking.mobileNumber || "N/A"}
//                         </Typography>
// <Typography variant="body1">
//     <strong>Office Phone Number:</strong> {booking.officePhoneNumber || "N/A"}
// </Typography>
// <Typography variant="body1">
//     <strong>Residence Phone Number:</strong> {booking.residencePhoneNo || "N/A"}
// </Typography>
//                         <Button
//                             variant="contained"
//                             color="primary"
//                             startIcon={<FiEdit />}
//                             onClick={handleEditClick}
//                             sx={{ mt: 2 }}
//                         >
//                             Edit Booking Details
//                         </Button>
//                     </Grid>
//                 </Grid>
//             </Paper>

//             {/* Edit Dialog */}
//             <Dialog
//                 open={isEditDialogOpen}
//                 onClose={handleDialogClose}
//                 fullWidth
//                 maxWidth="sm"
//             >
//                 <DialogTitle>Edit Booking Details</DialogTitle>
//                 <DialogContent>
//                     {/* Booking Status Dropdown */}
//                     <FormControl fullWidth margin="dense">
//                         <InputLabel id="booking-status-label">Booking Status</InputLabel>
//                         <Select
//                             labelId="booking-status-label"
//                             name="bookingStatus"
//                             value={editBooking.bookingStatus || ""}
//                             onChange={handleInputChange}
//                             label="Booking Status"
//                         >
//                             {statusOptions.map((status) => (
//                                 <MenuItem key={status} value={status}>
//                                     {status}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>

//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleDialogClose} color="secondary">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSaveChanges} color="primary">
//                         Save Changes
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default SingleBooking;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { FiCheck, FiEdit, FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { fetchBanquetBookingDetails, updateBanquetBooking } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import Breadcrumb from "../../../components/common/Breadcrumb";

// Format Time in AM/PM
const formatTimeInIST = (timeStr) => {
    if (!timeStr) return "N/A";
    const todayDate = new Date().toISOString().split("T")[0];
    const timeInUTC = new Date(`${todayDate}T${timeStr}:00Z`);
    const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(timeInUTC);
};

const statusOptions = ["Pending", "Confirmed", "Cancelled"];

const SingleBooking = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState({});
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [editBooking, setEditBooking] = useState({ bookingId: id, bookingStatus: "" });

    // Fetch booking details
    useEffect(() => {
        getBookingById(id);
    }, [id]);

    const getBookingById = async (bookingId) => {
        try {
            const response = await fetchBanquetBookingDetails(bookingId);
            setBooking(response.data.booking);
            setEditBooking({ bookingStatus: response?.data?.booking?.bookingStatus });
        } catch (error) {
            console.error("Failed to fetch booking details:", error);
            showToast("Failed to fetch booking details. Please try again.", "error");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditBooking((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => setEditDialogOpen(true);
    const handleDialogClose = () => setEditDialogOpen(false);

    const handleSaveChanges = async (newStatus) => {
        try {
            const response = await updateBanquetBooking({
                // bookingId: id,
                // bookingStatus: editBooking.bookingStatus,
                bookingId: id,
                bookingStatus: newStatus,
            });
            if (response.status === 200) {
                getBookingById(id);
                setEditDialogOpen(false);
                showToast("Booking details updated successfully!", "success");
            } else {
                showToast("Failed to update booking details. Please try again.", "error");
            }
        } catch (error) {
            console.error("Failed to update booking details:", error);
            showToast("Failed to update booking details. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Breadcrumb />
            <Typography variant="h4" sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}>
                Booking Details
            </Typography>
            <Paper
                sx={{
                    p: 4,
                    mb: 3,
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Grid container spacing={3}>
                    {/* Booking Details */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            General Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Banquet:</strong> {booking?.banquetType?.banquetName?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Booking Dates:</strong>{" "}
                            {new Date(booking.bookingDates?.checkIn).toLocaleDateString() || "N/A"} -{" "}
                            {new Date(booking.bookingDates?.checkOut).toLocaleDateString() || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Booking Time:</strong>{" "}
                            {booking.bookingTime
                                ? `${formatTimeInIST(booking.bookingTime.from)} - ${formatTimeInIST(
                                    booking.bookingTime.to
                                )}`
                                : "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Status:</strong>{" "}
                            <Chip
                                label={booking.bookingStatus}
                                color={
                                    booking.bookingStatus === "Confirmed"
                                        ? "success"
                                        : booking.bookingStatus === "Cancelled"
                                            ? "error"
                                            : "default"
                                }
                                size="small"
                            />
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Payment Status:</strong>{" "}
                            <Chip
                                label={booking.paymentStatus || "N/A"}
                                color={booking.paymentStatus === "Completed" ? "success" : "default"}
                                size="small"
                            />
                        </Typography>
                        <Typography variant="body1">
                            <strong>Payment Mode:</strong> {booking?.paymentMode || "N/A"}
                        </Typography>
                    </Grid>

                    {/* Pricing Details */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Pricing Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Special Day Charges:</strong> ₹
                            {booking.pricingDetails?.specialDayExtraCharge || 0}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Total Amount:</strong> ₹{booking.pricingDetails?.totalAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Tax Amount:</strong> ₹{booking.pricingDetails?.totalTaxAmount || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Final Total:</strong> ₹{booking.pricingDetails?.final_totalAmount || "N/A"}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Tax Breakdown:</strong>
                            </Typography>
                            {booking.pricingDetails?.taxTypes?.length > 0 ? (
                                <List dense>
                                    {booking.pricingDetails.taxTypes.map((tax, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`${tax.taxType}: ₹${tax.taxAmount} (${tax.taxRate}%)`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <Typography variant="body2">No tax details available.</Typography>
                            )}
                        </Box>
                    </Grid>

                    {/* Member Details */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                            Member Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Primary Member:</strong> {booking.primaryMemberId?.name || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Guest Of:</strong> {booking.invitationOfmember || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Guests:</strong> {booking.attendingGuests || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Mobile:</strong> {booking.mobileNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Office Phone Number:</strong> {booking.officePhoneNumber || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Residence Phone Number:</strong> {booking.residencePhoneNo || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Address:</strong> {booking.address || "N/A"}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Occasion:</strong> {booking.occasion || "N/A"}
                        </Typography>
                    </Grid>
                </Grid>

                {/* <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiEdit />}
                    onClick={handleEditClick}
                    sx={{ mt: 3 }}
                >
                    Edit Booking
                </Button> */}
                {/* Confirm and Cancel Buttons */}
                {booking.bookingStatus === "Pending" && (
                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<FiCheck />}
                            onClick={() => handleSaveChanges("Confirmed")}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<FiX />}
                            onClick={() => handleSaveChanges("Cancelled")}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit Booking Status</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Booking Status</InputLabel>
                        <Select
                            name="bookingStatus"
                            value={editBooking.bookingStatus || ""}
                            onChange={handleInputChange}
                        >
                            {statusOptions.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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

export default SingleBooking;

// import React, { useEffect, useState, useRef } from "react";
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
//     Checkbox,
//     FormControlLabel,
//     IconButton,
// } from "@mui/material";
// import { BiImageAdd } from "react-icons/bi";
// import { FiPlus, FiTrash } from "react-icons/fi";
// import { showToast } from "../api/toast";
// import { useNavigate } from "react-router-dom";
// import { addRoom } from "../api/room";
// import { fetchAllCategories } from "../api/category";

// const guestTypeOptions = [
//     'Club Member',
//     'Club Member (Self Stay)',
//     'Corporate Member',
//     'Guest of Member (Indian)',
//     'Affiliated Club Member (Indian)',
//     'Nominees of Corporate Member',
//     'Affiliated Foreign Club',
//     'Foreign Guest',
// ];

// const amenitiesOptions = [
//     'WiFi',
//     'AC',
//     'Television',
//     'Mini Bar',
//     'Room Service',
//     'Gym Access',
//     'Swimming Pool',
//     'Laundry Service',
//     'Parking',
//     'Breakfast Included',
//     'Laundry'
// ];

// const bedTypeOptions = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Sofa Bed'];
// const statusOptions = ['Available', 'Booked', 'Under Maintenance'];

// const AddRoom = () => {
//     const [roomData, setRoomData] = useState({
//         roomName: "",
//         roomNumber: "",
//         floorNumber: "",
//         roomType: "",
//         minPrice: "",
//         maxPrice: "",
//         pricingDetails: [],
//         capacity: "",
//         amenities: [],
//         roomSize: "",
//         bedType: "",
//         smokingAllowed: false,
//         petFriendly: false,
//         accessible: false,
//         status: "",
//         description: "",
//     });
//     const [roomTypes, setRoomTypes] = useState([]);
//     const [images, setImages] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const imageInput = useRef(null);
//     const navigate = useNavigate();

//     // Fetch room types (categories)
//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const response = await fetchAllCategories();
//                 setRoomTypes(response.data.categories);
//             } catch (error) {
//                 showToast("Failed to fetch room types.", "error");
//             }
//         };
//         fetchCategories();
//     }, []);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setRoomData({ ...roomData, [name]: value });
//     };

//     const handleAmenitiesChange = (e) => {
//         const { value } = e.target;
//         setRoomData({ ...roomData, amenities: typeof value === 'string' ? value.split(',') : value });
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
//         setImages((prevImages) => [...prevImages, ...files]);
//     };

//     const handleRemoveImage = (index) => {
//         const updatedImages = images.filter((_, i) => i !== index);
//         setImages(updatedImages);
//     };

//     // Add new pricing detail
//     const handleAddPricingDetail = () => {
//         setRoomData((prevData) => ({
//             ...prevData,
//             pricingDetails: [...prevData.pricingDetails, { guestType: "", price: "", description: "" }],
//         }));
//     };

//     const handlePricingDetailChange = (index, field, value) => {
//         const updatedPricingDetails = [...roomData.pricingDetails];
//         updatedPricingDetails[index] = {
//             ...updatedPricingDetails[index],
//             [field]: value,
//         };
//         setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
//     };
//     const handleRemovePricingDetail = (index) => {
//         const updatedPricingDetails = roomData.pricingDetails.filter((_, i) => i !== index);
//         setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
//     };

//     const handleCheckboxChange = (e) => {
//         const { name, checked } = e.target;
//         setRoomData({ ...roomData, [name]: checked });
//     };
//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             const formData = new FormData();

//             // Add basic room data to formData
//             Object.entries(roomData).forEach(([key, value]) => {
//                 if (key === "pricingDetails") {
//                     // Handle nested pricingDetails array
//                     value.forEach((detail, index) => {
//                         formData.append(`pricingDetails[${index}][guestType]`, detail.guestType);
//                         formData.append(`pricingDetails[${index}][price]`, detail.price);
//                         formData.append(`pricingDetails[${index}][description]`, detail.description || "");
//                     });
//                 } else if (key === "amenities") {
//                     // Handle amenities array
//                     value.forEach((amenity) => formData.append("amenities", amenity));
//                 } else if (key === "features") {
//                     // Handle features as a JSON string
//                     formData.append(key, JSON.stringify({
//                         smokingAllowed: roomData.smokingAllowed,
//                         petFriendly: roomData.petFriendly,
//                         accessible: roomData.accessible,
//                     }));
//                 } else {
//                     formData.append(key, value);
//                 }
//             });

//             // Add images to formData
//             images.forEach((image) => formData.append("images", image));

//             console.log("Submitting FormData:", formData);

//             // Call the addRoom API with formData
//             const response = await addRoom(formData);
//             if (response.status === 201) {
//                 showToast("Room added successfully!", "success");
//                 navigate("/rooms");
//             } else {
//                 showToast(response.message || "Failed to add room.", "error");
//             }
//         } catch (error) {
//             showToast(error.message || "An error occurred while adding the room.", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     console.log(roomData, "addRoom data")


// const UploadBox = ({ onClick }) => (
//     <Box
//         onClick={onClick}
//         sx={{
//             marginTop: 3,
//             height: 200,
//             borderRadius: "10px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexDirection: "column",
//             borderStyle: "dashed",
//             borderWidth: "2px",
//             borderColor: "divider",
//             cursor: "pointer",
//         }}
//     >
//         <BiImageAdd style={{ fontSize: "50px", color: "#027edd" }} />
//         <Typography>Click to upload images</Typography>
//     </Box>
// );

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             <Typography variant="h6">Add Room</Typography>
//             <Paper sx={{ p: 3, maxWidth: "800px", margin: "0 auto" }}>
//                 <TextField label="Room Name" fullWidth margin="dense" name="roomName" value={roomData.roomName} onChange={handleInputChange} />
//                 <TextField label="Room Number" fullWidth margin="dense" name="roomNumber" value={roomData.roomNumber} onChange={handleInputChange} />
//                 <TextField label="Floor Number" fullWidth margin="dense" name="floorNumber" value={roomData.floorNumber} onChange={handleInputChange} />
//                 <TextField label="Min Price" fullWidth margin="dense" name="minPrice" value={roomData.minPrice} onChange={handleInputChange} />
//                 <TextField label="Max Price" fullWidth margin="dense" name="maxPrice" value={roomData.maxPrice} onChange={handleInputChange} />
//                 <TextField label="Capacity" fullWidth margin="dense" name="capacity" value={roomData.capacity} onChange={handleInputChange} />
//                 <TextField label="Room Size" fullWidth margin="dense" name="roomSize" value={roomData.roomSize} onChange={handleInputChange} /><FormControl fullWidth margin="dense">
//                     <InputLabel>Room Type</InputLabel>
//                     <Select name="roomType" value={roomData.roomType} onChange={handleInputChange}>
//                         {roomTypes.map((type) => <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>)}
//                     </Select>
//                 </FormControl>
//                 <FormControl fullWidth margin="dense">
//                     <InputLabel>Bed Type</InputLabel>
//                     <Select name="bedType" value={roomData.bedType} onChange={handleInputChange}>
//                         {bedTypeOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
//                     </Select>
//                 </FormControl>
//                 <FormControl fullWidth margin="dense">
//                     <InputLabel>Amenities</InputLabel>
//                     <Select
//                         multiple
//                         value={roomData.amenities}
//                         onChange={handleAmenitiesChange}
//                         renderValue={(selected) => selected.join(", ")}
//                     >
//                         {amenitiesOptions.map((option) => (
//                             <MenuItem key={option} value={option}>
//                                 <Checkbox checked={roomData.amenities.includes(option)} />
//                                 {option}
//                             </MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//                 <FormControl fullWidth margin="dense">
//                     <InputLabel>Status</InputLabel>
//                     <Select name="status" value={roomData.status} onChange={handleInputChange}>
//                         {statusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
//                     </Select>
//                 </FormControl>
//                 <FormControlLabel
//                     control={<Checkbox checked={roomData.smokingAllowed} onChange={handleCheckboxChange} name="smokingAllowed" />}
//                     label="Smoking Allowed"
//                 />
//                 <FormControlLabel
//                     control={<Checkbox checked={roomData.petFriendly} onChange={handleCheckboxChange} name="petFriendly" />}
//                     label="Pet Friendly"
//                 />
//                 <FormControlLabel
//                     control={<Checkbox checked={roomData.accessible} onChange={handleCheckboxChange} name="accessible" />}
//                     label="Accessible"
//                 />
//                 <TextField label="Facilities" fullWidth margin="dense" name="description" value={roomData.description} onChange={handleInputChange} />


//                 <Typography variant="h6">Pricing Details</Typography>
//                 {roomData.pricingDetails.map((detail, index) => (
//                     <Box key={index} sx={{ display: "flex", gap: 2 }}>
//                         <Select value={detail.guestType} onChange={(e) => handlePricingDetailChange(index, "guestType", e.target.value)}>
//                             {guestTypeOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
//                         </Select>
//                         <TextField label="Price" value={detail.price} onChange={(e) => handlePricingDetailChange(index, "price", e.target.value)} />
//                         <IconButton onClick={() => handleRemovePricingDetail(index)}>
//                             <FiTrash />
//                         </IconButton>
//                     </Box>
//                 ))}
//                 <Button variant="contained" color="primary" startIcon={<FiPlus />} onClick={handleAddPricingDetail}>
//                     Add Pricing Detail
//                 </Button>

//                 <UploadBox onClick={() => imageInput.current.click()} />
//                 <input type="file" hidden ref={imageInput} multiple onChange={handleImageChange} />

//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
//                     {images.map((image, index) => (
//                         <Box key={index} sx={{ position: "relative" }}>
//                             <img src={URL.createObjectURL(image)} alt="Room" style={{ width: 100, height: 100, borderRadius: 8 }} />
//                             <IconButton onClick={() => handleRemoveImage(index)} sx={{ position: "absolute", top: 0, right: 0 }}>
//                                 <FiTrash color="red" />
//                             </IconButton>
//                         </Box>
//                     ))}
//                 </Box>

//                 <Button variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading} onClick={handleSubmit}>
//                     {loading ? <CircularProgress size={24} /> : "Submit"}
//                 </Button>
//             </Paper>
//         </Box>
//     );
// };

// export default AddRoom;


import React, { useEffect, useState, useRef } from "react";
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
    Checkbox,
    FormControlLabel,
    IconButton,
} from "@mui/material";
import { BiImageAdd } from "react-icons/bi";
import { FiPlus, FiTrash } from "react-icons/fi";
import { showToast } from "../api/toast";
import { useNavigate } from "react-router-dom";
import { addRoom } from "../api/room";
import { fetchAllCategories } from "../api/category";

import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NumbersIcon from "@mui/icons-material/Numbers";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InputAdornment from "@mui/material/InputAdornment";
import { CurrencyRupee, Description, ToggleOff } from "@mui/icons-material";
import GroupsIcon from "@mui/icons-material/Groups";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CategoryIcon from "@mui/icons-material/Category";
import KingBedIcon from "@mui/icons-material/KingBed";
import HotelIcon from "@mui/icons-material/Hotel";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import PersonIcon from "@mui/icons-material/Person";

const guestTypeOptions = [
    'Club Member',
    'Club Member (Self Stay)',
    'Corporate Member',
    'Guest of Member (Indian)',
    'Affiliated Club Member (Indian)',
    'Nominees of Corporate Member',
    'Affiliated Foreign Club',
    'Foreign Guest',
];

const amenitiesOptions = [
    'WiFi',
    'AC',
    'Television',
    'Mini Bar',
    'Room Service',
    'Gym Access',
    'Swimming Pool',
    'Laundry Service',
    'Parking',
    'Breakfast Included',
    'Laundry'
];

const bedTypeOptions = ['Single', 'Double', 'Queen', 'King', 'Twin', 'Sofa Bed'];
const statusOptions = ['Available', 'Booked', 'Under Maintenance'];

const AddRoom = () => {
    const [roomData, setRoomData] = useState({
        roomName: "",
        roomNumber: "",
        floorNumber: "",
        roomType: "",
        minPrice: "",
        maxPrice: "",
        pricingDetails: [],
        capacity: "",
        amenities: [],
        roomSize: "",
        bedType: "",
        smokingAllowed: false,
        petFriendly: false,
        accessible: false,
        status: "",
        description: "",
    });
    const [roomTypes, setRoomTypes] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();

    // Fetch room types (categories)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchAllCategories();
                setRoomTypes(response.data.categories);
            } catch (error) {
                showToast("Failed to fetch room types.", "error");
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomData({ ...roomData, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Clear error on change
    };

    const handleAmenitiesChange = (e) => {
        const { value } = e.target;
        setRoomData({ ...roomData, amenities: typeof value === 'string' ? value.split(',') : value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    // Add new pricing detail
    const handleAddPricingDetail = () => {
        setRoomData((prevData) => ({
            ...prevData,
            pricingDetails: [...prevData.pricingDetails, { guestType: "", price: "", description: "" }],
        }));
    };

    const handlePricingDetailChange = (index, field, value) => {
        const updatedPricingDetails = [...roomData.pricingDetails];
        updatedPricingDetails[index] = {
            ...updatedPricingDetails[index],
            [field]: value,
        };
        setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    };

    const handleRemovePricingDetail = (index) => {
        const updatedPricingDetails = roomData.pricingDetails.filter((_, i) => i !== index);
        setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setRoomData({ ...roomData, [name]: checked });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!roomData.roomName) newErrors.roomName = "Room Name is required.";
        if (!roomData.roomNumber) newErrors.roomNumber = "Room Number is required.";
        if (!roomData.floorNumber) newErrors.floorNumber = "Floor Number is required.";
        if (!roomData.minPrice) newErrors.minPrice = "Min Price is required.";
        else if (isNaN(roomData.minPrice) || Number(roomData.minPrice) < 0) newErrors.minPrice = "Min Price must be a valid number.";

        if (!roomData.maxPrice) newErrors.maxPrice = "Max Price is required.";
        else if (isNaN(roomData.maxPrice) || Number(roomData.maxPrice) < 0) newErrors.maxPrice = "Max Price must be a valid number.";

        if (Number(roomData.minPrice) > Number(roomData.maxPrice)) newErrors.maxPrice = "Max Price must be greater than Min Price.";

        if (!roomData.capacity) newErrors.capacity = "Capacity is required.";
        else if (isNaN(roomData.capacity) || Number(roomData.capacity) <= 0) newErrors.capacity = "Capacity must be a valid positive number.";
        if (!roomData.roomType) newErrors.roomType = "Room Type is required.";
        if (!roomData.roomSize) newErrors.roomSize = "Room Size is required.";
        if (!roomData.bedType) newErrors.bedType = "Bed Type is required.";
        if (!roomData.status) newErrors.status = "Status is required.";

        if (roomData.pricingDetails.length === 0) newErrors.pricingDetails = "At least one pricing detail is required.";
        else {
            roomData.pricingDetails.forEach((detail, index) => {
                if (!detail.guestType) {
                    newErrors[`guestType_${index}`] = "Guest Type is required.";
                }
                if (!detail.price) {
                    newErrors[`price_${index}`] = "Price is required.";
                } else if (isNaN(detail.price) || Number(detail.price) < 0) {
                    newErrors[`price_${index}`] = "Price must be a valid number.";
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails

        setLoading(true);
        try {
            const formData = new FormData();

            // Add basic room data to formData
            Object.entries(roomData).forEach(([key, value]) => {
                if (key === "pricingDetails") {
                    // Handle nested pricingDetails array
                    value.forEach((detail, index) => {
                        formData.append(`pricingDetails[${index}][guestType]`, detail.guestType);
                        formData.append(`pricingDetails[${index}][price]`, detail.price);
                        formData.append(`pricingDetails[${index}][description]`, detail.description || "");
                    });
                } else if (key === "amenities") {
                    // Handle amenities array
                    value.forEach((amenity) => formData.append("amenities", amenity));
                } else if (key === "features") {
                    // Handle features as a JSON string
                    formData.append(key, JSON.stringify({
                        smokingAllowed: roomData.smokingAllowed,
                        petFriendly: roomData.petFriendly,
                        accessible: roomData.accessible,
                    }));
                } else {
                    formData.append(key, value);
                }
            });

            // Add images to formData
            images.forEach((image) => formData.append("images", image));

            console.log("Submitting FormData:", formData);

            // Call the addRoom API with formData
            const response = await addRoom(formData);
            if (response.status === 201) {
                showToast("Room added successfully!", "success");
                navigate("/rooms");
            } else {
                showToast(response.message || "Failed to add room.", "error");
            }
        } catch (error) {
            showToast(error.message || "An error occurred while adding the room.", "error");
        } finally {
            setLoading(false);
        }
    };

    const UploadBox = ({ onClick }) => (
        <Box
            onClick={onClick}
            sx={{
                marginTop: 3,
                height: 200,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                borderStyle: "dashed",
                borderWidth: "2px",
                borderColor: "divider",
                cursor: "pointer",
            }}
        >
            <BiImageAdd style={{ fontSize: "50px", color: "#027edd" }} />
            <Typography>Click to upload images</Typography>
        </Box>
    );


    return (
        <Box sx={{ pt: "70px", pb: "20px", px: "10px" }}>
            <Typography variant="h5" sx={{ mb: "20px", textAlign: "center", fontWeight: 600 }}>
                Create New Room
            </Typography>
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
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Name</InputLabel>
                    <TextField
                        placeholder="Enter room name"
                        fullWidth
                        margin="dense"
                        name="roomName"
                        value={roomData.roomName}
                        onChange={handleInputChange}
                        error={!!errors.roomName}
                        helperText={errors.roomName}
                        InputProps={{
                            startAdornment: <MeetingRoomIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Number</InputLabel>
                    <TextField
                        placeholder="Enter room number"
                        fullWidth
                        margin="dense"
                        name="roomNumber"
                        value={roomData.roomNumber}
                        onChange={handleInputChange}
                        error={!!errors.roomNumber}
                        helperText={errors.roomNumber}
                        InputProps={{
                            startAdornment: <NumbersIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Floor Number</InputLabel>
                    <TextField
                        placeholder="Enter floor number"
                        fullWidth
                        margin="dense"
                        name="floorNumber"
                        value={roomData.floorNumber}
                        onChange={handleInputChange}
                        error={!!errors.floorNumber}
                        helperText={errors.floorNumber}
                        InputProps={{
                            startAdornment: <ApartmentIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Min Price</InputLabel>
                    <TextField
                        placeholder="Enter minimum price"
                        fullWidth
                        margin="dense"
                        name="minPrice"
                        value={roomData.minPrice}
                        onChange={handleInputChange}
                        error={!!errors.minPrice}
                        helperText={errors.minPrice}
                        InputProps={{
                            startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Max Price</InputLabel>
                    <TextField
                        placeholder="Enter maximum price"
                        fullWidth
                        margin="dense"
                        name="maxPrice"
                        value={roomData.maxPrice}
                        onChange={handleInputChange}
                        error={!!errors.maxPrice}
                        helperText={errors.maxPrice}
                        InputProps={{
                            startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Capacity</InputLabel>
                    <TextField
                        placeholder="Enter room capacity"
                        fullWidth
                        margin="dense"
                        name="capacity"
                        value={roomData.capacity}
                        onChange={handleInputChange}
                        error={!!errors.capacity}
                        helperText={errors.capacity}
                        InputProps={{
                            startAdornment: <GroupsIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Size</InputLabel>
                    <TextField
                        placeholder="Enter room size"
                        fullWidth
                        margin="dense"
                        name="roomSize"
                        value={roomData.roomSize}
                        onChange={handleInputChange}
                        error={!!errors.roomSize}
                        helperText={errors.roomSize}
                        InputProps={{
                            startAdornment: <SquareFootIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Type</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.roomType}>
                        {/* <InputLabel>Room Type</InputLabel> */}
                        <Select name="roomType" value={roomData.roomType} onChange={handleInputChange} displayEmpty
                            startAdornment={<CategoryIcon sx={{ color: "gray", mr: 1 }} />}
                        >
                            <MenuItem value="" disabled>
                                Please Choose Room Type
                            </MenuItem>
                            {roomTypes.map((type) => (
                                <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.roomType && <Typography color="error">{errors.roomType}</Typography>}
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Bed Type</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.bedType}>
                        {/* <InputLabel>Bed Type</InputLabel> */}
                        <Select name="bedType" value={roomData.bedType} onChange={handleInputChange} displayEmpty
                            startAdornment={<KingBedIcon sx={{ color: "gray", mr: 1 }} />}>
                            <MenuItem value="" disabled>
                                Please Choose Bed Type
                            </MenuItem>
                            {bedTypeOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                        {errors.bedType && <Typography color="error">{errors.bedType}</Typography>}
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Amenities</InputLabel>
                    <FormControl fullWidth margin="dense">
                        {/* <InputLabel>Amenities</InputLabel> */}
                        <Select
                            multiple
                            value={roomData.amenities}
                            onChange={handleAmenitiesChange}
                            // renderValue={(selected) => selected.join(", ")}
                            renderValue={(selected) =>
                                selected.length === 0 ? "Please Choose Room Amenities" : selected.join(", ")
                            }
                            displayEmpty
                            startAdornment={<RoomPreferencesIcon sx={{ color: "gray", mr: 1 }} />}
                        >
                            <MenuItem value="" disabled>
                                Please Choose Room Amenities
                            </MenuItem>
                            {amenitiesOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    <Checkbox checked={roomData.amenities.includes(option)} />
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Status</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.status}>
                        {/* <InputLabel>Status</InputLabel> */}
                        <Select name="status" value={roomData.status} onChange={handleInputChange} displayEmpty
                            startAdornment={<HotelIcon sx={{ color: "gray", mr: 1 }} />}>
                            <MenuItem value="" disabled>
                                Please Choose Room Status
                            </MenuItem>
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                        {errors.status && <Typography color="error">{errors.status}</Typography>}
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Permissions</InputLabel>
                    <FormControlLabel
                        control={<Checkbox checked={roomData.smokingAllowed} onChange={handleCheckboxChange} name="smokingAllowed" />}
                        label="Smoking Allowed"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={roomData.petFriendly} onChange={handleCheckboxChange} name="petFriendly" />}
                        label="Pet Friendly"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={roomData.accessible} onChange={handleCheckboxChange} name="accessible" />}
                        label="Accessible"
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Facilities</InputLabel>
                    <TextField
                        placeholder="Enter Room Facilities"
                        fullWidth
                        margin="dense"
                        name="description"
                        value={roomData.description}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: <Description sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Pricing Details</InputLabel>
                    {/* <Typography variant="h6">Pricing Details</Typography> */}
                    {roomData.pricingDetails.map((detail, index) => (
                        <Box key={index} sx={{ display: "flex", gap: 2, margin: "5px" }}>
                            <Select
                                value={detail.guestType}
                                onChange={(e) => handlePricingDetailChange(index, "guestType", e.target.value)}
                                error={!!errors[`guestType_${index}`]}
                                displayEmpty
                                startAdornment={<GroupsIcon sx={{ color: "gray", mr: 1 }} />}
                            >
                                <MenuItem value="" disabled>
                                    Please Choose Guest Type
                                </MenuItem>
                                {guestTypeOptions.map((option) => (
                                    <MenuItem key={option} value={option}><PersonIcon style={{ marginRight: 8 }} />{option}</MenuItem>
                                ))}
                                {/* </ MenuItem> */}
                            </Select>
                            {errors[`guestType_${index}`] && <Typography color="error">{errors[`guestType_${index}`]}</Typography>}
                            < TextField
                                label="Price"
                                placeholder="Please Enter Price"
                                value={detail.price}
                                onChange={(e) => handlePricingDetailChange(index, "price", e.target.value)}
                                error={!!errors[`price_${index}`]}
                                InputProps={{
                                    startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                                }}
                            />
                            {errors[`price_${index}`] && <Typography color="error">{errors[`price_${index}`]}</Typography>}
                            <IconButton onClick={() => handleRemovePricingDetail(index)}>
                                <FiTrash />
                            </IconButton>
                        </Box>
                    ))
                    }
                    <Button variant="contained" color="primary" startIcon={<FiPlus />} onClick={handleAddPricingDetail} sx={{ marginTop: '5px', borderRadius: '15px', fontSize: '10px' }}>
                        Add Pricing Detail
                    </Button>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Images</InputLabel>
                    <UploadBox onClick={() => imageInput.current.click()} />
                    <input type="file" hidden ref={imageInput} multiple onChange={handleImageChange} />

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ position: "relative" }}>
                                <img src={URL.createObjectURL(image)} alt="Room" style={{ width: 100, height: 100, borderRadius: 8 }} />
                                <IconButton onClick={() => handleRemoveImage(index)} sx={{ position: "absolute", top: 0, right: 0 }}>
                                    <FiTrash color="red" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* <Button variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading} onClick={handleSubmit}>
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                </Button> */}
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
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Add Room"}
                    </Button>
                </Box>
            </Paper >
        </Box >
    );
};

export default AddRoom;
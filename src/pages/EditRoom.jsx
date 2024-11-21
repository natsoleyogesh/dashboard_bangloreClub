import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    ListItemText,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteRoomImage, fetchRoomDetails, updateRoomDetails, uploadRoomImage } from "../api/room";
import { fetchAllCategories } from "../api/category";
import { showToast } from "../api/toast";
import { PUBLIC_API_URI } from "../api/config";
import { FiTrash } from "react-icons/fi";


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

const EditRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
        images: [],
    });
    const [room, setRoom] = useState({})
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const imageInput = useRef(null);
    const [images, setImages] = useState([])

    // Fetch room details and categories
    const getRoomById = async () => {
        try {
            const response = await fetchRoomDetails(id);
            const room = response.data.room;
            setRoomData({
                roomName: room.roomName || "",
                roomNumber: room.roomNumber || "",
                floorNumber: room.floorNumber || "",
                roomType: room.roomType?._id || "",
                minPrice: room.priceRange?.minPrice || "",
                maxPrice: room.priceRange?.maxPrice || "",
                pricingDetails: room.pricingDetails || [],
                capacity: room.capacity || "",
                amenities: room.amenities || [],
                roomSize: room.roomSize || "",
                bedType: room.bedType || "",
                smokingAllowed: room.features?.smokingAllowed || false,
                petFriendly: room.features?.petFriendly || false,
                accessible: room.features?.accessible || false,
                status: room.status || "",
                description: room.description || "",
                images: room.images || [],
            });
        } catch (error) {
            showToast("Failed to fetch room details.", "error");
        }
    };

    const getCategories = async () => {
        try {
            const response = await fetchAllCategories();
            setRoomTypes(response.data.categories || []);
        } catch (error) {
            showToast("Failed to fetch categories.", "error");
        }
    };

    useEffect(() => {
        getRoomById();
        getCategories();
    }, [id]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoomData({ ...roomData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setRoomData({ ...roomData, [name]: checked });
    };

    // Handle JSON input changes
    const handleJsonInputChange = (e, field) => {
        try {
            const value = JSON.parse(e.target.value);
            setRoomData({ ...roomData, [field]: value });
        } catch (error) {
            showToast("Invalid JSON format.", "error");
        }
    };

    // Handle pricing details change
    const handlePricingDetailChange = (index, field, value) => {
        const updatedPricingDetails = [...roomData.pricingDetails];
        updatedPricingDetails[index] = {
            ...updatedPricingDetails[index],
            [field]: value,
        };
        setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    };

    // Add a new pricing detail
    const handleAddPricingDetail = () => {
        setRoomData({
            ...roomData,
            pricingDetails: [
                ...roomData.pricingDetails,
                { guestType: "", price: "", description: "" },
            ],
        });
    };

    // Handle amenities change
    const handleAmenitiesChange = (event) => {
        const { value } = event.target;
        // Ensure the value is an array, not a string
        const amenitiesArray = Array.isArray(value) ? value : value.split(',').map((item) => item.trim());
        setRoomData({
            ...roomData,
            amenities: amenitiesArray,
        });
    };

    // Remove a pricing detail
    const handleRemovePricingDetail = (index) => {
        const updatedPricingDetails = roomData.pricingDetails.filter(
            (_, i) => i !== index
        );
        setRoomData({ ...roomData, pricingDetails: updatedPricingDetails });
    };

    // Handle image deletion by index
    const handleDeleteImage = async (index) => {
        try {
            const updatedImages = roomData.images.filter((_, i) => i !== index);
            const updatedData = { ...roomData, images: updatedImages };
            await deleteRoomImage(id, index);
            getRoomById()
            showToast("Image deleted successfully.", "success");
            navigate(`/rooms/${id}`);
            // setRoomData(updatedData);
        } catch (error) {
            showToast("Failed to delete image.", "error");
        }
    };

    // Save changes
    const handleSaveChanges = async () => {
        try {
            const updatedData = {
                ...roomData,
                priceRange: {
                    minPrice: roomData.minPrice,
                    maxPrice: roomData.maxPrice,
                },
                features: {
                    smokingAllowed: roomData.smokingAllowed,
                    petFriendly: roomData.petFriendly,
                    accessible: roomData.accessible,
                },
            };
            console.log(updatedData, "updatedData")
            const response = await updateRoomDetails(id, updatedData);
            if (response.status === 200) {
                showToast("Room updated successfully.", "success");
                navigate(`/rooms/${id}`);
            }
        } catch (error) {
            showToast("Failed to update room details.", "error");
        }
    };

    // Handle image upload
    const handleUploadImage = async (event) => {
        const files = Array.from(event.target.files);

        // Check if files are selected
        if (!files || files.length === 0) {
            showToast("No files selected.", "error");
            return;
        }

        // Create FormData and append selected images
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            // Upload the images
            const response = await uploadRoomImage(id, formData);

            if (response.status === 200) {
                // Fetch the latest room details after image upload
                await getRoomById();
                showToast("Images uploaded successfully.", "success");
            } else {
                showToast(response.data.message || "Failed to upload images.", "error");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            showToast(error.response?.data?.message || "Failed to upload images. Please try again.", "error");
        }
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Typography variant="h4">Edit Room</Typography>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {roomData.images?.map((image, index) => (
                                <Box key={index} sx={{ position: "relative" }}>
                                    <img
                                        src={`${PUBLIC_API_URI}${image}`}
                                        // sx={{ width: 20, height: 20 }}
                                        height={120}
                                        width={120}
                                    />
                                    <IconButton onClick={() => handleDeleteImage(index)}>
                                        <FiTrash />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                        <input type="file" hidden ref={imageInput} multiple onChange={handleUploadImage} />
                        <Button variant="outlined" component="label" onClick={() => imageInput.current.click()}>
                            Upload Image

                        </Button>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <TextField label="Room Name" fullWidth margin="dense" name="roomName" value={roomData.roomName} onChange={handleInputChange} />
                        <TextField label="Room Number" fullWidth margin="dense" name="roomNumber" value={roomData.roomNumber} onChange={handleInputChange} />
                        <TextField label="Floor Number" fullWidth margin="dense" name="floorNumber" value={roomData.floorNumber} onChange={handleInputChange} />
                        <TextField label="Room Type" select fullWidth margin="dense" name="roomType" value={roomData.roomType} onChange={handleInputChange}>
                            {roomTypes.map((type) => (
                                <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Min Price" fullWidth margin="dense" name="minPrice" value={roomData.minPrice} onChange={handleInputChange} />
                        <TextField label="Max Price" fullWidth margin="dense" name="maxPrice" value={roomData.maxPrice} onChange={handleInputChange} />
                        <TextField label="Capacity" fullWidth margin="dense" name="capacity" value={roomData.capacity} onChange={handleInputChange} />
                        {/* <TextField label="Amenities" fullWidth margin="dense" value={roomData.amenities.join(",")} onChange={handleAmenitiesChange} /> */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Amenities</InputLabel>
                            <Select
                                multiple
                                value={roomData.amenities}
                                onChange={handleAmenitiesChange}
                                renderValue={(selected) => selected.join(', ')}
                            >
                                {amenitiesOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox checked={roomData.amenities.includes(option)} />
                                        <ListItemText primary={option} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField label="Room Size" fullWidth margin="dense" name="roomSize" value={roomData.roomSize} onChange={handleInputChange} />
                        <TextField label="Bed Type" select fullWidth margin="dense" name="bedType" value={roomData.bedType} onChange={handleInputChange}>
                            {bedTypeOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Status" select fullWidth margin="dense" name="status" value={roomData.status} onChange={handleInputChange}>
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                        <FormControlLabel control={<Checkbox checked={roomData.smokingAllowed} onChange={handleCheckboxChange} name="smokingAllowed" />} label="Smoking Allowed" />
                        <FormControlLabel control={<Checkbox checked={roomData.petFriendly} onChange={handleCheckboxChange} name="petFriendly" />} label="Pet Friendly" />
                        <FormControlLabel control={<Checkbox checked={roomData.accessible} onChange={handleCheckboxChange} name="accessible" />} label="Accessible" />
                        <Typography variant="h6">Pricing Details</Typography>
                        {roomData.pricingDetails.map((detail, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <TextField label="Guest Type" select fullWidth margin="dense" value={detail.guestType} onChange={(e) => handlePricingDetailChange(index, "guestType", e.target.value)}>
                                    {guestTypeOptions.map((option) => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </TextField>
                                <TextField label="Price" fullWidth margin="dense" value={detail.price} onChange={(e) => handlePricingDetailChange(index, "price", e.target.value)} />
                                <Button variant="outlined" color="error" onClick={() => handleRemovePricingDetail(index)}>Remove</Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={handleAddPricingDetail}>Add Pricing Detail</Button>
                        <TextField label="Description" fullWidth margin="dense" multiline rows={3} name="description" value={roomData.description} onChange={handleInputChange} />


                        <Button variant="contained" onClick={handleSaveChanges}>Save Changes</Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default EditRoom;

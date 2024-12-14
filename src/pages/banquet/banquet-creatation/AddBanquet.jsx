import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import { addBanquet, fetchActiveAllBanquetCategories } from "../../../api/banquet";
import { showToast } from "../../../api/toast";
import { CurrencyRupee } from "@mui/icons-material";
import { fetchAllActiveTaxTypes } from "../../../api/masterData/taxType";
import { fetchAllActiveAmenities } from "../../../api/masterData/amenities";
import { FiTrash } from "react-icons/fi";
import { BiImageAdd } from "react-icons/bi";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CategoryIcon from "@mui/icons-material/Category";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import HotelIcon from "@mui/icons-material/Hotel";

const statusOptions = ["Active", "Inactive"];

const AddBanquet = () => {
    const [banquetData, setBanquetData] = useState({
        banquetName: "",
        description: "",
        checkInTime: "12:00 PM",
        checkOutTime: "01:00 PM",
        maxAllowedPerRoom: "",
        priceRange: { minPrice: "", maxPrice: "" },
        pricingDetails: "",
        amenities: [],
        taxTypes: [],
        breakfastIncluded: false,
        banquetHallSize: "",
        cancellationPolicy: {
            before7Days: "",
            between7To2Days: "",
            between48To24Hours: "",
            lessThan24Hours: "",
        },
        features: { smokingAllowed: false, petFriendly: false, accessible: false },
        specialDayTariff: [{ special_day_name: '', startDate: '', endDate: '', extraCharge: '' }],
        pricingDetailDescription: "",
        status: 'Active',
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const imageInput = useRef(null);
    const navigate = useNavigate();
    const [banquetNames, setBanquetNames] = useState([]);
    // fetch the data in master table 
    const [amenitiesOptions, setAmenitiesOptions] = useState([]);
    const [taxTypes, setTaxTypes] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch room types (categories)
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchActiveAllBanquetCategories();
                setBanquetNames(response.data.categories);
            } catch (error) {
                showToast("Failed to fetch room types.", "error");
            }
        };
        fetchCategories();
        fetchTaxTypes();
        fetchAmenioties();
    }, []);

    const fetchTaxTypes = async () => {
        try {
            const response = await fetchAllActiveTaxTypes();
            setTaxTypes(response?.data?.data);
        } catch (error) {
            showToast("Failed to fetch room types.", "error");
        }
    };

    const fetchAmenioties = async () => {
        try {
            const response = await fetchAllActiveAmenities();
            setAmenitiesOptions(response?.data?.data);
        } catch (error) {
            showToast("Failed to fetch room types.", "error");
        }
    };




    const handleInputChange = (e) => {
        console.log(e.target.name, "-", e.target.value, "handleInputChangew")
        const { name, value } = e.target;
        setBanquetData({ ...banquetData, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Clear error on change
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log(files)
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setBanquetData({ ...banquetData, [name]: checked });
    };

    const handleChangeTaxTypes = (event) => {
        console.log(event.target.name, "-", event.target.value, "taxtype")

        const { value, checked } = event.target;
        if (checked) {
            setBanquetData({
                ...banquetData,
                taxTypes: [...banquetData.taxTypes, value],
            });
        } else {
            setBanquetData({
                ...banquetData,
                taxTypes: banquetData.taxTypes.filter((tax) => tax !== value),
            });
        }
    };

    // Handle checkbox changes for Amenities
    const handleChangeAmenities = (event) => {
        console.log(event.target.name, "-", event.target.checked, event.target.value, "amenities")

        const { value, checked } = event.target;
        if (checked) {
            setBanquetData({
                ...banquetData,
                amenities: [...banquetData.amenities, value], // Add amenity ID to array
            });
        } else {
            setBanquetData({
                ...banquetData,
                amenities: banquetData.amenities.filter((amenity) => amenity !== value), // Remove amenity ID from array
            });
        }
    };

    const handleCancalletionChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value, "handleInputChange");
        setBanquetData({
            ...banquetData,
            cancellationPolicy: {
                ...banquetData.cancellationPolicy,
                [name]: value,
            },
        });
        setErrors({ ...errors, [name]: '' }); // Clear error on change
    };

    // Handle change for form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, index, prop] = name.split('[').map((item) => item.replace(']', ''));

        if (index !== undefined && prop !== undefined) {
            const updatedSpecialDayTariff = [...banquetData.specialDayTariff];
            updatedSpecialDayTariff[index][prop] = value;
            setBanquetData({
                ...banquetData,
                specialDayTariff: updatedSpecialDayTariff,
            });
        } else {
            setBanquetData({
                ...banquetData,
                [field]: value,
            });
        }
    };

    // Add a new special day tariff entry
    const addSpecialDayTariff = () => {
        setBanquetData({
            ...banquetData,
            specialDayTariff: [
                ...banquetData.specialDayTariff,
                { special_day_name: '', startDate: '', endDate: '', extraCharge: '' },
            ],
        });
    };

    // Remove a special day tariff entry
    const removeSpecialDayTariff = (index) => {
        const updatedSpecialDayTariff = banquetData.specialDayTariff.filter((_, i) => i !== index);
        setBanquetData({
            ...banquetData,
            specialDayTariff: updatedSpecialDayTariff,
        });
    };


    const handlePriceInputChange = (event) => {
        const { name, value } = event.target;

        // Update minPrice or maxPrice based on the field name
        setBanquetData((prevData) => ({
            ...prevData,
            priceRange: {
                ...prevData.priceRange,
                [name]: value,
            },
        }));
    };


    const validateForm = () => {
        const newErrors = {};
        // Validate banquetName
        if (!banquetData.banquetName) newErrors.banquetName = "Room category is required.";

        // Validate description
        if (!banquetData.description) newErrors.description = "Room description is required.";

        // Validate check-in and check-out times
        if (!banquetData.checkInTime) newErrors.checkInTime = "Check-in time is required.";
        if (!banquetData.checkOutTime) newErrors.checkOutTime = "Check-out time is required.";

        // Validate maximum occupancy per room
        if (!banquetData.maxAllowedPerRoom) {
            newErrors.maxAllowedPerRoom = "Maximum occupancy per room is required.";
        } else if (isNaN(banquetData.maxAllowedPerRoom) || Number(banquetData.maxAllowedPerRoom) <= 0) {
            newErrors.maxAllowedPerRoom = "Maximum occupancy must be a valid positive number.";
        }



        // Validate priceRange
        const { minPrice, maxPrice } = banquetData.priceRange;
        if (!minPrice) newErrors.minPrice = "Min Price is required.";
        else if (isNaN(minPrice) || Number(minPrice) < 0) newErrors.minPrice = "Min Price must be a valid positive number.";

        if (!maxPrice) newErrors.maxPrice = "Max Price is required.";
        else if (isNaN(maxPrice) || Number(maxPrice) < 0) newErrors.maxPrice = "Max Price must be a valid positive number.";

        if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
            newErrors.maxPrice = "Max Price must be greater than Min Price.";
        }

        // Validate amenities
        if (banquetData.amenities.length === 0) {
            newErrors.amenities = "At least one amenity is required.";
        }

        // Validate features
        if (banquetData.features.smokingAllowed === undefined) {
            newErrors.smokingAllowed = "Smoking allowed field is required.";
        }
        if (banquetData.features.petFriendly === undefined) {
            newErrors.petFriendly = "Pet-friendly field is required.";
        }
        if (banquetData.features.accessible === undefined) {
            newErrors.accessible = "Accessible field is required.";
        }


        // Validate taxTypes
        if (banquetData.taxTypes.length === 0) {
            newErrors.taxTypes = "At least one tax type is required.";
        }

        // Validate cancellationPolicy
        const { before7Days, between7To2Days, between48To24Hours, lessThan24Hours } = banquetData.cancellationPolicy;
        if (!before7Days) newErrors.before7Days = "Cancellation policy for 'Before 7 Days' is required.";
        if (!between7To2Days) newErrors.between7To2Days = "Cancellation policy for 'Between 7 to 2 Days' is required.";
        if (!between48To24Hours) newErrors.between48To24Hours = "Cancellation policy for 'Between 48 to 24 Hours' is required.";
        if (!lessThan24Hours) newErrors.lessThan24Hours = "Cancellation policy for 'Less Than 24 Hours' is required.";



        // Validate specialDayTariff
        if (banquetData.specialDayTariff.length > 0) {
            banquetData.specialDayTariff.forEach((tariff, index) => {
                if (!tariff.special_day_name) {
                    newErrors[`specialDayName_${index}`] = "Special day name is required.";
                }
                if (!tariff.startDate) {
                    newErrors[`startDate_${index}`] = "Start date is required.";
                }
                if (!tariff.endDate) {
                    newErrors[`endDate_${index}`] = "End date is required.";
                }
                if (!tariff.extraCharge) {
                    newErrors[`extraCharge_${index}`] = "Extra charge is required.";
                } else if (isNaN(tariff.extraCharge) || Number(tariff.extraCharge) < 0) {
                    newErrors[`extraCharge_${index}`] = "Extra charge must be a valid positive number.";
                }
            });
        }


        // Validate banquetHallSize
        if (!banquetData.banquetHallSize) {
            newErrors.banquetHallSize = "Room size is required.";
        } else if (isNaN(banquetData.banquetHallSize) || Number(banquetData.banquetHallSize) <= 0) {
            newErrors.banquetHallSize = "Room size must be a valid positive number.";
        }

        
        // Validate status
        if (!roomData.status) newErrors.status = "Room status is required.";


        console.log(newErrors, "newErr---------------")
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }








    const handleSubmit = async () => {
        if (!validateForm()) return; // Prevent submission if validation fails

        setLoading(true);
        try {
            // setLoading(true);

            const formData = new FormData();
            Object.keys(banquetData).forEach((key) => {
                if (key === "priceRange" || key === "cancellationPolicy" || key === "features") {
                    Object.keys(banquetData[key]).forEach((subKey) => {
                        formData.append(`${key}[${subKey}]`, banquetData[key][subKey]);
                    });
                } else {
                    formData.append(key, banquetData[key]);
                }
            });

            formData.append("images", images);

            const response = await addBanquet(formData);

            if (response.status === 201) {
                showToast("Banquet added successfully!", "success");
                navigate("/banquets");
            } else {
                showToast(response.message || "Failed to add banquet. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error adding banquet:", error);
            showToast(error.response?.data?.message || "An error occurred. Please try again.", "error");
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
            <Typography
                variant="h5"
                sx={{
                    mb: "20px",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "primary.main",
                }}
            >
                Add New Banquet
            </Typography>
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: "12px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    backgroundColor: "#f9f9f9",
                }}
            >
                {/* Banquet Name */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Type</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.banquetName}>
                        {/* <InputLabel>Room Type</InputLabel> */}
                        <Select name="banquetName" value={banquetData.banquetName} onChange={handleInputChange}
                            startAdornment={<CategoryIcon sx={{ color: "gray", mr: 1 }} />}
                        >
                            <MenuItem value="" disabled>
                                Please Choose Banquet Category
                            </MenuItem>
                            {banquetNames.map((type) => (
                                <MenuItem key={type._id} value={type._id}>{type.name}</MenuItem>
                            ))}
                        </Select>
                        {errors.banquetName && <Typography color="error">{errors.banquetName}</Typography>}
                    </FormControl>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Description</InputLabel>
                    <ReactQuill
                        value={banquetData.description}
                        onChange={(value) =>
                            setBanquetData((prev) => ({ ...prev, description: value }))
                        }
                        placeholder="Describe the banquet"
                        style={{ height: "120px", borderRadius: "8px" }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Maxium Allowed PerRoom</InputLabel>
                    <TextField
                        placeholder="Enter Maxium Allowed PerRoom"
                        fullWidth
                        margin="dense"
                        name="maxAllowedPerRoom"
                        value={banquetData.maxAllowedPerRoom}
                        onChange={handleInputChange}
                        error={!!errors.maxAllowedPerRoom}
                        helperText={errors.maxAllowedPerRoom}
                        InputProps={{
                            startAdornment: <MeetingRoomIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>

                {/* Check-In and Check-Out Time */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Check In Time</InputLabel>
                    <TextField
                        type="time"
                        placeholder="Enter Check In Time"
                        fullWidth
                        margin="dense"
                        name="checkInTime"
                        value={banquetData.checkInTime}
                        onChange={handleInputChange}
                        error={!!errors.checkInTime}
                        helperText={errors.checkInTime}
                        InputProps={{
                            startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Check Out Time</InputLabel>
                    <TextField
                        type="time"
                        placeholder="Enter Chack Out Time"
                        fullWidth
                        margin="dense"
                        name="checkOutTime"
                        value={banquetData.checkOutTime}
                        onChange={handleInputChange}
                        error={!!errors.checkOutTime}
                        helperText={errors.checkOutTime}
                        InputProps={{
                            startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>

                {/* Max Allowed Per Room */}
                <Box sx={{ mb: 3 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: 1 }}>Max Allowed Per Room</InputLabel>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="maxAllowedPerRoom"
                        value={banquetData.maxAllowedPerRoom}
                        onChange={handleInputChange}
                        error={!!errors.maxAllowedPerRoom}
                        helperText={errors.maxAllowedPerRoom}
                        InputProps={{
                            startAdornment: <MeetingRoomIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>

                {/* Price Range */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Min Price</InputLabel>
                    <TextField
                        placeholder="Enter minimum price"
                        fullWidth
                        margin="dense"
                        name="minPrice"
                        value={banquetData.priceRange.minPrice}
                        onChange={handlePriceInputChange}
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
                        value={banquetData.priceRange.maxPrice}
                        onChange={handlePriceInputChange}
                        error={!!errors.maxPrice}
                        helperText={errors.maxPrice}
                        InputProps={{
                            startAdornment: <CurrencyRupee sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Size</InputLabel>
                    <TextField
                        placeholder="Enter hall size"
                        fullWidth
                        margin="dense"
                        name="banquetHallSize"
                        value={banquetData.banquetHallSize}
                        onChange={handleInputChange}
                        error={!!errors.banquetHallSize}
                        helperText={errors.banquetHallSize}
                        InputProps={{
                            startAdornment: <SquareFootIcon sx={{ color: "gray", mr: 1 }} />,
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Amenities</InputLabel>
                    <FormControl fullWidth>
                        {/* <InputLabel>Amenities</InputLabel> */}
                        <div>
                            {amenitiesOptions.map(amenity => (
                                <FormControlLabel
                                    key={amenity._id}
                                    control={
                                        <Checkbox
                                            checked={banquetData.amenities.includes(amenity._id)}
                                            onChange={handleChangeAmenities}
                                            value={amenity._id}
                                        />
                                    }
                                    label={amenity.name}
                                />
                            ))}
                        </div>
                    </FormControl>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Status</InputLabel>
                    <FormControl fullWidth margin="dense" error={!!errors.status}>
                        <Select name="status" value={banquetData.status} onChange={handleInputChange} displayEmpty
                            startAdornment={<HotelIcon sx={{ color: "gray", mr: 1 }} />}>
                            <MenuItem value="" disabled>
                                Please Choose  Status
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
                        control={<Checkbox checked={banquetData.smokingAllowed} onChange={handleCheckboxChange} name="smokingAllowed" />}
                        label="Smoking Allowed"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={banquetData.petFriendly} onChange={handleCheckboxChange} name="petFriendly" />}
                        label="Pet Friendly"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={banquetData.accessible} onChange={handleCheckboxChange} name="accessible" />}
                        label="Accessible"
                    />
                </Box>

                {/* Tax Types */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Applicable Tax Types</InputLabel>

                    <FormControl fullWidth>
                        {/* <InputLabel>Tax Types</InputLabel> */}
                        <div>
                            {taxTypes.map(tax => (
                                <FormControlLabel
                                    key={tax._id}
                                    control={
                                        <Checkbox
                                            checked={banquetData.taxTypes.includes(tax._id)}
                                            onChange={handleChangeTaxTypes}
                                            value={tax._id}
                                        />
                                    }
                                    label={tax.name}
                                />
                            ))}
                        </div>
                    </FormControl>
                </Box>

                {/* Cancellation Policy */}
                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: 'bold', mb: 2 }}>Cancellation Policies In (%)</InputLabel>

                    {/* Cancellation Before 7 Days */}
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Cancellation Before 7 Days</InputLabel>
                        <TextField
                            fullWidth
                            name="before7Days"
                            type="text"
                            value={banquetData.cancellationPolicy.before7Days}
                            onChange={handleCancalletionChange}
                            error={!!errors.before7Days}
                            helperText={errors.before7Days}
                        />
                    </Box>

                    {/* Cancellation Between 7 to 2 Days */}
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Between 7 to 2 Days</InputLabel>
                        <TextField
                            fullWidth
                            name="between7To2Days"
                            type="text"
                            value={banquetData.cancellationPolicy.between7To2Days}
                            onChange={handleCancalletionChange}
                            error={!!errors.between7To2Days}
                            helperText={errors.between7To2Days}
                        />
                    </Box>

                    {/* Cancellation Between 48 to 24 Hours */}
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Between 48 to 24 Hours</InputLabel>
                        <TextField
                            fullWidth
                            name="between48To24Hours"
                            type="text"
                            value={banquetData.cancellationPolicy.between48To24Hours}
                            onChange={handleCancalletionChange}
                            error={!!errors.between48To24Hours}
                            helperText={errors.between48To24Hours}
                        />
                    </Box>

                    {/* Cancellation Less Than 24 Hours */}
                    <Box sx={{ mb: 2 }}>
                        <InputLabel sx={{ fontWeight: 'medium', mb: 1 }}>Less Than 24 Hours</InputLabel>
                        <TextField
                            fullWidth
                            name="lessThan24Hours"
                            type="text"
                            value={banquetData.cancellationPolicy.lessThan24Hours}
                            onChange={handleCancalletionChange}
                            error={!!errors.lessThan24Hours}
                            helperText={errors.lessThan24Hours}
                        />
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Room Breakfast Included</InputLabel>
                    <FormControlLabel
                        control={<Checkbox checked={banquetData.breakfastIncluded} onChange={handleCheckboxChange} name="breakfastIncluded" />}
                        label="Breakfast Included"
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <InputLabel sx={{ fontWeight: "bold", mb: "4px" }}>Special Day Tarrif Details</InputLabel>
                    {banquetData.specialDayTariff.map((tariff, index) => (
                        <Box key={index} sx={{ display: "flex", gap: 2, margin: "5px" }}>
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][special_day_name]`}
                                label="Special Day Name"
                                value={tariff.special_day_name}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][startDate]`}
                                label="Start Date"
                                type="date"
                                value={tariff.startDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][endDate]`}
                                label="End Date"
                                type="date"
                                value={tariff.endDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                fullWidth
                                name={`specialDayTariff[${index}][extraCharge]`}
                                label="Extra Charge"
                                type="number"
                                value={tariff.extraCharge}
                                onChange={handleChange}
                            />

                            {/* Remove Button */}
                            {banquetData.specialDayTariff.length > 1 && (
                                <IconButton onClick={() => removeSpecialDayTariff(index)}>
                                    <FiTrash />
                                </IconButton>
                            )}
                        </Box>
                    ))}

                    {/* Add Button */}
                    <Box sx={{ mb: 2 }}>
                        <Button variant="contained" onClick={addSpecialDayTariff}>
                            Add Special Day Tariff
                        </Button>
                    </Box>
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

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Add Banquet"
                        )}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AddBanquet;

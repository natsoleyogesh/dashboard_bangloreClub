import { Avatar, Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { deleteRoom, fetchAllRooms } from "../api/room";
import { fetchAllCategories } from "../api/category";
import { PUBLIC_API_URI } from "../api/config";

import { showToast } from "../api/toast";
import ConfirmationDialog from "../api/ConfirmationDialog";

const Rooms = () => {
    const navigate = useNavigate();
    const [roomList, setRoomList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    // Fetch all categories (room types)
    const getAllCategories = async () => {
        try {
            const response = await fetchAllCategories();
            setCategories(response?.data?.categories || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            showToast("Failed to fetch room categories.", "error");
        }
    };

    // Fetch all rooms
    const getRooms = async () => {
        try {
            const response = await fetchAllRooms();
            setRoomList(response?.data?.rooms || []);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
            showToast("Failed to fetch rooms.", "error");
        }
    };

    useEffect(() => {
        // getAllCategories();
        getRooms();
    }, []);

    const handleDeleteClick = (room) => {
        setSelectedRoom(room);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const roomId = selectedRoom._id;
        try {
            await deleteRoom(roomId);
            getRooms(); // Refresh the list after deletion
            showToast("Room deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete room:", error);
            showToast("Failed to delete room.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedRoom(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedRoom(null);
    };
    const roomColumns = [
        {
            accessorKey: "images",
            header: "Image",
            size: 100,
            Cell: ({ cell }) => (
                <Avatar
                    src={`${PUBLIC_API_URI}${cell.getValue()?.[0]}`}
                    alt="Room Image"
                    sx={{ width: 100, height: 100 }}
                />
            ),
        },
        {
            accessorKey: "roomName",
            header: "Room Name",
        },
        {
            accessorKey: "roomNumber",
            header: "Room Number",
        },
        {
            accessorKey: "roomType.name",
            header: "Room Type",
        },
        {
            accessorKey: "priceRange",
            header: "Price Range",
            Cell: ({ cell }) => {
                const { minPrice, maxPrice } = cell.getValue() || {};
                return `₹${minPrice} - ₹${maxPrice}`;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "capacity",
            header: "Capacity",
        },
        {
            accessorKey: "amenities",
            header: "Amenities",
            Cell: ({ cell }) => cell.getValue()?.join(", "),
        },
        {
            accessorKey: "features",
            header: "Features",
            Cell: ({ cell }) => {
                const features = cell.getValue();
                return `Smoking: ${features.smokingAllowed ? "Yes" : "No"}, Pet-Friendly: ${features.petFriendly ? "Yes" : "No"}, Accessible: ${features.accessible ? "Yes" : "No"}`;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
        },
    ];

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h6">Rooms</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Link to="/room/add" style={{ textDecoration: "none" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FiPlus />}
                            sx={{ borderRadius: "20px" }}
                        >
                            Add Room
                        </Button>
                    </Link>
                </Box>
            </Box>
            <Table
                data={roomList.filter((room) =>
                    selectedCategory ? room.roomType?.name === selectedCategory : true
                )}
                fields={roomColumns}
                numberOfRows={roomList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="rooms"
                handleDelete={handleDeleteClick}
            />
            <ConfirmationDialog
                open={openDialog}
                title="Delete Room"
                message={`Are you sure you want to delete room "${selectedRoom?.roomName}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Rooms;

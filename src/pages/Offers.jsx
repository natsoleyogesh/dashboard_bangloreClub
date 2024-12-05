import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { deleteEvent, fetchAllEvents } from "../api/event";
import { PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteOffer, fetchAllOffers } from "../api/offer";

const Offers = () => {


    const navigate = useNavigate();

    const [offerList, setOfferList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);

    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    // Format time to "01:00 PM"
    // const formatTime = (timeString) => {
    //     const [hour, minute] = timeString.split(':').map(Number);
    //     const date = new Date();
    //     date.setHours(hour, minute);
    //     return date.toLocaleTimeString(undefined, {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: true,
    //     });
    // };


    const offerColumns = [
        {
            accessorKey: "bannerImage", //access nested data with dot notation
            header: "Image",
            size: 100,
            Cell: ({ cell }) => (
                <div>
                    <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} alt={"Offer Image"} variant="rounded" sx={{ width: 100, height: 100, objectFit: "cover" }} />
                    {/* <img
                        src={`${PUBLIC_API_URI}${cell.getValue()}}`}
                        // sx={{ width: 120, height: 120 }}
                        height={120}
                        width={120}
                    /> */}
                </div>
            ),
        },
        {
            accessorKey: "title", //access nested data with dot notation
            header: "Offer Title",
        },
        // {
        //     accessorKey: "description", //access nested data with dot notation
        //     header: "Offer Description",
        // },
        {
            accessorKey: "description", // normal accessorKey
            header: "Description",
            Cell: ({ row }) => (
                <div
                    dangerouslySetInnerHTML={{ __html: row.original.description }}
                    style={{ maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                />
            ),
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        // {
        //     accessorKey: "startTime",
        //     header: "Start Time",
        //     Cell: ({ cell }) => formatTime(cell.getValue()),
        // },
        // {
        //     accessorKey: "endTime",
        //     header: "End Time",
        //     Cell: ({ cell }) => formatTime(cell.getValue()),
        // },
        {
            accessorKey: "couponCode", //normal accessorKey
            header: "Offer Coupon Code",
        },
        {
            accessorKey: "discountPercentage", //normal accessorKey
            header: "Offer Discount %",
        },
        {
            accessorKey: "type", //normal accessorKey
            header: "Offer Type",
        },
        {
            accessorKey: "department", //normal accessorKey
            header: "Offer Department",
        },
        {
            accessorKey: "status", //normal accessorKey
            header: "Offer Status",
        },


    ];

    const getOffers = async () => {
        try {
            const offer = await fetchAllOffers();
            console.log(offer.data.offers, "user")
            setOfferList(offer?.data.offers);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    useEffect(() => {

        getOffers();
    }, []);

    console.log(offerList, "member")

    const handleDeleteClick = (event) => {
        setSelectedOffer(event);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const offerId = selectedOffer._id;
        console.log(offerId, "usersgshg")
        try {
            await deleteOffer(offerId);
            getOffers()

            showToast("offer deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete member:", error);
            showToast(error.message || "Failed to delete member.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedOffer(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedOffer(null);
    };


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
                <Typography variant="h6">Events</Typography>
                <Link to="/offer/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Offer
                    </Button>
                </Link>
            </Box>
            <Table
                data={offerList}
                fields={offerColumns}
                numberOfRows={offerList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="offer"
                handleDelete={handleDeleteClick}
            />
            <ConfirmationDialog
                open={openDialog}
                title="Delete Offer"
                message={`Are you sure you want to delete offer ${selectedOffer?.title}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Offers;

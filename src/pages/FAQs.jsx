import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../components/Table";
import { showToast } from "../api/toast";
import { fetchAllFAQs, deleteFAQ } from "../api/faq";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { formatDateTime } from "../api/config";

const FAQs = () => {
    const [faqs, setFaqs] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);

    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "question", header: "FAQ Question" },
        { accessorKey: "answer", header: "FAQ Answer" },
        { accessorKey: "category", header: "FAQ Category" },
        { accessorKey: "status", header: "Status" },
        {
            accessorKey: "createdAt",
            header: "Created Date & Time",
            Cell: ({ cell }) => formatDateTime(cell.getValue()),
        },
    ];

    // Fetch all FAQs
    const fetchFAQs = async () => {
        try {
            const response = await fetchAllFAQs();
            setFaqs(response?.data?.faqs || []);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
            showToast("Failed to fetch FAQs. Please try again.", "error");
        }
    };

    // Fetch FAQs on component mount
    useEffect(() => {
        fetchFAQs();
    }, []);

    // Handle delete confirmation dialog
    const handleDeleteClick = (faq) => {
        setSelectedFaq(faq);
        setOpenDialog(true);
    };

    // Confirm and delete FAQ
    const handleConfirmDelete = async () => {
        try {
            if (selectedFaq) {
                await deleteFAQ(selectedFaq._id);
                showToast("FAQ deleted successfully.", "success");
                fetchFAQs(); // Refresh FAQ list
            }
        } catch (error) {
            console.error("Error deleting FAQ:", error);
            showToast("Failed to delete FAQ. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedFaq(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedFaq(null);
    };

    return (
        <Box sx={{ pt: "80px", pb: "20px" }}>
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6">FAQs</Typography>
                <Link to="/faq/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add FAQ
                    </Button>
                </Link>
            </Box>

            {/* FAQs Table */}
            <Table
                data={faqs}
                fields={columns}
                numberOfRows={faqs.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="faq"
                handleDelete={handleDeleteClick}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete FAQ"
                message={`Are you sure you want to delete the FAQ "${selectedFaq?.question}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default FAQs;

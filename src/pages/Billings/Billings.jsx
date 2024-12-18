import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import Table from "../../components/Table"
import { deleteBilling, fetchAllBillings } from "../../api/billing";
import { showToast } from "../../api/toast";
import ConfirmationDialog from "../../api/ConfirmationDialog";


const Billings = () => {
    const [billings, setBillings] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBilling, setSelectedBilling] = useState(null);

    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "invoiceNumber", header: "Invoice Number" },
        { accessorKey: "memberId.name", header: "Member Name" },
        { accessorKey: "serviceType", header: "Service Type" },
        { accessorKey: "paymentStatus", header: "Payment Status" },
        // {
        //     accessorKey: "paymentStatus",
        //     header: "Payment Status",
        //     //or in the component override callbacks like this
        //     Cell: ({ cell, row }) => (
        //         <div>
        //             {row.original.status === "Success" && (
        //                 <span
        //                     className="status"
        //                     style={{ color: "#388b84", backgroundColor: "#388b8433" }}
        //                 >
        //                     {cell.getValue()}
        //                 </span>
        //             )}
        //             {row.original.status === "Failed" && (
        //                 <span
        //                     className="status"
        //                     style={{ color: "#fd4332", backgroundColor: "#fd433233" }}
        //                 >
        //                     {cell.getValue()}
        //                 </span>
        //             )}
        //         </div>
        //     ),
        // },
        {
            accessorKey: "invoiceDate",
            header: "Invoice Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "totalAmount",
            header: "Total Amount",
            Cell: ({ cell }) => `₹${cell.getValue()}`, // Format as currency
        },
    ];

    // Fetch all billings
    const fetchAllBillingData = async () => {
        try {
            const response = await fetchAllBillings();
            setBillings(response?.data?.billings || []); // Set billings to the fetched data
        } catch (error) {
            console.error("Error fetching billings:", error);
            showToast("Failed to fetch billings. Please try again.", "error");
        }
    };

    // Fetch billings on component mount
    useEffect(() => {
        fetchAllBillingData();
    }, []);

    // Handle delete confirmation dialog
    const handleDeleteClick = (billing) => {
        setSelectedBilling(billing);
        setOpenDialog(true);
    };

    // Confirm and delete billing
    const handleConfirmDelete = async () => {
        try {
            if (selectedBilling) {
                await deleteBilling(selectedBilling._id);
                showToast("Billing record deleted successfully.", "success");
                fetchAllBillingData(); // Refresh billings list
            }
        } catch (error) {
            console.error("Error deleting billing record:", error);
            showToast("Failed to delete billing record. Please try again.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedBilling(null);
        }
    };

    // Cancel delete dialog
    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedBilling(null);
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
                <Typography variant="h6">Billings</Typography>
                {/* <Link to="/billing/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Billing
                    </Button>
                </Link> */}
            </Box>

            {/* Billings Table */}
            <Table
                data={billings}
                fields={columns}
                numberOfRows={billings.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
                showPreview
                routeLink="billing"
            // handleDelete={handleDeleteClick}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={openDialog}
                title="Delete Billing Record"
                message={`Are you sure you want to delete the billing record for invoice number "${selectedBilling?.invoiceNumber}"? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default Billings;

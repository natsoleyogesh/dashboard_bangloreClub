import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid,
} from "@mui/material";
import Table from "../../components/Table";
import { fetchAllTransactions } from "../../api/billing";
import { showToast } from "../../api/toast";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    // Utility function to format dates
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Table columns definition
    const columns = [
        { accessorKey: "transactionId", header: "Transaction ID" },
        { accessorKey: "memberId.name", header: "Member Name" },
        { accessorKey: "billingId.invoiceNumber", header: "Invoice Number" },
        {
            accessorKey: "paymentStatus",
            header: "Payment Status",
            //or in the component override callbacks like this
            Cell: ({ cell, row }) => (
                <div>
                    {row.original.paymentStatus === "Success" && (
                        <span
                            className="status"
                            style={{ color: "#388b84", backgroundColor: "#388b8433" }}
                        >
                            {cell.getValue()}
                        </span>
                    )}
                    {row.original.paymentStatus === "Failed" && (
                        <span
                            className="status"
                            style={{ color: "#fd4332", backgroundColor: "#fd433233" }}
                        >
                            {cell.getValue()}
                        </span>
                    )}
                </div>
            ),
        },
        { accessorKey: "billingId.serviceType", header: "Service Type" },
        { accessorKey: "paymentMethod", header: "Payment Method" },
        {
            accessorKey: "paymentDate",
            header: "Payment Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "paymentAmount",
            header: "Payment Amount",
            Cell: ({ cell }) => `₹${cell.getValue()}`, // Format as currency
        },
        // { accessorKey: "paymentStatus", header: "Payment Status" },
    ];

    // Fetch all transactions
    const fetchAllTransactionData = async () => {
        try {
            const response = await fetchAllTransactions();
            setTransactions(response?.data?.transactions || []); // Set transactions to the fetched data
        } catch (error) {
            console.error("Error fetching transactions:", error);
            showToast("Failed to fetch transactions. Please try again.", "error");
        }
    };

    // Fetch transactions on component mount
    useEffect(() => {
        fetchAllTransactionData();
    }, []);

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
                <Typography variant="h6">Transactions</Typography>
            </Box>

            {/* Transactions Table */}
            <Table
                data={transactions}
                fields={columns}
                numberOfRows={transactions.length}
                enableTopToolBar
                enableBottomToolBar
                enablePagination
                enableRowSelection
                enableColumnFilters
                enableEditing
                enableColumnDragging
            // showPreview
            // routeLink="transaction"
            />
        </Box>
    );
};

export default Transactions;
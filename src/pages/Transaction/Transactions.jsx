// import React, { useEffect, useState } from "react";
// import {
//     Box,
//     Button,
//     Typography,
//     Paper,
//     Grid,
// } from "@mui/material";
// import Table from "../../components/Table";
// import { fetchAllTransactions } from "../../api/billing";
// import { showToast } from "../../api/toast";

// const Transactions = () => {
//     const [transactions, setTransactions] = useState([]);

//     // Utility function to format dates
//     const formatDate = (dateString) => {
//         const options = { year: "numeric", month: "long", day: "numeric" };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     // Table columns definition
//     const columns = [
//         { accessorKey: "transactionId", header: "Transaction ID" },
//         { accessorKey: "memberId.name", header: "Member Name" },
//         { accessorKey: "billingId.invoiceNumber", header: "Invoice Number" },
//         {
//             accessorKey: "paymentStatus",
//             header: "Payment Status",
//             //or in the component override callbacks like this
//             Cell: ({ cell, row }) => (
//                 <div>
//                     {row.original.paymentStatus === "Success" && (
//                         <span
//                             className="status"
//                             style={{ color: "#388b84", backgroundColor: "#388b8433" }}
//                         >
//                             {cell.getValue()}
//                         </span>
//                     )}
//                     {row.original.paymentStatus === "Failed" && (
//                         <span
//                             className="status"
//                             style={{ color: "#fd4332", backgroundColor: "#fd433233" }}
//                         >
//                             {cell.getValue()}
//                         </span>
//                     )}
//                 </div>
//             ),
//         },
//         { accessorKey: "billingId.serviceType", header: "Service Type" },
//         {
//             accessorKey: "paymentMethod",
//             header: "Payment Method",
//             Cell: ({ cell, row }) => row.original.paymentMethod ? cell.getValue() : 'N/A'
//         },
//         {
//             accessorKey: "paymentDate",
//             header: "Payment Date",
//             Cell: ({ cell }) => formatDate(cell.getValue()),
//         },
//         {
//             accessorKey: "paymentAmount",
//             header: "Payment Amount",
//             Cell: ({ cell }) => `₹${cell.getValue()}`, // Format as currency
//         },
//         // { accessorKey: "paymentStatus", header: "Payment Status" },
//     ];

//     // Fetch all transactions
//     const fetchAllTransactionData = async () => {
//         try {
//             const response = await fetchAllTransactions();
//             setTransactions(response?.data?.transactions || []); // Set transactions to the fetched data
//         } catch (error) {
//             console.error("Error fetching transactions:", error);
//             showToast("Failed to fetch transactions. Please try again.", "error");
//         }
//     };

//     // Fetch transactions on component mount
//     useEffect(() => {
//         fetchAllTransactionData();
//     }, []);

//     return (
//         <Box sx={{ pt: "80px", pb: "20px" }}>
//             {/* Header Section */}
//             <Box
//                 sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     mb: 2,
//                 }}
//             >
//                 <Typography variant="h6">Transactions</Typography>
//             </Box>

//             {/* Transactions Table */}
//             <Table
//                 data={transactions}
//                 fields={columns}
//                 numberOfRows={transactions.length}
//                 enableTopToolBar
//                 enableBottomToolBar
//                 enablePagination
//                 enableRowSelection
//                 enableColumnFilters
//                 enableEditing
//                 enableColumnDragging
//             // showPreview
//             // routeLink="transaction"
//             />
//         </Box>
//     );
// };

// export default Transactions;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import Table from "../../components/Table";
import { fetchAllTransactions } from "../../api/billing";
import { showToast } from "../../api/toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

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
        {
            accessorKey: "paymentMethod",
            header: "Payment Method",
            Cell: ({ cell, row }) => row.original.paymentMethod ? cell.getValue() : 'N/A'
        },
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

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Transaction Records", 10, 10);
        autoTable(doc, {
            head: [columns.map((col) => col.header)],
            body: transactions.map((row) => [
                row.transactionId,
                row.memberId?.name || "N/A",
                row.billingId?.invoiceNumber || "N/A",
                row.paymentStatus,
                row.billingId?.serviceType || "N/A",
                row.paymentMethod || "N/A",
                formatDate(row.paymentDate),
                `${row.paymentAmount}`,
            ]),
        });
        doc.save("transactions.pdf");
    };

    // Export to CSV
    const exportToCSV = () => {
        const csvData = transactions.map((row) => ({
            TransactionID: row.transactionId,
            MemberName: row.memberId?.name || "N/A",
            InvoiceNumber: row.billingId?.invoiceNumber || "N/A",
            PaymentStatus: row.paymentStatus,
            ServiceType: row.billingId?.serviceType || "N/A",
            PaymentMethod: row.paymentMethod || "N/A",
            PaymentDate: formatDate(row.paymentDate),
            PaymentAmount: `₹${row.paymentAmount}`,
        }));
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "transactions.csv");
    };

    // Export to XLS
    const exportToXLS = () => {
        const xlsData = transactions.map((row) => ({
            TransactionID: row.transactionId,
            MemberName: row.memberId?.name || "N/A",
            InvoiceNumber: row.billingId?.invoiceNumber || "N/A",
            PaymentStatus: row.paymentStatus,
            ServiceType: row.billingId?.serviceType || "N/A",
            PaymentMethod: row.paymentMethod || "N/A",
            PaymentDate: formatDate(row.paymentDate),
            PaymentAmount: `₹${row.paymentAmount}`,
        }));
        const worksheet = XLSX.utils.json_to_sheet(xlsData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
        XLSX.writeFile(workbook, "transactions.xlsx");
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
                <Typography variant="h6">Transactions</Typography>
                <Box>
                    <Button variant="contained" color="primary" onClick={exportToPDF} sx={{ mr: 1 }}>
                        Export to PDF
                    </Button>
                    <Button variant="contained" color="primary" onClick={exportToCSV} sx={{ mr: 1 }}>
                        Export to CSV
                    </Button>
                    <Button variant="contained" color="primary" onClick={exportToXLS}>
                        Export to XLS
                    </Button>
                </Box>
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
            />
        </Box>
    );
};

export default Transactions;

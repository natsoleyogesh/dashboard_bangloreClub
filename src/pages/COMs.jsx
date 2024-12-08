import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { PUBLIC_API_URI } from "../api/config";
import ConfirmationDialog from "../api/ConfirmationDialog";
import { showToast } from "../api/toast";
import { deleteDownload, fetchAllDownloads } from "../api/download";
import { deleteCOM, fetchAllCOMs } from "../api/com";

const COMs = () => {


    const navigate = useNavigate();

    const [comList, setComList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCom, setSelectedCom] = useState(null);

    // Format date to "14 December 2024"
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };



    const ComColumns = [
        // {
        //     accessorKey: "image", //access nested data with dot notation
        //     header: "Image",
        //     size: 100,
        //     Cell: ({ cell }) => (
        //         <div>
        //             <Avatar src={`${PUBLIC_API_URI}${cell.getValue()}`} alt={"Hod Image"} variant="rounded" sx={{ width: 100, height: 100, objectFit: "cover" }} />

        //         </div>
        //     ),
        // },
        {
            accessorKey: "title", //access nested data with dot notation
            header: "Download Title",
        },
        {
            accessorKey: "description", //access nested data with dot notation
            header: "Description",
        },
        {
            accessorKey: "status", //normal accessorKey
            header: "Status",
        },
        {
            accessorKey: "createdAt",
            header: "Create Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "expiredDate",
            header: "Expired Date",
            Cell: ({ cell }) => formatDate(cell.getValue()),
        },
        {
            accessorKey: "fileUrl", // PDF file path stored in the backend
            header: "Action",
            Cell: ({ row }) => (
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => window.open(`${PUBLIC_API_URI}${row.original.fileUrl}`, "_blank")}
                >
                    View PDF
                </Button>
            ),
        },

    ];

    const getCOM = async () => {
        try {
            const com = await fetchAllCOMs();
            console.log(com.data.coms, "coms")
            setComList(com?.data.coms);
        } catch (error) {
            console.error("Failed to fetch members:", error);
        }
    };

    useEffect(() => {

        getCOM();
    }, []);

    console.log(comList, "member")

    const handleDeleteClick = (com) => {
        setSelectedCom(com);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        const comId = selectedCom._id;
        console.log(comId, "usersgshg")
        try {
            await deleteCOM(comId);
            getCOM()

            showToast("Consideration Of Membership deleted successfully.", "success");
        } catch (error) {
            console.error("Failed to delete hod:", error);
            showToast(error.message || "Failed to delete Consideration Of Membership.", "error");
        } finally {
            setOpenDialog(false);
            setSelectedCom(null);
        }
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
        setSelectedCom(null);
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
                <Typography variant="h6">Consideration Of Memberships</Typography>
                <Link to="/com/add" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FiPlus />}
                        sx={{ borderRadius: "20px" }}
                    >
                        Add Consideration Of Membership
                    </Button>
                </Link>
            </Box>
            <Table
                data={comList}
                fields={ComColumns}
                numberOfRows={comList.length}
                enableTopToolBar={true}
                enableBottomToolBar={true}
                enablePagination={true}
                enableRowSelection={true}
                enableColumnFilters={true}
                enableEditing={true}
                enableColumnDragging={true}
                showPreview={true}
                routeLink="com"
                handleDelete={handleDeleteClick}
            />
            <ConfirmationDialog
                open={openDialog}
                title="Delete Hod"
                message={`Are you sure you want to delete Consideration Of Membership ${selectedCom?.title}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                loadingText="Deleting..."
            />
        </Box>
    );
};

export default COMs;

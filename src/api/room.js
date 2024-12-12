// src/api/users.js

import axios from "axios";
import { PUBLIC_API_URI } from "./config";

// Axios instance (Optional, for setting base URL and headers)
const axiosInstance = axios.create({
    baseURL: PUBLIC_API_URI, // Change this to your base URL
    headers: {
        "Content-Type": "application/json",
    },
});

// Function to fetch all users
export const fetchAllRooms = async () => {
    try {
        const response = await axiosInstance.get("/roomwithcategorys");
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchRoomDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/roomwithcategory/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const updateRoomDetails = async (roomId, roomData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/roomwithcategory/update-roomwithcategory/${roomId}`,
            roomData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
export const addRoom = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/roomwithcategory/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Delete Member API
export const deleteRoom = async (roomId) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/roomwithcategory/delete-roomwithcategory/${roomId}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};

export const deleteRoomImage = async (roomId, index) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/roomwithcategory/delete-image/${roomId}/${index}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};

export const uploadRoomImage = async (roomId, formData) => {
    try {
        const response = await axios.put(`${PUBLIC_API_URI}/roomwithcategory/upload-image/${roomId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

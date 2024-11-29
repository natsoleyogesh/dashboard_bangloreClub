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
export const fetchAllFAQs = async () => {
    try {
        const response = await axiosInstance.get(`faqs`);
        return response; // Assuming the API returns user data in `response.data`
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Function to fetch member details by ID
export const fetchFAQDetails = async (id) => {
    try {
        // Make the GET request to fetch member details
        const response = await axiosInstance.get(`/faq/details/${id}`);
        // Return the member data from the response
        return response;
    } catch (error) {
        console.error(`Error fetching member details for ID ${id}:`, error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export const updateFAQDetails = async (id, formData) => {
    try {
        const response = await axios.put(
            `${PUBLIC_API_URI}/faq/update-faq/${id}`,
            formData
        );
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const addFAQ = async (formData) => {
    try {
        const response = await axios.post(`${PUBLIC_API_URI}/faq/create`, formData,);
        return response;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

// Delete Member API
export const deleteFAQ = async (id) => {
    try {
        const response = await axios.delete(`${PUBLIC_API_URI}/faq/delete/${id}`);
        return response;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete member.');
    }
};
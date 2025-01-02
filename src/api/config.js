import { format } from "date-fns";


// export const PUBLIC_API_URI = "http://localhost:3005/api"
export const PUBLIC_API_URI = "https://13.53.129.30/api"


export const formatDate = (date) => {
    if (!date) return "N/A";
    try {
        return format(new Date(date), "dd MMM yyyy"); // Format: 25 Dec 2024
    } catch {
        return "Invalid Date";
    }
};

export const formatDateForInput = (date) => {
    if (!date) return ""; // Return empty if no date
    try {
        return format(new Date(date), "yyyy-MM-dd"); // Convert to YYYY-MM-DD
    } catch {
        return ""; // Return empty on invalid date
    }
};

// export const formatDateTime = (dateString) => {
//     if (!dateString) return "N/A";
//     const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
//     return new Date(dateString).toLocaleString(undefined, options);
// };

export const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";

    const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Set to false for 24-hour format
        timeZone: "Asia/Kolkata", // Change based on your preferred time zone
    };

    return new Date(dateString).toLocaleString("en-IN", options);
};

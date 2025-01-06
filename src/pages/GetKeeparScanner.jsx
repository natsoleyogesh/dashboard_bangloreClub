// import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import axios from "axios";
// import { fetchMemberDetails } from "../api/member";

// const GetKeeparScanner = () => {
//     const [scannedData, setScannedData] = useState("");
//     const [userDetails, setUserDetails] = useState(null);
//     const [error, setError] = useState("");

//     const handleScan = async (data) => {
//         if (data) {
//             setScannedData(data);

//             try {
//                 // Extract userId from scanned data
//                 const userId = JSON.parse(data)?.userId;

//                 // Fetch user details from the backend
//                 const response = await fetchMemberDetails(userId);
//                 console.log(response.data)
//                 setUserDetails(response.data.user);
//                 setError(""); // Clear any previous errors
//             } catch (err) {
//                 setError("Failed to fetch user details. Please try again.");
//                 console.error(err);
//             }
//         }
//     };

//     const handleError = (err) => {
//         console.error("Error scanning QR code:", err);
//         setError("Failed to scan QR code. Please try again.");
//     };

//     return (
//         <div style={{ textAlign: "center", marginTop: "50px" }}>
//             <h2>QR Code Scanner</h2>
//             <div style={{ width: "300px", margin: "0 auto" }}>
//                 <QrReader
//                     onResult={(result, error) => {
//                         if (result) handleScan(result?.text);
//                         if (error) handleError(error);
//                     }}
//                     style={{ width: "100%" }}
//                 />
//             </div>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {scannedData && <p>Scanned Data: {scannedData}</p>}
//             {userDetails && (
//                 <div>
//                     <h3>Member Details:</h3>
//                     <p><strong>Name:</strong> {userDetails.name}</p>
//                     <p><strong>Email:</strong> {userDetails.email}</p>
//                     <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {userDetails.memberId}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GetKeeparScanner;


// import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import axios from "axios";
// import { fetchMemberDetails } from "../api/getKeeper";

// const GetKeeparScanner = () => {
//     const [scannedData, setScannedData] = useState("");
//     const [userDetails, setUserDetails] = useState(null);
//     const [error, setError] = useState("");
//     const [status, setStatus] = useState(""); // Status for UI feedback

// // Function to fetch member details
// // const fetchMemberDetails = async (memberId) => {
// //     try {
// //         const token = localStorage.getItem("token"); // Retrieve token from localStorage
// //         if (!token) {
// //             throw new Error("User is not authenticated. Token is missing.");
// //         }

// //         const response = await axios.post(
// //             "http://localhost:5000/api/member/details",
// //             { memberId },
// //             {
// //                 headers: {
// //                     Authorization: `Bearer ${token}`,
// //                     "Content-Type": "application/json",
// //                 },
// //             }
// //         );

// //         if (response.status === 200 && response.data.member && response.data.member.status === "Active") {
// //             setStatus("success");
// //             setUserDetails(response.data.member);
// //         } else {
// //             setStatus("inactive");
// //             setError("Member is not active.");
// //         }
// //     } catch (err) {
// //         setStatus("error");
// //         if (err.response && err.response.data && err.response.data.message) {
// //             setError(err.response.data.message);
// //         } else {
// //             setError("Failed to fetch member details. Please try again.");
// //         }
// //         console.error(err);
// //     }
// // };

// // Handle scanning result
// const handleScan = (data) => {
//     if (data) {
//         setScannedData(data);
//         try {
//             const token = localStorage.getItem("token"); // Retrieve token from localStorage
//             if (!token) {
//                 throw new Error("User is not authenticated. Token is missing.");
//             }
//             const { memberId } = JSON.parse(data);
//             const response = fetchMemberDetails(token, memberId);
//             if (response.status === 200 && response.data.member && response.data.member.status === "Active") {
//                 setStatus("success");
//                 setUserDetails(response.data.member);
//             } else {
//                 setStatus("inactive");
//                 setError("Member is not active.");
//             }
//         } catch (err) {
//             setStatus("error");
//             if (err.response && err.response.data && err.response.data.message) {
//                 setError(err.response.data.message);
//             } else {
//                 setError("Failed to fetch member details. Please try again.");
//             }
//             console.error(err);
//         }
//     }
// };

// // Handle scanning error
// const handleError = (err) => {
//     console.error("Error scanning QR code:", err);
//     if (err?.name === "NotAllowedError") {
//         setError("Camera access was denied. Please allow camera permissions.");
//     } else if (err?.name === "NotFoundError") {
//         setError("No camera was found on the device.");
//     } else {
//         setError("Failed to scan QR code. Please try again.");
//     }
// };


//     const styles = {
//         container: {
//             textAlign: "center",
//             marginTop: "80px",
//         },
//         scannerBox: {
//             width: "300px",
//             margin: "0 auto",
//         },
//         successUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #4CAF50",
//             borderRadius: "10px",
//             backgroundColor: "#f9fff9",
//             textAlign: "center",
//         },
//         successText: {
//             color: "#4CAF50",
//         },
//         profilePicture: {
//             width: "100px",
//             height: "100px",
//             borderRadius: "50%",
//             marginBottom: "10px",
//             border: "2px solid #4CAF50",
//         },
//         errorMessage: {
//             color: "red",
//             marginTop: "10px",
//             fontWeight: "bold",
//         },
//     };

//     return (
//         <div style={styles.container}>
//             <h2>QR Code Scanner</h2>
//             <div style={styles.scannerBox}>
//                 <QrReader
//                     onResult={(result, error) => {
//                         if (result) handleScan(result?.text);
//                         if (error) handleError(error);
//                     }}
//                     style={{ width: "100%" }}
//                 />
//             </div>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {status === "success" && userDetails && (
//                 <div style={styles.successUi}>
//                     <h3 style={styles.successText}>Member Authentication Successful</h3>
//                     <img
//                         src={userDetails.profilePicture}
//                         alt="Profile"
//                         style={styles.profilePicture}
//                     />
//                     <h4>{userDetails.name}</h4>
//                     <p><strong>Email:</strong> {userDetails.email}</p>
//                     <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {userDetails.memberId}</p>
//                 </div>
//             )}
//             {status === "inactive" && <p style={styles.errorMessage}>Member is not active.</p>}
//             {status === "error" && <p style={styles.errorMessage}>{error}</p>}
//             {scannedData && status !== "success" && (
//                 <p>Scanned Data: {scannedData}</p>
//             )}
//         </div>
//     );
// };

// export default GetKeeparScanner;

///=======================old
// import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import jsQR from "jsqr"; // Import a QR code decoding library like jsQR (install it first using npm)
// import { fetchMemberDetails } from "../api/getKeeper";

// const GetKeeparScanner = () => {
//     const [scannedData, setScannedData] = useState("");
//     const [userDetails, setUserDetails] = useState(null);
//     const [error, setError] = useState("");
//     const [status, setStatus] = useState(""); // Status for UI feedback

//     // Function to fetch member details
//     // const fetchMemberDetails = async (memberId) => {
//     //     try {
//     //         const token = localStorage.getItem("token"); // Retrieve token from localStorage
//     //         if (!token) {
//     //             throw new Error("User is not authenticated. Token is missing.");
//     //         }

//     //         const response = await axios.post(
//     //             "http://localhost:5000/api/member/details",
//     //             { memberId },
//     //             {
//     //                 headers: {
//     //                     Authorization: `Bearer ${token}`,
//     //                     "Content-Type": "application/json",
//     //                 },
//     //             }
//     //         );

//     //         if (response.status === 200 && response.data.member && response.data.member.status === "Active") {
//     //             setStatus("success");
//     //             setUserDetails(response.data.member);
//     //         } else {
//     //             setStatus("inactive");
//     //             setError("Member is not active.");
//     //         }
//     //     } catch (err) {
//     //         setStatus("error");
//     //         if (err.response && err.response.data && err.response.data.message) {
//     //             setError(err.response.data.message);
//     //         } else {
//     //             setError("Failed to fetch member details. Please try again.");
//     //         }
//     //         console.error(err);
//     //     }
//     // };

//     // Handle scanning result
//     const handleScan = async (data) => {
//         if (data) {
//             setScannedData(data);
//             try {
//                 const token = localStorage.getItem("token"); // Retrieve token from localStorage
//                 if (!token) {
//                     throw new Error("User is not authenticated. Token is missing.");
//                 }
//                 console.log(JSON.parse(data), "trryg")
//                 const { _id } = JSON.parse(data);
//                 const qrdata = { memberId: _id }
//                 const response = await fetchMemberDetails(token, qrdata);
//                 console.log(response, "res")
//                 if (response.status === 200 && response.data.member && response.data.member.status === "Active") {
//                     setStatus("success");
//                     setUserDetails(response.data.member);
//                 } else {
//                     setStatus("inactive");
//                     setError("Member is not active.");
//                 }
//             } catch (err) {
//                 setStatus("error");
//                 if (err.response && err.response.data && err.response.data.message) {
//                     setError(err.response.data.message);
//                 } else {
//                     setError("Failed to fetch member details. Please try again.");
//                 }
//                 console.error(err);
//             }
//         }
//     };

//     // Handle scanning error
//     const handleError = (err) => {
//         console.error("Error scanning QR code:", err);
//         if (err?.name === "NotAllowedError") {
//             setError("Camera access was denied. Please allow camera permissions.");
//         } else if (err?.name === "NotFoundError") {
//             setError("No camera was found on the device.");
//         } else {
//             setError("Failed to scan QR code. Please try again.");
//         }
//     };

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const imageData = reader.result;

//                 const canvas = document.createElement("canvas");
//                 const context = canvas.getContext("2d");

//                 const img = new Image();
//                 img.onload = () => {
//                     canvas.width = img.width;
//                     canvas.height = img.height;
//                     context.drawImage(img, 0, 0, img.width, img.height);

//                     const imageData = context.getImageData(0, 0, img.width, img.height);
//                     const qrCode = jsQR(imageData.data, img.width, img.height);

//                     if (qrCode) {
//                         handleScan(qrCode.data);
//                     } else {
//                         setError("No QR code detected in the uploaded image.");
//                     }
//                 };
//                 img.src = imageData;
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const styles = {
//         container: {
//             textAlign: "center",
//             marginTop: "80px",
//         },
//         scannerBox: {
//             width: "300px",
//             margin: "0 auto",
//         },
//         successUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #4CAF50",
//             borderRadius: "10px",
//             backgroundColor: "#f9fff9",
//             textAlign: "center",
//         },
//         successText: {
//             color: "#4CAF50",
//         },
//         profilePicture: {
//             width: "100px",
//             height: "100px",
//             borderRadius: "50%",
//             marginBottom: "10px",
//             border: "2px solid #4CAF50",
//         },
//         errorMessage: {
//             color: "red",
//             marginTop: "10px",
//             fontWeight: "bold",
//         },
//         fileInput: {
//             marginTop: "20px",
//         },
//     };

//     return (
//         <div style={styles.container}>
//             <h2>QR Code Scanner</h2>
//             <div style={styles.scannerBox}>
//                 <QrReader
//                     onResult={(result, error) => {
//                         if (result) handleScan(result?.text);
//                         if (error) handleError(error);
//                     }}
//                     constraints={{ facingMode: "environment" }} // Use rear camera by default
//                     style={{ width: "100%" }}
//                 />
//             </div>
//             {/* Fallback file input for image upload */}
//             <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 style={styles.fileInput}
//             />
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {status === "success" && userDetails && (
//                 <div style={styles.successUi}>
//                     <h3 style={styles.successText}>Member Authentication Successful</h3>
//                     <img
//                         src={userDetails.profilePicture}
//                         alt="Profile"
//                         style={styles.profilePicture}
//                     />
//                     <h4>{userDetails.name}</h4>
//                     <p><strong>Email:</strong> {userDetails.email}</p>
//                     <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {userDetails.memberId}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GetKeeparScanner;

// import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import jsQR from "jsqr";
// import { useNavigate } from "react-router-dom";
// import { fetchMemberDetails } from "../api/getKeeper";

// const GetKeeparScanner = () => {
//     const [scannedData, setScannedData] = useState("");
//     const [userDetails, setUserDetails] = useState(null);
//     const [error, setError] = useState("");
//     const [status, setStatus] = useState(""); // Status for UI feedback
//     const navigate = useNavigate(); // Hook to navigate between pages

//     const handleScan = async (data) => {
//         if (data) {
//             setScannedData(data);
//             try {
//                 const token = localStorage.getItem("token"); // Retrieve token from localStorage
//                 if (!token) {
//                     throw new Error("User is not authenticated. Token is missing.");
//                 }

//                 const { _id } = JSON.parse(data); // Parse the scanned QR code data
//                 const qrdata = { memberId: _id };
//                 const response = await fetchMemberDetails(token, qrdata);

//                 if (response.status === 200 && response.data.member) {
//                     const member = response.data.member;
//                     setUserDetails(member);

//                     if (member.status === "Active") {
//                         setStatus("success"); // Show success design
//                     } else {
//                         setStatus("inactive"); // Show inactive design
//                     }
//                 } else {
//                     setStatus("error");
//                     setError("Failed to fetch member details.");
//                 }
//             } catch (err) {
//                 setStatus("error");
//                 setError(
//                     err.response?.data?.message || "Failed to fetch member details. Please try again."
//                 );
//                 console.error(err);
//             }
//         }
//     };

//     const handleError = (err) => {
//         console.error("Error scanning QR code:", err);
//         if (err?.name === "NotAllowedError") {
//             setError("Camera access was denied. Please allow camera permissions.");
//         } else if (err?.name === "NotFoundError") {
//             setError("No camera was found on the device.");
//         } else {
//             setError("Failed to scan QR code. Please try again.");
//         }
//     };

//     const handleBackToScanner = () => {
//         // Reset the state and navigate back to the QR scanner page
//         setScannedData("");
//         setUserDetails(null);
//         setError("");
//         setStatus("");
//         navigate("/gatekeeper/qrScanner"); // Adjust the route as per your app structure
//     };

//     const styles = {
//         container: {
//             textAlign: "center",
//             marginTop: "80px",
//         },
//         scannerBox: {
//             width: "300px",
//             margin: "0 auto",
//         },
//         successUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #4CAF50",
//             borderRadius: "10px",
//             backgroundColor: "#f9fff9",
//             textAlign: "center",
//         },
//         inactiveUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #F44336",
//             borderRadius: "10px",
//             backgroundColor: "#fff9f9",
//             textAlign: "center",
//         },
//         successText: {
//             color: "#4CAF50",
//         },
//         inactiveText: {
//             color: "#F44336",
//         },
//         profilePicture: {
//             width: "100px",
//             height: "100px",
//             borderRadius: "50%",
//             marginBottom: "10px",
//             border: "2px solid #4CAF50",
//         },
//         errorMessage: {
//             color: "red",
//             marginTop: "10px",
//             fontWeight: "bold",
//         },
//         fileInput: {
//             marginTop: "20px",
//         },
//         backButton: {
//             marginTop: "20px",
//             padding: "10px 20px",
//             backgroundColor: "#1976D2",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {status === "" && (
//                 <>
//                     <h2>QR Code Scanner</h2>
//                     <div style={styles.scannerBox}>
//                         <QrReader
//                             onResult={(result, error) => {
//                                 if (result) handleScan(result?.text);
//                                 if (error) handleError(error);
//                             }}
//                             constraints={{ facingMode: "environment" }}
//                             style={{ width: "100%" }}
//                         />
//                     </div>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                                 const reader = new FileReader();
//                                 reader.onload = () => {
//                                     const imageData = reader.result;
//                                     const canvas = document.createElement("canvas");
//                                     const context = canvas.getContext("2d");
//                                     const img = new Image();
//                                     img.onload = () => {
//                                         canvas.width = img.width;
//                                         canvas.height = img.height;
//                                         context.drawImage(img, 0, 0, img.width, img.height);
//                                         const imageData = context.getImageData(0, 0, img.width, img.height);
//                                         const qrCode = jsQR(imageData.data, img.width, img.height);
//                                         if (qrCode) {
//                                             handleScan(qrCode.data);
//                                         } else {
//                                             setError("No QR code detected in the uploaded image.");
//                                         }
//                                     };
//                                     img.src = imageData;
//                                 };
//                                 reader.readAsDataURL(file);
//                             }
//                         }}
//                         style={styles.fileInput}
//                     />
//                 </>
//             )}

//             {status === "success" && userDetails && (
//                 <div style={styles.successUi}>
//                     <h3 style={styles.successText}>✔ Authentication Successful</h3>
//                     <img
//                         src={userDetails.profilePicture || "/placeholder-profile.png"}
//                         alt="Profile"
//                         style={styles.profilePicture}
//                     />
//                     <h4>{userDetails.name}</h4>
//                     <p><strong>Email:</strong> {userDetails.email}</p>
//                     <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {userDetails.memberId}</p>
//                     <button style={styles.backButton} onClick={handleBackToScanner}>
//                         OK
//                     </button>
//                 </div>
//             )}

//             {status === "inactive" && (
//                 <div style={styles.inactiveUi}>
//                     <h3 style={styles.inactiveText}>✘ User is Not Activated</h3>
//                     <button style={styles.backButton} onClick={handleBackToScanner}>
//                         OK
//                     </button>
//                 </div>
//             )}

//             {status === "error" && error && <p style={styles.errorMessage}>{error}</p>}
//         </div>
//     );
// };

// export default GetKeeparScanner;

import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import jsQR from "jsqr";
import { useNavigate } from "react-router-dom";
import { fetchMemberDetails } from "../api/getKeeper";
import { PUBLIC_API_URI } from "../api/config";

const GetKeeparScanner = () => {
    const [scannedData, setScannedData] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(""); // For errors during scanning or processing
    const [status, setStatus] = useState(""); // Status for UI feedback
    const navigate = useNavigate(); // Hook to navigate between pages

    const handleScan = async (data) => {
        if (data) {
            setScannedData(data);
            try {
                const token = localStorage.getItem("token"); // Retrieve token from localStorage
                if (!token) {
                    throw new Error("User is not authenticated. Token is missing.");
                }

                const { primaryMemberId } = JSON.parse(data); // Parse the scanned QR code data
                console.log(JSON.parse(data), "data")
                const qrdata = { memberId: primaryMemberId };
                const response = await fetchMemberDetails(token, qrdata);

                if (response.status === 200 && response.data.member) {
                    const member = response.data.member;
                    setUserDetails(member);

                    if (member.status === "Active") {
                        setStatus("success"); // Show success design
                        setError(""); // Clear any previous error
                    } else {
                        setStatus("Inactive"); // Show inactive design
                        setError(""); // Clear any previous error
                    }
                } else {
                    setStatus("error");
                    setError("Failed to fetch member details.");
                }
            } catch (err) {
                setStatus("error");
                setError(
                    err.response?.data?.message || "Failed to fetch member details. Please try again."
                );
                console.error(err);
            }
        }
    };

    const handleError = (err) => {
        console.error("Error scanning QR code:", err);
        if (err?.name === "NotAllowedError") {
            setError("Camera access was denied. Please allow camera permissions.");
        } else if (err?.name === "NotFoundError") {
            setError("No camera was found on the device.");
        } else {
            setError("Failed to scan QR code. Please try again.");
        }
        setStatus("error");
    };

    const handleBackToScanner = () => {
        // Reset the state to enable a fresh scan
        setScannedData("");
        setUserDetails(null);
        setError("");
        setStatus("");
    };

    const styles = {
        container: {
            textAlign: "center",
            marginTop: "80px",
        },
        scannerBox: {
            width: "300px",
            margin: "0 auto",
        },
        successUi: {
            marginTop: "20px",
            padding: "20px",
            border: "2px solid #4CAF50",
            borderRadius: "10px",
            backgroundColor: "#f9fff9",
            textAlign: "center",
        },
        inactiveUi: {
            marginTop: "20px",
            padding: "20px",
            border: "2px solid #F44336",
            borderRadius: "10px",
            backgroundColor: "#fff9f9",
            textAlign: "center",
        },
        successText: {
            color: "#4CAF50",
        },
        inactiveText: {
            color: "#F44336",
        },
        profilePicture: {
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "10px",
            border: "2px solid #4CAF50",
        },
        inactiveProfilePicture: {
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            marginBottom: "10px",
            border: "2px solid red",
        },
        errorMessage: {
            color: "red",
            marginTop: "10px",
            fontWeight: "bold",
        },
        fileInput: {
            marginTop: "20px",
        },
        backButton: {
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1976D2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
    };

    return (
        <div style={styles.container}>
            <h2>QR Code Scanner</h2>

            {/* Display errors if any */}
            {error && <p style={styles.errorMessage}>{error}</p>}

            {/* QR Scanner and File Upload */}
            {(status === "" || status === "error") && (
                <>
                    <div style={styles.scannerBox}>
                        <QrReader
                            onResult={(result, error) => {
                                if (result) handleScan(result?.text);
                                if (error) handleError(error);
                            }}
                            constraints={{ facingMode: "environment" }}
                            style={{ width: "100%" }}
                        />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    const imageData = reader.result;
                                    const canvas = document.createElement("canvas");
                                    const context = canvas.getContext("2d");
                                    const img = new Image();
                                    img.onload = () => {
                                        canvas.width = img.width;
                                        canvas.height = img.height;
                                        context.drawImage(img, 0, 0, img.width, img.height);
                                        const imageData = context.getImageData(0, 0, img.width, img.height);
                                        const qrCode = jsQR(imageData.data, img.width, img.height);
                                        if (qrCode) {
                                            handleScan(qrCode.data);
                                        } else {
                                            setError("No QR code detected in the uploaded image.");
                                        }
                                    };
                                    img.src = imageData;
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        style={styles.fileInput}
                    />
                </>
            )}

            {/* Success UI */}
            {status === "success" && userDetails && (
                <div style={styles.successUi}>
                    <h3 style={styles.successText}>✔ Authentication Successful</h3>
                    <img
                        src={`${PUBLIC_API_URI}${userDetails.profilePicture}` || "/placeholder-profile.png"}
                        alt="Profile"
                        style={styles.profilePicture}
                    />
                    <h4>{userDetails.name}</h4>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
                    <p><strong>Member ID:</strong> {userDetails.memberId}</p>
                    <button style={styles.backButton} onClick={handleBackToScanner}>
                        Scan Again
                    </button>
                </div>
            )}

            {/* Inactive User UI */}
            {status === "Inactive" && (
                <div style={styles.inactiveUi}>
                    <h3 style={styles.inactiveText}>✘ User is Not Activated</h3>
                    <img
                        src={`${PUBLIC_API_URI}${userDetails.profilePicture}` || "/placeholder-profile.png"}
                        alt="Profile"
                        style={styles.inactiveProfilePicture}
                    />
                    <h4>{userDetails.name}</h4>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Mobile:</strong> {userDetails.mobileNumber}</p>
                    <p><strong>Member ID:</strong> {userDetails.memberId}</p>
                    <button style={styles.backButton} onClick={handleBackToScanner}>
                        Scan Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default GetKeeparScanner;


// import React, { useState } from "react";
// import { QrReader } from "react-qr-reader";
// import jsQR from "jsqr";
// import { markAttendance } from "../api/getKeeper"; // API to mark attendance
// import { PUBLIC_API_URI } from "../api/config";

// const GetKeeperScanner = () => {
//     const [scannedData, setScannedData] = useState("");
//     const [attendeeDetails, setAttendeeDetails] = useState(null);
//     const [error, setError] = useState(""); // Error state
//     const [status, setStatus] = useState(""); // Status for attendance
//     const [loading, setLoading] = useState(false); // Loading indicator

//     const handleScan = async (data) => {
//         if (data) {
//             setScannedData(data);
//             setLoading(true);
//             setError(""); // Clear any previous error
//             setStatus(""); // Reset status

//             try {
//                 const token = localStorage.getItem("token"); // Retrieve token
//                 if (!token) {
//                     throw new Error("User is not authenticated. Token is missing.");
//                 }

//                 const { eventId, uniqueQRCodeId } = JSON.parse(data); // Parse scanned QR data
//                 if (!eventId || !uniqueQRCodeId) {
//                     throw new Error("Invalid QR code data. Event ID or QR Code ID is missing.");
//                 }

//                 // Mark attendance via API
//                 const response = await markAttendance(token, { eventId, uniqueQRCodeId });

//                 if (response.status === 200 && response.data.attendee) {
//                     const attendee = response.data.attendee;
//                     setAttendeeDetails(attendee);

//                     if (attendee.attendanceStatus === "Present") {
//                         setStatus("Already Present"); // Marked as present earlier
//                     } else {
//                         setStatus("success"); // Successfully marked as present now
//                     }
//                 } else {
//                     setStatus("error");
//                     setError("Failed to mark attendance. Please try again.");
//                 }
//             } catch (err) {
//                 setStatus("error");
//                 setError(
//                     err.response?.data?.message || "Failed to process QR code. Please try again."
//                 );
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const handleError = (err) => {
//         console.error("Error scanning QR code:", err);
//         if (err?.name === "NotAllowedError") {
//             setError("Camera access was denied. Please allow camera permissions.");
//         } else if (err?.name === "NotFoundError") {
//             setError("No camera was found on the device.");
//         } else {
//             setError("Failed to scan QR code. Please try again.");
//         }
//         setStatus("error");
//     };

//     const handleBackToScanner = () => {
//         // Reset the state for a fresh scan
//         setScannedData("");
//         setAttendeeDetails(null);
//         setError("");
//         setStatus("");
//     };

//     const styles = {
//         container: {
//             textAlign: "center",
//             marginTop: "80px",
//         },
//         scannerBox: {
//             width: "300px",
//             margin: "0 auto",
//         },
//         successUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #4CAF50",
//             borderRadius: "10px",
//             backgroundColor: "#f9fff9",
//             textAlign: "center",
//         },
//         errorUi: {
//             marginTop: "20px",
//             padding: "20px",
//             border: "2px solid #F44336",
//             borderRadius: "10px",
//             backgroundColor: "#fff9f9",
//             textAlign: "center",
//         },
//         successText: {
//             color: "#4CAF50",
//         },
//         errorText: {
//             color: "#F44336",
//         },
//         profilePicture: {
//             width: "100px",
//             height: "100px",
//             borderRadius: "50%",
//             marginBottom: "10px",
//             border: "2px solid #4CAF50",
//         },
//         errorMessage: {
//             color: "red",
//             marginTop: "10px",
//             fontWeight: "bold",
//         },
//         fileInput: {
//             marginTop: "20px",
//         },
//         backButton: {
//             marginTop: "20px",
//             padding: "10px 20px",
//             backgroundColor: "#1976D2",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//         },
//     };

//     return (
//         <div style={styles.container}>
//             <h2>QR Code Scanner</h2>

//             {/* Display errors if any */}
//             {error && <p style={styles.errorMessage}>{error}</p>}

//             {/* QR Scanner and File Upload */}
//             {(status === "" || status === "error") && (
//                 <>
//                     <div style={styles.scannerBox}>
//                         <QrReader
//                             onResult={(result, error) => {
//                                 if (result) handleScan(result?.text);
//                                 if (error) handleError(error);
//                             }}
//                             constraints={{ facingMode: "environment" }}
//                             style={{ width: "100%" }}
//                         />
//                     </div>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                                 const reader = new FileReader();
//                                 reader.onload = () => {
//                                     const imageData = reader.result;
//                                     const canvas = document.createElement("canvas");
//                                     const context = canvas.getContext("2d");
//                                     const img = new Image();
//                                     img.onload = () => {
//                                         canvas.width = img.width;
//                                         canvas.height = img.height;
//                                         context.drawImage(img, 0, 0, img.width, img.height);
//                                         const imageData = context.getImageData(0, 0, img.width, img.height);
//                                         const qrCode = jsQR(imageData.data, img.width, img.height);
//                                         if (qrCode) {
//                                             handleScan(qrCode.data);
//                                         } else {
//                                             setError("No QR code detected in the uploaded image.");
//                                         }
//                                     };
//                                     img.src = imageData;
//                                 };
//                                 reader.readAsDataURL(file);
//                             }
//                         }}
//                         style={styles.fileInput}
//                     />
//                 </>
//             )}

//             {/* Success UI */}
//             {status === "success" && attendeeDetails && (
//                 <div style={styles.successUi}>
//                     <h3 style={styles.successText}>✔ Attendance Marked Successfully</h3>
//                     <img
//                         src={`${PUBLIC_API_URI}${attendeeDetails.profilePicture}` || "/placeholder-profile.png"}
//                         alt="Profile"
//                         style={styles.profilePicture}
//                     />
//                     <h4>{attendeeDetails.name}</h4>
//                     <p><strong>Email:</strong> {attendeeDetails.email}</p>
//                     <p><strong>Mobile:</strong> {attendeeDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {attendeeDetails.memberId}</p>
//                     <button style={styles.backButton} onClick={handleBackToScanner}>
//                         Scan Again
//                     </button>
//                 </div>
//             )}

//             {/* Already Present UI */}
//             {status === "Already Present" && attendeeDetails && (
//                 <div style={styles.successUi}>
//                     <h3 style={styles.successText}>✔ Already Marked as Present</h3>
//                     <h4>{attendeeDetails.name}</h4>
//                     <p><strong>Email:</strong> {attendeeDetails.email}</p>
//                     <p><strong>Mobile:</strong> {attendeeDetails.mobileNumber}</p>
//                     <p><strong>Member ID:</strong> {attendeeDetails.memberId}</p>
//                     <button style={styles.backButton} onClick={handleBackToScanner}>
//                         Scan Again
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GetKeeperScanner;

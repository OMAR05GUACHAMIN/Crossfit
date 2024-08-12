import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useLocation } from "react-router-dom";
import axios from 'axios';

const TokenVerification = () => {
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);

    const { search } = useLocation();
    const query = new URLSearchParams(search);

    const token = query.get("token");

    console.log("Token from URL:", token); // Debugging

    useEffect(() => {
        // Function to verify the token
        const verifyToken = async (token) => {
            try {
                const response = await axios.post('http://localhost:3000/api/verify_email', { token });
                console.log(response.data)
                return response.data;
            } catch (error) {
                console.error("Error verifying token:", error);
                if (axios.isAxiosError(error)) {
                    // Axios error has a response property
                    return { error: error.response?.data?.error || 'Something went wrong' };
            
                } else if (error instanceof Error) {
                    // General JS error
                    return { error: error.message };
                } else {
                    // Fallback for any other type of error
                    return { error: 'Something went wrong' };
                   
                }
            }
        };

        // Verify token only if it's not already verified or failed
        if (!token) {
            setError("Missing token");
            return;
        }

        // Start verification process
        const startVerification = async () => {
            const data = await verifyToken(token);
            console.log("Verification response:", data); // Debugging
            if (data.success) {
                setSuccess(data.success);
            } else {
                setError(data.error);
            }
        };

        // Only verify once
        if (!success && !error) {
            startVerification();
        }
    }, [token, success, error]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen">
            <h1>Confirming your verification</h1>
            <a href="/login">Back to login</a>
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader />
                )}
                {success && (
                    <div className="text-green-500">{success}</div>
                )}
                {!success && error && (
                    <div className="text-red-500">{error}</div>
                )}
            </div>
        </div>
    );
};

export default TokenVerification;

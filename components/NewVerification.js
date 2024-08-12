import React, { useEffect, useState, useCallback } from "react";
import { BeatLoader } from "react-spinners";
import axios from '../axiosConfig'; // Importa la instancia de Axios configurada
import { useLocation, Link, useNavigate } from 'react-router-dom';
import './NewVerification.css'; // Importa el archivo CSS

const NewVerification = () => {
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const search = useLocation().search;
    const token = new URLSearchParams(search).get("token");
    const navigate = useNavigate();

    const verifyToken = async (token) => {
        try {
            const response = await axios.post('/verify_email', { token });
            return response.data;
        } catch (error) {
            console.error("Error verifying token:", error);

            if (axios.isAxiosError(error)) {
                return { error: error.response?.data?.error || 'Algo salió mal' };
            } else if (error instanceof Error) {
                return { error: error.message };
            } else {
                return { error: 'Algo salió mal' };
            }
        }
    };

    const onSubmit = useCallback(async () => {
        if (!token) {
            setError("Token faltante");
            setLoading(false);
            return;
        }

        try {
            const data = await verifyToken(token);
            if (data.success) {
                setSuccess("Email Verificado");
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Redirigir a la página de login después de 3 segundos
            } else {
                setError("Algo salió mal");
            }
        } catch {
            setError("Algo salió mal");
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="verification-container">
            <div className="verification-box">
                <div className="verification-header">
                    <img src="/images/avatar.jpg" alt="Verification" className="verification-image" />
                    <h1 className="verification-title">
                        {loading ? "Confirmando tu verificación" : success ? "Email Verificado" : "Error"}
                    </h1>
                </div>
                <div className="verification-body">
                    {loading && <BeatLoader />}
                    {!loading && success && (
                        <div className="text-green-600">
                            <p>{success}</p>
                            <Link to="/login" className="text-blue-500 hover:underline">Volver al inicio de sesión</Link>
                        </div>
                    )}
                    {!loading && error && !success && (
                        <div className="text-red-600">
                            <p>{error}</p>
                            <Link to="/login" className="text-blue-500 hover:underline">Volver al inicio de sesión</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewVerification;

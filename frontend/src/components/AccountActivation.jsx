import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const AccountActivation = () => {
  const { token } = useParams();
  console.log("Activation token:", token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.post(`${apiUrl}/auth/activate/${token}`);
        console.log("Account activated:", response.data);
        navigate("/signin", { replace: true });
      } catch (err) {
        console.error(
          "Activation error:",
          err.response?.data?.msg || "Server error"
        );
        setError(err.response?.data?.msg || "Failed to activate account.");
        setLoading(false);
      }
    };

    if (token) {
      activateAccount();
    }
  }, [token, navigate]);

  if (loading) {
    return <div className="text-info text-center h1">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center h1">Error: {error}</div>;
  }

  return (
    <div className="text-success text-center h1">
      Your account has been successfully activated. Redirecting to login...
    </div>
  );
};

export default AccountActivation;

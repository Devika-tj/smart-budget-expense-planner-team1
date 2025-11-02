import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
    const userData = params.get("user");

    if (token && role) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem("user", JSON.stringify(user));
        } catch (error) {
          console.error("Failed to parse user data:", error);
        }
      }

      setTimeout(() => {
        if (role === "admin") navigate("/admindash");
        else navigate("/userdashboard");
      }, 1000);
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Signing you in securely...
      </Typography>
    </Box>
  );
};

export default AuthSuccess;

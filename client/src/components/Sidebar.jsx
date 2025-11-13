import React, { useState, useEffect } from "react";
import { Home, DollarSign, Receipt, LogOut as LogOutIcon, Settings } from "lucide-react";
import { Box, Avatar, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import axios from "axios"

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // For toggle

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   navigate("/");
  // };

const handleLogout = async () => {

  const token = localStorage.getItem("token");

  if (token) {
    try {
      await axios.post(
        "http://localhost:8000/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/");
};

  const allMenuItems = [
    {
      name: "Admin Dashboard",
      icon: <Home size={18} />,
      path: "/admindash",
      role: "admin",
    },
    {
      name: "Dashboard",
      icon: <DashboardIcon />,
      path: "/userdashboard",
      role: "user",
    },
    {
      name: "Income",
      icon: <DollarSign size={18} />,
      path: "/income",
      role: "user",
    },
    {
      name: "Expense",
      icon: <Receipt size={18} />,
      path: "/expense",
      role: "user",
    },
    {
      name: "Settings",
      icon: <Settings size={18} />,
      path: "/settings",
      role: "user",
    },
    { name: "LogOut", icon: <LogOutIcon size={18} /> },
  ];

  const menuItems =
    user?.role === "admin"
      ? allMenuItems.filter((item) => item.role !== "user")
      : allMenuItems.filter((item) => item.role !== "admin");

  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      {/* Toggle Button */}
      <Button
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          top: 10,
          left: 5,
          zIndex: 3000,
          display: { xs: "block", md: "none" },
          background: "#1f1f3a",
          color: "white",
          borderRadius: "7px",
          width: 30,
          height: 30,
          fontSize: "15px",
          fontWeight: "bold",
          minWidth: "30px",
          "&:hover": { backgroundColor: "#3c3c6a" },
        }}
      >
        ☰
      </Button>

      
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1400,
            display: { xs: "block", md: "none" },
          }}
        />
      )}

      {/* Sidebar */}
      <Box
        sx={{
          position: { xs: "fixed", md: "relative" },
          left: { xs: open ? 0 : "-260px", md: 0 },
          top: 0,
          height: "auto",
          transition: "0.3s",
          zIndex: 1500,
          width: { xs: 210, sm: 200, md: 240 },
          background:
            "linear-gradient(135deg, #041249ff 0%, #111111 55%, #0A8A6B 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: { xs: 2, sm: 3, md: 4 },
          boxShadow: 3,
          borderBottomRightRadius: 24,
        }}
      >
        <Button
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            display: { xs: "block", md: "none" },
            color: "white",
            minWidth: "30px",
            fontSize: "20px",
          }}
        >
          ✕
        </Button>

        <Stack spacing={1} alignItems="center" mb={5}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "#fff",
              color: "#04206dff",
              fontWeight: "bold",
              border: "2px solid #ccc",
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {user?.fullName || "Guest User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#d0d0ff" }}>
            {user?.role ? user.role.toUpperCase() : "GUEST"}
          </Typography>
        </Stack>

        <Stack spacing={1} width="100%" px={2}>
          {menuItems.map((item) => (
            <Button
              key={item.name}
              onClick={() => {
                setActive(item.name);
                if (item.name === "LogOut") handleLogout();
                else navigate(item.path);
                setOpen(false); // close when selecting on mobile
              }}
              startIcon={item.icon}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 500,
                fontSize: 14,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                backgroundColor:
                  active === item.name ? "rgba(128,90,213,0.8)" : "transparent",
                color: active === item.name ? "#fff" : "rgba(255,255,255,0.7)",
                "&:hover": {
                  backgroundColor: "rgba(128,90,213,0.5)",
                  color: "#fff",
                },
              }}
            >
              {item.name}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default Sidebar;

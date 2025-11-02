import React, { useState, useEffect } from "react";
import {
  Home,
  DollarSign,
  Settings,
  Receipt,
  LogOut as LogOutIcon,
} from "lucide-react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Menu items — admin-only for Admin Dashboard
  const allMenuItems = [
    { name: "Admin Dashboard", icon: <Home size={18} />, path: "/admindash", role: "admin" },
    { name: "Dashboard", icon: <DashboardIcon />, path: "/userdashboard", role: "user" },
    { name: "Income", icon: <DollarSign size={18} />, path: "/income", role: "user" },
    { name: "Expense", icon: <Receipt size={18} />, path: "/expense", role: "user" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
    { name: "LogOut", icon: <LogOutIcon size={18} /> },
  ];

  // Filter items based on role
  const menuItems =
    user?.role === "admin"
      ? allMenuItems.filter((item) => item.role !== "user")
      : allMenuItems.filter((item) => item.role !== "admin");

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        background: "linear-gradient(to bottom, #1f1f3a, #0a3d46)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
        boxShadow: 3,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 24,
      }}
    >
   
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

      {/* Navigation */}
      <Stack spacing={1} width="100%" px={2}>
        {menuItems.map((item) => (
          <Button
            key={item.name}
            onClick={() => {
              setActive(item.name);
              if (item.name === "LogOut") handleLogout();
              else navigate(item.path);
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
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Home, DollarSign, Settings, Receipt } from "lucide-react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
   const navigate = useNavigate();


  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "Income", icon: <DollarSign size={18} /> },
     { name: "Expense", icon: <Receipt size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

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
      {/* Profile Section */}
      <Stack spacing={1} alignItems="center" mb={5}>
        <Avatar
          src="https://via.placeholder.com/60"
          alt="Profile"
          sx={{ width: 64, height: 64, border: "2px solid #ccc" }}
        />
        <Typography variant="body2" fontWeight={500}>
          John Doe
        </Typography>
      </Stack>

      {/* Navigation */}
      <Stack spacing={1} width="100%" px={2}>
        {menuItems.map((item) => (
          <Button
            key={item.name}
             onClick={() => {
              setActive(item.name);
              navigate(item.path);
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
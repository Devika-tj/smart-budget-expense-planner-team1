import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile settings");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });


  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUser(res.data.user);
          setFullName(res.data.user.fullName);
          setEmail(res.data.user.email);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.put(
        "http://localhost:8000/auth/update",
        { fullName, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        
        alert("Profile updated successfully!");
        navigate("/userdashboard"); 
      } else {
        setMessage({ type: "error", text: res.data.msg });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.msg || "Update failed",
      });
    } finally {
      setUpdating(false);
    }
  };

  
  const renderContent = () => {
    switch (activeTab.toLowerCase().trim()) {
      
      case "profile settings":
        if (loading)
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="60vh"
            >
              <CircularProgress />
            </Box>
          );

        return (
          <Paper
            elevation={3}
            sx={{ p: 4, width: "80%", backgroundColor: "#ffffff" }}
          >
            <Typography variant="h5" gutterBottom>
              👤 Profile Settings
            </Typography>
            <Divider sx={{ my: 2 }} />

            {message.text && (
              <Alert
                severity={message.type}
                sx={{ mb: 2 }}
                onClose={() => setMessage({ type: "", text: "" })}
              >
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleUpdate}>
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                value={email}
                disabled
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </form>
          </Paper>
        );

      
      case "support":
        return (
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              width: "100%",
              maxWidth: 800,
              backgroundColor: "#f9f9ff",
              color: "black",
              border: "2px solid #3f51b5",
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              PiggyTrack Support Center 🐷
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Welcome to the PiggyTrack Support Center! We’re here to help.
            </Typography>
            <Typography variant="body2">
              📞 support@piggytrack.com <br />
              ☎️ +91 98765 43210 <br />
              🕐 Mon–Sat, 9 AM – 6 PM IST
            </Typography>
          </Paper>
        );

      
      case "terms and policies":
        return (
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              width: "100%",
              maxWidth: 800,
              backgroundColor: "#f9f9ff",
              color: "black",
              border: "2px solid #3f51b5",
            }}
          >
            <Typography variant="h5" gutterBottom color="primary">
              PiggyTrack Terms & Privacy Policy 📜
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              By using PiggyTrack, you agree to the following terms and policies.
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              🔐 Data Privacy
            </Typography>
            <Typography variant="body2">
              PiggyTrack respects your privacy. Your data is securely encrypted
              and will never be sold or shared with third parties.
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              💾 Data Usage
            </Typography>
            <Typography variant="body2">
              We use your data only to provide services like analytics,
              notifications, and personalized recommendations.
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              🚫 User Responsibilities
            </Typography>
            <Typography variant="body2">
              Keep your credentials safe and don’t share them. Any misuse will
              be the responsibility of the account holder.
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              ⚙️ Updates
            </Typography>
            <Typography variant="body2">
              PiggyTrack may update its policies from time to time. Changes will
              be communicated via email or in-app notifications.
            </Typography>

            <Typography variant="body2" sx={{ mt: 3 }}>
              For full details: <strong>www.piggytrack.com/terms</strong>
            </Typography>
          </Paper>
        );

      default:
        return <Typography>Select a section</Typography>;
    }
  };

  const menuItems = ["Profile Settings", "Support", "Terms and Policies"];

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#dcdcdc" }}
    >
      
      <Box
        sx={{
          width: 200,
           background:
            "linear-gradient(135deg, #041249ff 0%, #111111 55%, #0A8A6B 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <SettingsIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          PiggyTrack Menu
        </Typography>

        {menuItems.map((item) => (
          <Button
            key={item}
            variant={
              activeTab === item.toLowerCase().trim()
                ? "contained"
                : "outlined"
            }
            onClick={() => setActiveTab(item.toLowerCase().trim())}
            sx={{
              my: 1,
              color: "white",
              borderColor: "white",
              textTransform: "none",
              width: "100%",
              "&:hover": { backgroundColor: "#204de0" },
            }}
          >
            {item}
          </Button>
        ))}

       
        <Button
          variant="contained"
          onClick={() => navigate(-1)} 
          sx={{
            mt: 2,
            backgroundColor: "#e68900",
            color: "white",
            width: "100%",
            textTransform: "none",
            "&:hover": { backgroundColor: "#ab6703ff" },
          }}
        >
          ← Go Back
        </Button>
      </Box>

      
      <Grid
        container
        sx={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          p: 5,
        }}
      >
        {renderContent()}
      </Grid>
    </Box>
  );
};

export default SettingsPage;

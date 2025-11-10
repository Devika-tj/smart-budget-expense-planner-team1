import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";

const AdminDashboard = () => {
  const [roleFilter, setRoleFilter] = useState("All");

  const users = [
    { name: "John Doe", email: "john@example.com", lastActive: "2025-10-17", role: "Admin", status: "Active" },
    { name: "Jane Smith", email: "jane@example.com", lastActive: "2025-10-15", role: "User", status: "Inactive" },
    { name: "Ali Khan", email: "ali@example.com", lastActive: "2025-10-18", role: "User", status: "Active" },
    { name: "Priya Patel", email: "priya@example.com", lastActive: "2025-10-10", role: "Moderator", status: "Active" },
  ];

  const filteredUsers = roleFilter === "All" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        User Management
      </Typography>

      {/* Responsive Cards */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" fontWeight="bold">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">Active Users</Typography>
              <Typography variant="h4" fontWeight="bold">
                {users.filter((u) => u.status === "Active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">New Users (This Month)</Typography>
              <Typography variant="h4" fontWeight="bold">5</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* Responsive Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflowX: "auto",
        }}
      >
        <Box sx={{ minWidth: "750px" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Last Active</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      color={user.status === "Active" ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </Box>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;



import React, { useState, useEffect } from "react";
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AdminDashboard = () => {
  const [roleFilter, setRoleFilter] = useState("All");
  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();

    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers =
    roleFilter === "All"
      ? users
      : users.filter((user) => user.role === roleFilter);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        backgroundColor: "#f9fafc",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        textAlign={isSmall ? "center" : "left"}
      >
        User Management
      </Typography>

      {/* ======= Stat Cards ======= */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" fontWeight="bold">
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Active users</Typography>
              <Typography variant="h4" fontWeight="bold">
                {users.filter((u) => u.status === "Active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Inactive</Typography>
              <Typography variant="h4" fontWeight="bold">
                {users.filter((u) => u.status === "Inactive").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ======= Table Section ======= */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflowX: "auto",
          width: "100%",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Created At
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:hover": { backgroundColor: "#f1f5f9" },
                  whiteSpace: "nowrap",
                }}
              >
                <TableCell>{user.fullName}</TableCell>
                <TableCell sx={{ wordBreak: "break-word" }}>
                  {user.email}
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === "Active" ? "success" : "danger"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;

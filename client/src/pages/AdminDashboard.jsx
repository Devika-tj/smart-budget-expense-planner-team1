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
  const [spendingData, setSpendingData] = useState(null);

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
    const fetchSpendingTrends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:8000/api/admin/spending-trends",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch spending trends");
        const data = await res.json();
        setSpendingData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpendingTrends();

    const interval = setInterval(fetchUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter((user) => user.role === "user");

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

      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4" fontWeight="bold">
                {filteredUsers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Active users</Typography>
              <Typography variant="h4" fontWeight="bold">
                {filteredUsers.filter((u) => u.status === "Active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
            <CardContent>
              <Typography variant="h6">Inactive</Typography>
              <Typography variant="h4" fontWeight="bold">
                {filteredUsers.filter((u) => u.status === "Inactive").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {spendingData && (
        <>
          <Typography variant="h6" mt={5} mb={2} fontWeight="bold">
            Overall Spending Trends
          </Typography>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h6">Total Income</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{spendingData.totalIncome}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h6">Total Expenses</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{spendingData.totalExpenses}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {spendingData.totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
      {spendingData && (
        <>
          
          <Typography variant="h6" mb={1} fontWeight="bold">
          Top 5 Spenders
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: 3, overflowX: "auto", mb: 4 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Total Spent
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {spendingData.topSpenders.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>₹{user.totalSpent}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          
          <Typography variant="h6" mb={1} fontWeight="bold">
          Top 5 Spending Categories
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: 3, overflowX: "auto", mb: 4 }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Category
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Amount
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {spendingData.topCategories.map((cat, index) => (
                  <TableRow key={index}>
                    <TableCell>{cat.category}</TableCell>
                    <TableCell>₹{cat.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      
      <Typography variant="h6" mb={1} fontWeight="bold">
        Manage Users
      </Typography>
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

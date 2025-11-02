import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [expenseRes, suggestRes] = await Promise.all([
        axios.get("http://localhost:8000/api/expense/get"),
        axios.get("http://localhost:8000/api/expense/aisuggestions"),
      ]);

      const allData = expenseRes.data || [];
      setExpenses(allData.filter((i) => i.type === "expense"));
      setIncome(allData.filter((i) => i.type === "income"));
      setSuggestions(suggestRes.data?.suggestions || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalIncome = income.reduce((acc, i) => acc + i.amount, 0);
  const totalSavings = totalIncome - totalExpense;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#1976d2",
          "#9c27b0",
          "#ff9800",
          "#f44336",
          "#4caf50",
          "#03a9f4",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  // 🔹 Function to trigger report download
  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get("http://localhost:8000/api/expense/download-report", {
        responseType: "blob",
      });

      // Create a link to download file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Expense_Report.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Report Download Error:", err);
      alert("Failed to download report");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Welcome to Your Dashboard
      </Typography>

      {/* 🔹 Summary Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Income</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#4caf50" }}>
              ₹{totalIncome.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Expenses</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#f44336" }}>
              ₹{totalExpense.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Savings</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#2196f3" }}>
              ₹{totalSavings.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* 🔹 Charts and AI Suggestions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Expense Distribution
            </Typography>
            {Object.keys(categoryTotals).length ? (
              <Pie data={chartData} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No expense data to show
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Smart Saving Suggestions
            </Typography>
            {suggestions.length ? (
              suggestions.map((s, i) => (
                <Typography key={i} variant="body2" sx={{ mb: 1 }}>
                  • {s}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No AI suggestions available yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* 🔹 Download & View Report Buttons */}
      <Box display="flex" justifyContent="center" gap={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadReport}
          sx={{ px: 4 }}
        >
          Download Report
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/reports")}
          sx={{ px: 4 }}
        >
          View Report
        </Button>
      </Box>
    </Container>
  );
};

export default UserDashboard;

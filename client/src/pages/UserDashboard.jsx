import React, { useEffect, useState } from "react";
import {
  Container, Typography, Grid, Paper, Box, Button, CircularProgress, Divider, TextField, Stack, Alert
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({ startDate: "", endDate: "", category: "", paymentMode: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchDashboardData();
  }, [month, year]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const [expenseRes, incomeRes] = await Promise.all([
        axios.get("http://localhost:8000/api/expense/get"),
        axios.get("http://localhost:8000/api/income"),
      ]);

      const allData = expenseRes.data || [];
      setExpenses(allData.filter((i) => i.type === "expense"));
      setIncome(incomeRes.data || []);


      let suggestionsData = [];
      let aiSummary = "";
      let summaryData = null;

      try {
        const res = await axios.get("http://localhost:8000/api/expense/aisuggestions");
        suggestionsData = res.data?.suggestions || [];
      } catch (e) {
        console.warn("AI suggestions failed:", e.response?.data || e.message);
      }

      try {
        const res = await axios.get(
          `http://localhost:8000/api/expense/ai-monthly-summary?month=${month}&year=${year}`
        );
        aiSummary = res.data?.summary || "";
      } catch (e) {
        console.warn("AI monthly summary failed:", e.response?.data || e.message);
      }

      try {
        const res = await axios.get(
          `http://localhost:8000/api/expense/summary?month=${month}&year=${year}`
        );
        summaryData = res.data || null;
      } catch (e) {
        console.warn("Budget summary failed:", e.response?.data || e.message);
      }

      setSuggestions(suggestionsData);
      setMonthlySummary(summaryData ? { ...summaryData, aiParagraph: aiSummary } : { aiParagraph: aiSummary });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      alert("Failed to load dashboard data. Check backend connection.");
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

  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
      },
    ],
  };

  const barData = {
    labels: ["Income", "Expenses", "Savings"],
    datasets: [{ label: "Amount (₹)", data: [totalIncome, totalExpense, totalSavings] }],
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const q = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:8000/api/expense/downloadcsv?${q}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses_${month}_${year}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("CSV download error", err);
      alert("Failed to download CSV");
    }
  };

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const q = new URLSearchParams(filters).toString();
      const res = await axios.get(`http://localhost:8000/api/expense/downloadpdf?${q}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses_${month}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("PDF download error", err);
      alert("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Welcome to Your Dashboard
      </Typography>

     
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

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Expense Distribution</Typography>
            {Object.keys(categoryTotals).length ? (
              <Pie data={pieData} />
            ) : (
              <Typography>No expense data to show</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Overview</Typography>
            <Bar data={barData} />
            <Box mt={2}>
              <Typography variant="subtitle2">Budget Insights</Typography>
              <Stack spacing={1} mt={1}>
                {monthlySummary?.overBudget ? (
                  <Alert severity="error">
                    You are over budget for {month}/{year} — used {monthlySummary.progress}%
                  </Alert>
                ) : (
                  <Alert severity="info">
                    Budget usage: {monthlySummary?.progress ?? "0"}%
                  </Alert>
                )}
                <Typography variant="body2">
                  Top categories:{" "}
                  {monthlySummary?.topCategories?.length
                    ? monthlySummary.topCategories.map((t) => `${t.category} (₹${t.amount})`).join(", ")
                    : "—"}
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Grid>

     
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Smart Saving Suggestions</Typography>
            {suggestions.length
              ? suggestions.map((s, i) => <Typography key={i}>• {s}</Typography>)
              : <Typography>No AI suggestions available</Typography>}
          </Paper>
        </Grid>

        {/* AI Monthly Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Monthly Summary (AI)</Typography>
            <Typography variant="body2">
              {monthlySummary?.aiParagraph || "AI summary unavailable this month."}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

 
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Filters & Exports</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Payment Mode"
              value={filters.paymentMode}
              onChange={(e) => setFilters({ ...filters, paymentMode: e.target.value })}
              fullWidth
            />
          </Grid>

  
          <Grid item xs={12} display="flex" justifyContent="flex-start" mt={1}>
           <Button
              variant="outlined"
              sx={{ mr: 2 , borderColor: "#4819d7ff", color:"#4819d7ff"}}
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
            >
              Download CSV
            </Button>
             <Button
              variant="contained"
              sx={{ mr: 2 , backgroundColor:"#2c17b2ff"}}
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation */}
      <Box display="flex" justifyContent="center" gap={3}>
        
        <Button
          variant="contained"
          sx={{ backgroundColor: "#0a1754ff", color: "#fff", "&:hover": { backgroundColor: "#1565c0" } }}
          onClick={() => navigate("/budget")}
        >
          Manage Budget
        </Button>
      </Box>
    </Container>
  );
};

export default UserDashboard;

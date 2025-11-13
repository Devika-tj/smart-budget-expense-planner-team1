import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Switch,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const categories = [
  "Food",
  "Rent",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Other",
];
const paymentModes = ["Cash", "Card", "UPI"];

const ExpenseDetails = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "",
    amount: "",
    paymentMode: "Cash",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get("http://localhost:8000/api/expense/get");
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch Expense Error:", err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewExpense({
      title: "",
      category: "",
      amount: "",
      paymentMode: "Cash",
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    });
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveExpense = async () => {
    const newErrors = {};

    // Validation 
    if (!newExpense.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!newExpense.category) {
      newErrors.category = "Please select a category";
    }

    if (!newExpense.amount || newExpense.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!newExpense.paymentMode) {
      newErrors.paymentMode = "Please select a payment mode";
    }

    if (!newExpense.date) {
      newErrors.date = "Please select a date";
    }

    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (editId) {
        await axios.put(
          `http://localhost:8000/api/expense/update/${editId}`,
          newExpense
        );
      } else {
        await axios.post("http://localhost:8000/api/expense/add", newExpense);
      }

      fetchExpenses();
      handleClose();
    } catch (err) {
      console.error("Add/Update Expense Error:", err);
      alert("Error saving expense. Please try again.");
    }
  };

  const handleEdit = (exp) => {
    setNewExpense({
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      paymentMode: exp.paymentMode,
      type: exp.type,
      date: exp.date.split("T")[0],
    });
    setEditId(exp._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.delete(`http://localhost:8000/api/expense/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Delete Expense Error:", err);
    }
  };

  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  const last7Days = expenses.filter(
    (e) => (new Date() - new Date(e.date)) / (1000 * 60 * 60 * 24) <= 7
  );
  const biggestExpense = expenses.length
    ? expenses.reduce(
        (max, e) => (e.amount > max.amount ? e : max),
        expenses[0]
      )
    : null;

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 5,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", fontSize: { xs: "1.6rem", sm: "2rem" } }}
        >
          Expense Details
        </Typography>
        <Button
          variant="contained"
          color="warning"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
        >
          Add Expense
        </Button>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: "Total Expenses", value: `₹${totalExpense.toFixed(2)}` },
          { title: "Last 7 Days", value: `${last7Days.length} Entries` },
          {
            title: "Biggest",
            value: biggestExpense
              ? `${biggestExpense.title} - ₹${biggestExpense.amount}`
              : "—",
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" color="textSecondary">
                {card.title}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Toggle Row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        spacing={1}
      >
        <Typography variant="body1" fontWeight="600">
          Manage Entries
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">Edit / Delete</Typography>
          <Switch checked={active} onChange={() => setActive(!active)} />
        </Stack>
      </Stack>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 1,
          overflowX: { xs: "auto", md: "visible" },
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bdbdbd",
            borderRadius: "10px",
          },
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#f9f9f9" }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Date</TableCell>
              {active && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((exp) => (
              <TableRow key={exp._id}>
                <TableCell>{exp.title}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{exp.type}</TableCell>
                <TableCell>{exp.amount}</TableCell>
                <TableCell>{exp.paymentMode}</TableCell>
                <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                {active && (
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(exp)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(exp._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          {editId ? "Edit Entry" : "Add Entry"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={newExpense.title}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title}
            />

            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={newExpense.category}
                onChange={handleChange}
                label="Category"
                required
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1, fontSize: "0.75rem" }}
                >
                  {errors.category}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Amount"
              name="amount"
              value={newExpense.amount}
              onChange={handleChange}
              fullWidth
              required
              type="number"
              error={!!errors.amount}
              helperText={errors.amount}
            />

            <FormControl fullWidth error={!!errors.paymentMode}>
              <InputLabel>Payment Mode</InputLabel>
              <Select
                name="paymentMode"
                value={newExpense.paymentMode}
                onChange={handleChange}
                label="Payment Mode"
              >
                {paymentModes.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
              {errors.paymentMode && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, ml: 1, fontSize: "0.75rem" }}
                >
                  {errors.paymentMode}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Date"
              name="date"
              value={newExpense.date}
              onChange={handleChange}
              fullWidth
              required
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveExpense} variant="contained">
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpenseDetails;


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch incomes
  const fetchIncomes = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data);
    } catch (err) {
      console.error("Error fetching incomes:", err);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // ✅ Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Open dialog for Add or Edit
  const handleOpen = (income = null) => {
    if (income) {
      setFormData({
        title: income.title,
        description: income.description,
        amount: income.amount,
        category: income.category,
      });
      setEditId(income._id);
    } else {
      setFormData({ title: "", description: "", amount: "", category: "" });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // ✅ Submit form (Create or Update)
  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.amount || !formData.category) {
        alert("Please fill all required fields");
        return;
      }

      if (editId) {
        await axios.put(
          `http://localhost:8000/api/income/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:8000/api/income", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchIncomes();
      handleClose();
    } catch (err) {
      console.error("Error saving income:", err);
    }
  };

  // ✅ Delete income
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await axios.delete(`http://localhost:8000/api/income/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchIncomes();
      } catch (err) {
        console.error("Error deleting income:", err);
      }
    }
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Income Management
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          + Add Income
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income._id}>
                <TableCell>{income.title}</TableCell>
                <TableCell>{income.description}</TableCell>
                <TableCell>₹{income.amount}</TableCell>
                <TableCell>{income.category}</TableCell>
                <TableCell>
                  {new Date(income.date).toLocaleDateString("en-IN")}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleOpen(income)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(income._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {incomes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No income records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ✅ Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Income" : "Add New Income"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Freelance">Freelance</MenuItem>
                <MenuItem value="Investment">Investment</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IncomePage;

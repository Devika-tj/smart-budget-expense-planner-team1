import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
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
  Switch,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [active, setActive] = useState(false); 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const token = localStorage.getItem("token");

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpen = (income = null) => {
    if (income) {
      setFormData({
        title: income.title,
        description: income.description,
        amount: income.amount,
        category: income.category,
        date: new Date(income.date).toISOString().split("T")[0],
      });
      setEditId(income._id);
    } else {
      setFormData({
        title: "",
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.amount || !formData.category) {
        alert("Please fill all required fields");
        return;
      }

      if (editId) {
        await axios.put(`http://localhost:8000/api/income/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
          Income Details
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleOpen()}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
        >
          + Add Income
        </Button>
      </Stack>

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
              <TableCell>Description</TableCell>
              <TableCell>Amount (₹)</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              {active && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income._id}>
                <TableCell>{income.title}</TableCell>
                <TableCell>{income.description}</TableCell>
                <TableCell>{income.amount}</TableCell>
                <TableCell>{income.category}</TableCell>
                <TableCell>
                  {new Date(income.date).toLocaleDateString("en-IN")}
                </TableCell>
                {active && (
                  <TableCell align="center">
                    <Stack direction="row" justifyContent="center" spacing={1}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpen(income)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(income._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {incomes.length === 0 && (
              <TableRow>
                <TableCell colSpan={active ? 6 : 5} align="center">
                  No income records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.2rem" }}
        >
          {editId ? "Edit Income" : "Add Income"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
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
                label="Category"
              >
                <MenuItem value="Salary">Salary</MenuItem>
                <MenuItem value="Freelance">Freelance</MenuItem>
                <MenuItem value="Investment">Investment</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default IncomePage;




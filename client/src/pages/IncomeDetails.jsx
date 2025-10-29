
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const IncomePage = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false); // for popup
  const [newIncome, setNewIncome] = useState({
    title: "",
    description: "",
    amount: "",
  });

  const [incomeData, setIncomeData] = useState([
    { title: "Salary", description: "Bi-weekly paycheck", amount: "$750.00", date: "June 10, 2024" },
    { title: "Freelance Project", description: "Web Dev project payment", amount: "$1,500.00", date: "June 11, 2024" },
    { title: "Investment Dividend", description: "Quarterly dividend", amount: "$750.00", date: "June 15, 2024" },
    { title: "Salary", description: "Monthly pay", amount: "$2,500.00", date: "June 30, 2024" },
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewIncome({ ...newIncome, [e.target.name]: e.target.value });
  };

  const handleAddIncome = () => {
    if (!newIncome.title || !newIncome.amount) {
      alert("Please fill all required fields!");
      return;
    }
    const newEntry = {
      ...newIncome,
      date: new Date().toLocaleDateString(),
      amount: `$${newIncome.amount}`,
    };
    setIncomeData([...incomeData, newEntry]);
    setNewIncome({ title: "", description: "", amount: "" });
    handleClose();
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f7fb",
        minHeight: "100vh",
        p: 4,
      }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="600">
          View Your Income
        </Typography>

        <Stack direction="row" alignItems="center" spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2"></Typography>
            <Switch
              checked={active}
              onChange={() => setActive(!active)}
              color="primary"
            />
            <Typography variant="body2">Edit / Delete</Typography>
          </Stack>

          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
            onClick={handleOpen}
          >
            + Add Income
          </Button>
        </Stack>
      </Stack>

      {/* Search */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        size="small"
        sx={{
          mb: 3,
          bgcolor: "white",
          borderRadius: 1,
        }}
      />

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f3fa" }}>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              {active && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {incomeData.map((item, index) => (
              <TableRow key={index} hover>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell sx={{ color: "green", fontWeight: 500 }}>
                  {item.amount}
                </TableCell>
                <TableCell>{item.date}</TableCell>
                {active && (
                  <TableCell>
                    <IconButton color="primary" size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Popup Form */}
      {/* <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" >
        
        <DialogTitle>Add New Income</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category / Title"
              name="title"
              value={newIncome.title}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={newIncome.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Amount"
              name="amount"
              value={newIncome.amount}
              onChange={handleChange}
              fullWidth
              required
              type="number"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddIncome} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
  open={open}
  onClose={handleClose}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: 4,
      p: 1,
      // background: "linear-gradient(145deg, #0c0d11ff, #cfd8e9)",
      // boxShadow:
      //   "10px 10px 25px rgba(0,0,0,0.25), -6px -6px 15px rgba(255,255,255,0.6)",
      transform: "translateY(-10px)",
      transition: "all 0.3s ease-in-out",
    },
  }}
>
  <DialogTitle
    sx={{
      textAlign: "center",
      fontWeight: 600,
      color: "#2c3e50",
      letterSpacing: 0.5,
    }}
  >
     Add New Income
  </DialogTitle>

  <DialogContent
    dividers
    sx={{
      background: "rgba(255, 255, 255, 0.8)",
      // borderRadius: "",
      // boxShadow: "inset 4px 4px 8px #c7cbd1, inset -4px -4px 8px #ffffff",
    }}
  >
    <Stack spacing={2} mt={1}>
      <TextField
        label="Category / Title"
        name="title"
        value={newIncome.title}
        onChange={handleChange}
        fullWidth
        required
        sx={{
          bgcolor: "#f9fbff",
          borderRadius: 2,
          boxShadow:
            "inset 2px 2px 4px #cfd3da, inset -2px -2px 4px #ffffff",
        }}
      />
      <TextField
        label="Description"
        name="description"
        value={newIncome.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={2}
        sx={{
          bgcolor: "#f9fbff",
          borderRadius: 2,
          boxShadow:
            "inset 2px 2px 4px #cfd3da, inset -2px -2px 4px #ffffff",
        }}
      />
      <TextField
        label="Amount"
        name="amount"
        value={newIncome.amount}
        onChange={handleChange}
        fullWidth
        required
        type="number"
        sx={{
          bgcolor: "#f9fbff",
          borderRadius: 2,
          boxShadow:
            "inset 2px 2px 4px #cfd3da, inset -2px -2px 4px #ffffff",
        }}
      />
    </Stack>
  </DialogContent>

  <DialogActions sx={{ justifyContent: "center", p: 2 }}>
    <Button
      onClick={handleClose}
      sx={{
        textTransform: "none",
        fontWeight: 500,
        borderRadius: 3,
        color: "#0e0d0dff",
        px: 3,
        boxShadow: "2px 2px 5px #221a1aff, -2px -2px 5px #0e0c0cff",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "3px 3px 8px #1b1919ff, -3px -3px 8px #292020ff",
        },
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleAddIncome}
      variant="contained"
      sx={{
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 3,
        px: 4,
        background: "linear-gradient(145deg, #007BFF, #0056d6)",
        boxShadow: "4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(26, 22, 22, 0.5)",
        "&:hover": {
          background: "linear-gradient(145deg, #0056d6, #007BFF)",
          transform: "translateY(-3px)",
          boxShadow: "6px 6px 12px rgba(0,0,0,0.4), -6px -6px 12px rgba(255,255,255,0.6)",
        }
      }}
    >
      Save
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default IncomePage;

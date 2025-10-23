import React, { useState } from 'react';
import {
  Container, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Button, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ExpenseDetails = () => {
  const [open, setOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    description: '',
    amount: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewExpense({ title: '', description: '', amount: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = () => {
    // Logic to add expense goes here
    console.log('New Expense:', newExpense);
    handleClose();
  };

  const expenses = [
    { description: 'Transition/Naeme', amount: 25, date: '25/12/AUT', balance: -86 },
    { description: 'Grossston/Walmart', amount: 20, date: '25/12/AUT', balance: -170 },
    { description: 'Transition/Naeme', amount: 15, date: '25/12/AUT', balance: -215 },
    { description: 'Groceries at Walmart', amount: 25, date: '25/12/AUT', balance: -15 },
    { description: 'Monthly Rent', amount: 120, date: '25/12/AUT', balance: -86 },
    { description: 'Electricity Bill', amount: 15, date: '25/12/AUT', balance: -215 },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        View Your Expenses
      </Typography>

      {/* Summary Section */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Expenses</Typography>
            <Typography variant="h6">$190.50</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Last 7 Days</Typography>
            <Typography variant="h6">6 Expenses</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Biggest Expense</Typography>
            <Typography variant="h6">Rent - $120.00</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Expense
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount ($)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Balance ($)</TableCell>
              <TableCell align="center">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((exp, index) => (
              <TableRow key={index}>
                <TableCell>{exp.description}</TableCell>
                <TableCell>{exp.amount.toFixed(2)}</TableCell>
                <TableCell>{exp.date}</TableCell>
                <TableCell sx={{ color: 'red' }}>{exp.balance.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Adding Expense */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
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
          Add New Expense
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ background: "rgba(255, 255, 255, 0.8)" }}
        >
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category / Title"
              name="title"
              value={newExpense.title}
              onChange={handleChange}
              fullWidth
              required
              sx={{
                bgcolor: "#f9fbff",
                borderRadius: 2,
                boxShadow: "inset 2px 2px 4px #cfd3da, inset -2px -2px 4px #ffffff",
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={newExpense.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              sx={{
                bgcolor: "#f9fbff",
                borderRadius: 2,
                boxShadow: "inset 2px 2px 4px #cfd3da, inset -2px -2px 4px #ffffff",
              }}
            />
            <TextField
              label="Amount"
              name="amount"
              value={newExpense.amount}
              onChange={handleChange}
              fullWidth
              required
              type="number"
              sx={{
                bgcolor: "#f9fbff",
                borderRadius: 2,
                boxShadow: "inset 2px 2px 4px #cfd3da, inset -2px -2px 4px #ffffff",
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", p: 2 }}>
          <Button onClick={handleClose} sx={{
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
          }}>
            Cancel
          </Button>
          <Button onClick={handleAddExpense} variant="contained" sx={{
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
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpenseDetails;
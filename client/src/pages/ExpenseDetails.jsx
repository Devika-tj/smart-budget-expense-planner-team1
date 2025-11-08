import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Button, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, Switch, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const categories = ["Food", "Rent", "Travel", "Shopping", "Bills", "Health", "Other"];
const paymentModes = ["Cash", "Card", "UPI"];

const ExpenseDetails = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: '',
    amount: '',
    paymentMode: 'Cash',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get('http://localhost:8000/api/expense/get');
      setExpenses(res.data);
    } catch (err) {
      console.error('Fetch Expense Error:', err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewExpense({
      title: '',
      category: '',
      amount: '',
      paymentMode: 'Cash',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveExpense = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (editId) {
        await axios.put(`http://localhost:8000/api/expense/update/${editId}`, newExpense);
      } else {
        await axios.post('http://localhost:8000/api/expense/add', newExpense);
      }

      fetchExpenses();
      handleClose();
    } catch (err) {
      console.error('Add/Update Expense Error:', err);
      alert("Failed to save entry");
    }
  };

  const handleEdit = (exp) => {
    setNewExpense({
      title: exp.title,
      category: exp.category,
      amount: exp.amount,
      paymentMode: exp.paymentMode,
      type: exp.type,
      date: exp.date.split('T')[0],
    });
    setEditId(exp._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await axios.delete(`http://localhost:8000/api/expense/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error('Delete Expense Error:', err);
    }
  };

  const totalExpense = expenses.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const last7Days = expenses.filter((e) => ((new Date() - new Date(e.date)) / (1000*60*60*24)) <= 7);
  const biggestExpense = expenses.length ? expenses.reduce((max, e) => (e.amount > max.amount ? e : max), expenses[0]) : null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Expense Details</Typography>
        <Button variant="contained" color="error" startIcon={<AddIcon />} onClick={handleOpen}>Add Expense</Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}><Typography variant="subtitle1">Total Expenses</Typography><Typography variant="h6">₹{totalExpense.toFixed(2)}</Typography></Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}><Typography variant="subtitle1">Last 7 Days</Typography><Typography variant="h6">{last7Days.length} Entries</Typography></Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2 }}><Typography variant="subtitle1">Biggest</Typography><Typography variant="h6">{biggestExpense ? `${biggestExpense.title} - ₹${biggestExpense.amount}` : '—'}</Typography></Paper>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body1" fontWeight="500">Manage Entries</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2">Edit / Delete</Typography>
          <Switch checked={active} onChange={() => setActive(!active)} />
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
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
                      <IconButton color="primary" size="small" onClick={() => handleEdit(exp)}><EditIcon /></IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(exp._id)}><DeleteIcon /></IconButton>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{editId ? 'Edit Entry' : 'Add Entry'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Title" name="title" value={newExpense.title} onChange={handleChange} fullWidth required />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select name="category" value={newExpense.category} onChange={handleChange} label="Category" required>
                {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={newExpense.type} onChange={handleChange} label="Type">
                <MenuItem value="expense">Expense</MenuItem>
                <MenuItem value="income">Income</MenuItem>
              </Select>
            </FormControl>

            <TextField label="Amount" name="amount" value={newExpense.amount} onChange={handleChange} fullWidth required type="number" />
            <FormControl fullWidth>
              <InputLabel>Payment Mode</InputLabel>
              <Select name="paymentMode" value={newExpense.paymentMode} onChange={handleChange} label="Payment Mode">
                {paymentModes.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Date" name="date" value={newExpense.date} onChange={handleChange} fullWidth required type="date" InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveExpense} variant="contained">{editId ? 'Update' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExpenseDetails;

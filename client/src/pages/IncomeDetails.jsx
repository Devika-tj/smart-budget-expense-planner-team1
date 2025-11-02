
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import {
// //   Box,
// //   Typography,
// //   Button,
// //   Switch,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   IconButton,
// //   TextField,
// //   Stack,
// //   Paper,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   MenuItem,
// //   Select,
// //   InputLabel,
// //   FormControl,
// // } from "@mui/material";
// // import EditIcon from "@mui/icons-material/Edit";
// // import DeleteIcon from "@mui/icons-material/Delete";

// // const IncomePage = () => {
// //   const [active, setActive] = useState(false);
// //   const [open, setOpen] = useState(false);
// //   const [editMode, setEditMode] = useState(false);
// //   const [selectedId, setSelectedId] = useState(null);

// //   const [newIncome, setNewIncome] = useState({
// //     title: "",
// //     description: "",
// //     amount: "",
// //     category: "Other",
// //   });

// //   const [incomeData, setIncomeData] = useState([]);

// //   // ✅ Fetch all income from backend
// //   useEffect(() => {
// //     fetchIncomeData();
// //   }, []);

// //   const fetchIncomeData = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:8000/income");
// //       setIncomeData(res.data);
// //     } catch (err) {
// //       console.error("Error fetching income:", err);
// //     }
// //   };

// //   // ✅ Open / Close popup
// //   const handleOpen = () => setOpen(true);
// //   const handleClose = () => {
// //     setOpen(false);
// //     setEditMode(false);
// //     setNewIncome({ title: "", description: "", amount: "", category: "Other" });
// //   };

// //   // ✅ Handle input change
// //   const handleChange = (e) => {
// //     setNewIncome({ ...newIncome, [e.target.name]: e.target.value });
// //   };

// //   // ✅ Add or Edit Income
// //   const handleSaveIncome = async () => {
// //     if (!newIncome.title || !newIncome.amount) {
// //       alert("Please fill all required fields!");
// //       return;
// //     }

// //     try {
// //       if (editMode && selectedId) {
// //         // Update income
// //         await axios.put(`http://localhost:8000/income/${selectedId}`, newIncome);
// //       } else {
// //         // Add new income
// //         await axios.post("http://localhost:8000/income", newIncome);
// //       }
// //       fetchIncomeData(); // refresh table
// //       handleClose();
// //     } catch (err) {
// //       console.error("Error saving income:", err);
// //       alert("Failed to save income");
// //     }
// //   };

// //   // ✅ Delete income
// //   const handleDelete = async (id) => {
// //     if (window.confirm("Are you sure you want to delete this income?")) {
// //       try {
// //         await axios.delete(`http://localhost:8000/income/${id}`);
// //         fetchIncomeData();
// //       } catch (err) {
// //         console.error("Error deleting income:", err);
// //       }
// //     }
// //   };

// //   // ✅ Edit income
// //   const handleEdit = (item) => {
// //     setEditMode(true);
// //     setSelectedId(item._id);
// //     setNewIncome({
// //       title: item.title,
// //       description: item.description,
// //       amount: item.amount,
// //       category: item.category || "Other",
// //     });
// //     setOpen(true);
// //   };

// //   return (
// //     <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", p: 4 }}>
// //       {/* Header */}
// //       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
// //         <Typography variant="h5" fontWeight="600">
// //           View Your Income
// //         </Typography>

// //         <Stack direction="row" alignItems="center" spacing={3}>
// //           <Stack direction="row" alignItems="center" spacing={1}>
// //             <Switch
// //               checked={active}
// //               onChange={() => setActive(!active)}
// //               color="primary"
// //             />
// //             <Typography variant="body2">Edit / Delete</Typography>
// //           </Stack>

// //           <Button
// //             variant="contained"
// //             color="primary"
// //             sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
// //             onClick={handleOpen}
// //           >
// //             + Add Income
// //           </Button>
// //         </Stack>
// //       </Stack>

// //       {/* Table */}
// //       <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
// //         <Table>
// //           <TableHead>
// //             <TableRow sx={{ backgroundColor: "#f0f3fa" }}>
// //               <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
// //               <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
// //               <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
// //               <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
// //               <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
// //               {active && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
// //             </TableRow>
// //           </TableHead>

// //           <TableBody>
// //             {incomeData.map((item, index) => (
// //               <TableRow key={index} hover>
// //                 <TableCell>{item.title}</TableCell>
// //                 <TableCell>{item.description}</TableCell>
// //                 <TableCell sx={{ color: "green", fontWeight: 500 }}>
// //                   ₹{item.amount}
// //                 </TableCell>
// //                 <TableCell>{item.category}</TableCell>
// //                 <TableCell>
// //                   {new Date(item.createdAt).toLocaleDateString()}
// //                 </TableCell>
// //                 {active && (
// //                   <TableCell>
// //                     <IconButton
// //                       color="primary"
// //                       size="small"
// //                       onClick={() => handleEdit(item)}
// //                     >
// //                       <EditIcon />
// //                     </IconButton>
// //                     <IconButton
// //                       color="error"
// //                       size="small"
// //                       onClick={() => handleDelete(item._id)}
// //                     >
// //                       <DeleteIcon />
// //                     </IconButton>
// //                   </TableCell>
// //                 )}
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       {/* Dialog Form */}
// //       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
// //         <DialogTitle
// //           sx={{
// //             textAlign: "center",
// //             fontWeight: 600,
// //             color: "#2c3e50",
// //           }}
// //         >
// //           {editMode ? "Edit Income" : "Add New Income"}
// //         </DialogTitle>

// //         <DialogContent dividers>
// //           <Stack spacing={2} mt={1}>
// //             <TextField
// //               label="Title"
// //               name="title"
// //               value={newIncome.title}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //             />
// //             <TextField
// //               label="Description"
// //               name="description"
// //               value={newIncome.description}
// //               onChange={handleChange}
// //               fullWidth
// //               multiline
// //               rows={2}
// //             />
// //             <TextField
// //               label="Amount"
// //               name="amount"
// //               value={newIncome.amount}
// //               onChange={handleChange}
// //               fullWidth
// //               required
// //               type="number"
// //             />
// //             <FormControl fullWidth>
// //               <InputLabel>Category</InputLabel>
// //               <Select
// //                 name="category"
// //                 value={newIncome.category}
// //                 onChange={handleChange}
// //                 label="Category"
// //               >
// //                 <MenuItem value="Salary">Salary</MenuItem>
// //                 <MenuItem value="Freelance">Freelance</MenuItem>
// //                 <MenuItem value="Investment">Investment</MenuItem>
// //                 <MenuItem value="Business">Business</MenuItem>
// //                 <MenuItem value="Other">Other</MenuItem>
// //               </Select>
// //             </FormControl>
// //           </Stack>
// //         </DialogContent>

// //         <DialogActions sx={{ justifyContent: "center", p: 2 }}>
// //           <Button onClick={handleClose} color="secondary">
// //             Cancel
// //           </Button>
// //           <Button
// //             onClick={handleSaveIncome}
// //             variant="contained"
// //             color="primary"
// //           >
// //             {editMode ? "Update" : "Save"}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </Box>
// //   );
// // };

// // export default IncomePage;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Button,
//   Switch,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   TextField,
//   Stack,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const IncomePage = () => {
//   const [active, setActive] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   const [newIncome, setNewIncome] = useState({
//     title: "",
//     description: "",
//     amount: "",
//     category: "Other",
//   });

//   const [incomeData, setIncomeData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // ✅ Base URL & Auth Config
//   const API_URL = "http://localhost:8000/api/income";
//   const token = localStorage.getItem("token");

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//     },
//   };

//   // ✅ Fetch all incomes for logged-in user
//   useEffect(() => {
//     fetchIncomeData();
//   }, []);

//   const fetchIncomeData = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(API_URL, config);
//       setIncomeData(res.data || []);
//     } catch (err) {
//       console.error("Error fetching income:", err);
//       if (err.response?.status === 401) {
//         alert("⚠️ Session expired or invalid token. Please log in again.");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Open/Close Dialog
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     setEditMode(false);
//     setSelectedId(null);
//     setNewIncome({ title: "", description: "", amount: "", category: "Other" });
//   };

//   // ✅ Handle Input Change
//   const handleChange = (e) => {
//     setNewIncome({ ...newIncome, [e.target.name]: e.target.value });
//   };

//   // ✅ Add or Edit Income
//   const handleSaveIncome = async () => {
//     if (!newIncome.title || !newIncome.amount) {
//       alert("Please fill all required fields!");
//       return;
//     }

//     try {
//       if (editMode && selectedId) {
//         await axios.put(`${API_URL}/${selectedId}`, newIncome, config);
//       } else {
//         await axios.post(API_URL, newIncome, config);
//       }
//       fetchIncomeData();
//       handleClose();
//     } catch (err) {
//       console.error("Error saving income:", err);
//       alert(err.response?.data?.message || "Failed to save income");
//     }
//   };

//   // ✅ Delete Income
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this income?")) {
//       try {
//         await axios.delete(`${API_URL}/${id}`, config);
//         fetchIncomeData();
//       } catch (err) {
//         console.error("Error deleting income:", err);
//       }
//     }
//   };

//   // ✅ Edit Income
//   const handleEdit = (item) => {
//     setEditMode(true);
//     setSelectedId(item._id);
//     setNewIncome({
//       title: item.title,
//       description: item.description,
//       amount: item.amount,
//       category: item.category || "Other",
//     });
//     setOpen(true);
//   };

//   return (
//     <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", p: 4 }}>
//       {/* Header */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
//         <Typography variant="h5" fontWeight={600}>
//           View Your Income
//         </Typography>

//         <Stack direction="row" alignItems="center" spacing={3}>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <Switch checked={active} onChange={() => setActive(!active)} color="primary" />
//             <Typography variant="body2">Edit / Delete</Typography>
//           </Stack>

//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
//             onClick={handleOpen}
//           >
//             + Add Income
//           </Button>
//         </Stack>
//       </Stack>

//       {/* Table */}
//       <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#f0f3fa" }}>
//               <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
//               {active && <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>}
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : incomeData.length > 0 ? (
//               incomeData.map((item) => (
//                 <TableRow key={item._id} hover>
//                   <TableCell>{item.title}</TableCell>
//                   <TableCell>{item.description}</TableCell>
//                   <TableCell sx={{ color: "green", fontWeight: 500 }}>
//                     ₹{item.amount}
//                   </TableCell>
//                   <TableCell>{item.category}</TableCell>
//                   <TableCell>
//                     {new Date(item.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   {active && (
//                     <TableCell>
//                       <IconButton color="primary" onClick={() => handleEdit(item)}>
//                         <EditIcon />
//                       </IconButton>
//                       <IconButton color="error" onClick={() => handleDelete(item._id)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
//                   No income records found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Dialog Form */}
//       <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
//         <DialogTitle sx={{ textAlign: "center", fontWeight: 600, color: "#2c3e50" }}>
//           {editMode ? "Edit Income" : "Add New Income"}
//         </DialogTitle>

//         <DialogContent dividers>
//           <Stack spacing={2} mt={1}>
//             <TextField
//               label="Title"
//               name="title"
//               value={newIncome.title}
//               onChange={handleChange}
//               fullWidth
//               required
//             />
//             <TextField
//               label="Description"
//               name="description"
//               value={newIncome.description}
//               onChange={handleChange}
//               fullWidth
//               multiline
//               rows={2}
//             />
//             <TextField
//               label="Amount"
//               name="amount"
//               value={newIncome.amount}
//               onChange={handleChange}
//               fullWidth
//               required
//               type="number"
//             />
//             <FormControl fullWidth>
//               <InputLabel>Category</InputLabel>
//               <Select
//                 name="category"
//                 value={newIncome.category}
//                 onChange={handleChange}
//                 label="Category"
//               >
//                 <MenuItem value="Salary">Salary</MenuItem>
//                 <MenuItem value="Freelance">Freelance</MenuItem>
//                 <MenuItem value="Investment">Investment</MenuItem>
//                 <MenuItem value="Business">Business</MenuItem>
//                 <MenuItem value="Other">Other</MenuItem>
//               </Select>
//             </FormControl>
//           </Stack>
//         </DialogContent>

//         <DialogActions sx={{ justifyContent: "center", p: 2 }}>
//           <Button onClick={handleClose} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveIncome} variant="contained" color="primary">
//             {editMode ? "Update" : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default IncomePage;
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
      const res = await axios.get("http://localhost:5000/api/income", {
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
          `http://localhost:5000/api/income/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/income", formData, {
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
        await axios.delete(`http://localhost:5000/api/income/${id}`, {
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

import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Stack, TextField, Button, Grid, LinearProgress } from "@mui/material";
import { FormControlLabel, Switch } from "@mui/material";
import axios from "axios";

const BudgetPage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [limit, setLimit] = useState("");
  const [progress, setProgress] = useState(0);
  const [budget, setBudget] = useState(null);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => { fetchBudget(); }, [month, year]);

  const fetchBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.get(`http://localhost:8000/api/budget/get?month=${month}&year=${year}`);
      setBudget(res.data.budget || null);
      setProgress(res.data.progress || 0);
    } catch (err) {
      console.error("Fetch budget error", err);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post("http://localhost:8000/api/budget/set", { month, year, limit: Number(limit), isYearly, });
      fetchBudget();
    } catch (err) {
      console.error("Save budget error", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Budget Setup</Typography>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Month (1-12)" value={month} onChange={(e) => setMonth(Number(e.target.value))} fullWidth /></Grid>
            <Grid item xs={6}><TextField label="Year" value={year} onChange={(e) => setYear(Number(e.target.value))} fullWidth /></Grid>
          </Grid>
          <TextField label="Monthly Limit (₹)" value={limit} onChange={(e) => setLimit(e.target.value)} type="number" />
          <FormControlLabel
            control={<Switch checked={isYearly} onChange={() => setIsYearly(!isYearly)} />}
            label={isYearly ? "Yearly Budget Mode" : "Monthly Budget Mode"}
          />

          <Button variant="contained" onClick={handleSave} sx={{backgroundColor:"#05155fff"}}>Save Budget</Button>

          {budget && (
            <>
              <Typography>Budget Limit: ₹{budget.limit}</Typography>
              <LinearProgress variant="determinate" value={progress} />
              <Typography>{progress}% used</Typography>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default BudgetPage;

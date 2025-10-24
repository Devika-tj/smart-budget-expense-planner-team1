import React from "react";
import ExpenseDetails from "./pages/ExpenseDetails";
import AdminDashboard from "./pages/AdminDashboard";
import IncomePage from "./pages/IncomeDetails"

function App() {
  return (
    <div>
      <AdminDashboard />
      <ExpenseDetails />
      <IncomePage/>
    </div>
  );


}
export default App;

import React from "react";
import ExpenseDetails from "./pages/ExpenseDetails";
import AdminDashboard from "./pages/AdminDashboard";
import IncomePage from "./pages/IncomeDetails"
import Sidebar from "./components/Sidebar";


function App() {
  return (
    <div>
      <Sidebar />
      <AdminDashboard />
      <ExpenseDetails />
      <IncomePage/>

    </div>
  );


}
export default App;

import React from "react";
import './App.css'
import ExpenseDetails from "./pages/ExpenseDetails";
import AdminDashboard from "./pages/AdminDashboard";
import IncomePage from "./pages/IncomeDetails"
import Sidebar from "./components/Sidebar";
import DashBoardLayout from "./layouts/DashBoardLayout";
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'


function App() {
  return (
    <div>

      {/* Without Sidebar */}

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/sidebar' element={<Sidebar />}></Route>

        {/* With Sidebar */}
        <Route
          path="/admindash"
          element={
            <DashBoardLayout>
              <AdminDashboard />
            </DashBoardLayout>
          }
        />
        <Route
          path="/expense"
          element={
            <DashBoardLayout>
              <ExpenseDetails />
            </DashBoardLayout>
          }
        />
        <Route
          path="/income"
          element={
            <DashBoardLayout>
              <IncomePage />
            </DashBoardLayout>
          }
        />

      </Routes>

    </div>
  );


}
export default App;


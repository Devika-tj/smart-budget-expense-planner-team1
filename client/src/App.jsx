import React from "react";
import './App.css'
import ExpenseDetails from "./pages/ExpenseDetails";
import AdminDashboard from "./pages/AdminDashboard";
import IncomePage from "./pages/IncomeDetails"
import Sidebar from "./components/Sidebar";
import DashBoardLayout from "./layouts/DashBoardLayout";
import AuthSuccess from "./pages/Authsuccess"
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'


function App() {
  return (
    <div>

      {/* Without Sidebar */}

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/sidebar' element={<Sidebar />}></Route>
        <Route path='/auth-success' element={<AuthSuccess />}></Route>


        {/* With Sidebar */}
        <Route
          path="/admindash"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashBoardLayout>
                <AdminDashboard />
              </DashBoardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/userdashboard" element={<DashBoardLayout><UserDashboard /></DashBoardLayout>} />
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
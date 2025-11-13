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
import BudgetPage from "./pages/BudgetPage";
import ResetPassword from "./pages/ResetPassward";
import Home from './pages/Home'
import Settings from './pages/Settings'
import { Route, Routes } from 'react-router-dom'



const App = ()=>{
  return (
    <div>

    

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/sidebar' element={<Sidebar />}></Route>
        <Route path='/auth-success' element={<AuthSuccess />}></Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


     
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

        <Route path="/budget" element={<DashBoardLayout><BudgetPage /></DashBoardLayout>} />

      </Routes>

    </div>
  );


}
export default App;
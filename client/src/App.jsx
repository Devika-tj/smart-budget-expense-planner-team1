import React from "react";
import './App.css'
import ExpenseDetails from "./pages/ExpenseDetails";
import AdminDashboard from "./pages/AdminDashboard";
import IncomePage from "./pages/IncomeDetails"
import Sidebar from "./components/Sidebar";
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'


function App() {
  return (
    <div>
       
     <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/sidebar' element={<Sidebar/>}></Route>
        <Route path='/admindash' element={<AdminDashboard/>}></Route>
        <Route path='/expense' element={<ExpenseDetails/>}></Route>
        <Route path='/income' element={<IncomePage/>}></Route>
      </Routes>
     
    </div>
  );


}
export default App;


// <<<<<<< HEAD
// import React from 'react'
// import ExpenseDetails from './pages/ExpenseDetails'

// const App = () => {
//   return (
//     <div>

//       <ExpenseDetails />
      
//     </div>
//   )
// =======
// import React from "react";
// import AdminDashboard from "./pages/AdminDashboard";

// function App() {
//   return <AdminDashboard />;
// >>>>>>> b65f17210b6413a42409e4aaef16436d89ea55db
// }

// export default App;

import React from "react";
import ExpenseDetails from "./pages/ExpenseDetails";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div>
      <AdminDashboard />
      <ExpenseDetails />
    </div>
  );
}

export default App;

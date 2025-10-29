import React from 'react'
import Box from '@mui/material/Box'
import Sidebar from '../components/Sidebar'


const DashBoardLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', minHeight: "100vh" }}>

            <Sidebar />

            <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f7fb" }}>
                {children}
            </Box>


        </Box>


    )
}

export default DashBoardLayout

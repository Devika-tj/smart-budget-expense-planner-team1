import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import { FaPiggyBank } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useState } from 'react';
import AuthDialog from '../components/AuthDialog';

const Navbar = () => {
  const [openAuth, setOpenAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); 
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpen = (mode) => {
    setAuthMode(mode);
    setOpenAuth(true);
  };

  const handleClose = () => setOpenAuth(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'white', color: '#1e3a8a'}}>
          <Toolbar>
           
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ color: '#fb8f8fff' }}
            >
              <FaPiggyBank />
              
            </IconButton>

          
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: 'fantasy',
                fontSize: 'xx-large'
              }}
            >
              <Link to='/' style={{ textDecoration: 'none' }}>
                <strong>PiggyTrack</strong>
              </Link>
            </Typography>

           
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                display: { xs: "none", md: "flex" },
                gap: 2,
              }}
            >
              <ScrollLink to="features-section">
                <Button
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#eaebef" }
                  }}
                >
                  Features
                </Button>
              </ScrollLink>
              <ScrollLink to="about-section">
                <Button
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontFamily: 'Raleway, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#eaebef" }
                  }}
                >
                  About
                </Button>
              </ScrollLink>
            </Box>

            
            <Button
              variant="contained"
              onClick={() => handleOpen("login")}
              sx={{
                backgroundColor: "#04206dff",
                "&:hover": { backgroundColor: "#062989ff" },
                display: { xs: "none", md: "flex" }
              }}
            >
              Login
            </Button>

          
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleOpenNavMenu}
                sx={{ color: '#1e3a8a' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <ScrollLink to="features-section">
                    <Button
                      color="inherit"
                      sx={{
                        textTransform: 'none',
                        fontFamily: 'Raleway, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      Features
                    </Button>
                  </ScrollLink>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <ScrollLink to="about-section">
                    <Button
                      color="inherit"
                      sx={{
                        textTransform: 'none',
                        fontFamily: 'Raleway, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        width: '100%',
                      }}
                    >
                      About
                    </Button>
                  </ScrollLink>
                </MenuItem>
                <MenuItem onClick={() => { handleOpen("login"); handleCloseNavMenu(); }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#04206dff",
                      "&:hover": { backgroundColor: "#062989ff" },
                      width: '100%',
                    }}
                  >
                    Login
                  </Button>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>

    
          <AuthDialog
            open={openAuth}
            handleClose={handleClose}
            mode={authMode}
            setAuthMode={setAuthMode}
          />
        </AppBar>
      </Box>
    </div>
  );
};

export default Navbar;

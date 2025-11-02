import * as React from 'react';
import Navbar from './Navbar';
import Footer from './Footer'
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import heroSectionImg from "../assets/chart.png"; 
import budgetImg from "../assets/budgetPlanning.jpg"; 
import expenseImg from "../assets/expense.png"; 
import goalImg from "../assets/goal.jpg"; 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AuthDialog from '../components/AuthDialog';
import { useState } from 'react';

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true, // for better mobile fit
  };

  const [openAuth, setOpenAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleOpen = (mode) => {
    setAuthMode(mode);
    setOpenAuth(true);
  };
  const handleClose = () => setOpenAuth(false);

  return (
    <div>
      <Navbar/>
      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          py: { xs: 6, md: 10 },
          gap: 4,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#0f172a",
              lineHeight: 1.2,
              fontFamily: "cursive",
              fontSize: { xs: "2rem", md: "3rem" }, 
            }}
          >
            Master Your Money.
            <Box component="span" sx={{ color: "#3f51b5" }}>
              Live Freely
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: 480,
              fontFamily: "Arial , sans-serif",
              fontSize: { xs: "1rem", md: "1.25rem" }, 
              mx: { xs: "auto", md: 0 }, 
            }}
          >
            Smart Budgeting & Expense Tracking for a Brighter Financial Future
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#04206dff",
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.2 },
              fontWeight: 600,
              borderRadius: "30px",
              "&:hover": { backgroundColor: "#062989ff" },
            }}
            onClick={() => handleOpen("signup")}
          >
            Get Started — It’s Free
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={heroSectionImg}
            alt="chart"
            style={{
              width: "100%",
              maxWidth: "350px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Container>

      {/* Slider Section */}
      <Container maxWidth="lg" sx={{ my: 6 }}>
        <Card
          id="features-section"
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            backgroundColor: "#FEFFFF",
          }}
        >
          <Slider {...settings}>
            {/* Slide 1 */}
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "Arial , sans-serif",
                  textAlign: { xs: "center", md: "left" }, 
                }}
              >
                What is Budget Planning?
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" }, 
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: 200 }, 
                    height: { xs: "auto", md: 160 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 3,
                    mb: { xs: 2, md: 0 }, 
                  }}
                >
                  <img
                    src={budgetImg}
                    alt="budget planning"
                    style={{
                      width: "100%",
                      maxWidth: "350px",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    ml: { xs: 0, md: 5 },
                    fontFamily: "Arial , sans-serif",
                  }}
                >
                  <ul style={{ textAlign: "left" }}>
                    <li>Set Spending Limits</li>
                    <li>Categorize Your Expenses</li>
                    <li>Achieve Financial Goals</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>

            {/* Slide 2 */}
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "Arial , sans-serif",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Track Your Expenses
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: 200 },
                    height: { xs: "auto", md: 160 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 3,
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  <img
                    src={expenseImg}
                    alt="piggy chart"
                    style={{
                      width: "100%",
                      maxWidth: "350px",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    ml: { xs: 0, md: 5 },
                    fontFamily: "Arial , sans-serif",
                  }}
                >
                  <ul style={{ textAlign: "left" }}>
                    <li>Monitor daily spending instantly</li>
                    <li>View clear expense summaries</li>
                    <li>Get alerts when budgets exceed</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>

            {/* Slide 3 */}
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "Arial , sans-serif",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Set Financial Goals
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 2,
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: 200 },
                    height: { xs: "auto", md: 160 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 3,
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  <img
                    src={goalImg}
                    alt="goal tracking"
                    style={{
                      width: "100%",
                      maxWidth: "350px",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    ml: { xs: 0, md: 5 },
                    fontFamily: "Arial , sans-serif",
                  }}
                >
                  <ul style={{ textAlign: "left" }}>
                    <li>Create and track saving goals</li>
                    <li>See progress with visuals</li>
                    <li>Stay motivated to achieve more</li>
                  </ul>
                </Typography>
              </Box>
            </CardContent>
          </Slider>
        </Card>
      </Container>

      <AuthDialog open={openAuth} handleClose={handleClose} mode={authMode} setAuthMode={setAuthMode} />
       <Footer/>
    </div>
  );
};

export default Home;
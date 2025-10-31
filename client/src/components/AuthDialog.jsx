import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const AuthDialog = ({ open, handleClose, mode, setAuthMode }) => {
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  const handleSwitchMode = () => {
    setAuthMode(isLogin ? "signup" : "login");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.8, rotateY: 30 },
        animate: { opacity: 1, scale: 1, rotateY: 0 },
        exit: { opacity: 0, scale: 0.8, rotateY: -30 },
        transition: { duration: 0.6, ease: "easeOut" },
        sx: {
          borderRadius: "20px",
          background: "linear-gradient(145deg, #f5f8ff, #ffffff)",
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.1), inset 4px 4px 8px rgba(255,255,255,0.6)",
          width: "400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 700,
          color: "#04206dff",
          fontFamily: "Poppins, sans-serif",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        {isLogin
          ? "Login"
          : isSignup
          ? "Sign Up"
          : isForgot
          ? "Forgot Password"
          : "Reset Password"}
        <IconButton onClick={handleClose} sx={{ color: "#04206dff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          background: "linear-gradient(145deg, #ffffff, #f0f4ff)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* ---------------- LOGIN / SIGNUP ---------------- */}
        {(isLogin || isSignup) && (
          <>
            {!isLogin && (
              <>
                <TextField
                  label="Role"
                  type="text"
                  size="small"
                  margin="normal"
                  value="user"
                  sx={{ width: "17rem", display: "none" }}
                />
                <TextField
                  label="Full Name"
                  type="text"
                  size="small"
                  margin="normal"
                  sx={{ width: "17rem" }}
                />
              </>
            )}
            <TextField
              label="Email"
              type="email"
              size="small"
              margin="normal"
              sx={{ width: "17rem" }}
            />
            <TextField
              label="Password"
              type="password"
              size="small"
              margin="normal"
              sx={{ width: "17rem" }}
            />

            {/* Forgot Password link inside Login */}
            {isLogin && (
              <Typography
                variant="body2"
                sx={{
                  alignSelf: "flex-end",
                  color: "#04206dff",
                  mt: 1,
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => setAuthMode("forgot")}
              >
                Forgot Password?
              </Typography>
            )}

            {!isLogin && (
              <TextField
                label="Confirm Password"
                type="password"
                size="small"
                margin="normal"
                sx={{ width: "17rem" }}
              />
            )}

            <Button
              variant="outlined"
              sx={{
                mt: 2,
                width: "17rem",
                borderColor: "#ccc",
                textTransform: "none",
              }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width="20"
                height="20"
                style={{ marginRight: "10px" }}
              />
              Continue with Google
            </Button>

            {/* Switch Between Login and Signup */}
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {isLogin ? (
                <>
                  Don’t have an account?{" "}
                  <Button
                    onClick={handleSwitchMode}
                    sx={{
                      textTransform: "none",
                      color: "#04206dff",
                      fontWeight: 600,
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button
                    onClick={handleSwitchMode}
                    sx={{
                      textTransform: "none",
                      color: "#04206dff",
                      fontWeight: 600,
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    Login
                  </Button>
                </>
              )}
            </Typography>
          </>
        )}

        {/* ---------------- FORGOT PASSWORD ---------------- */}
        {isForgot && (
          <>
            <Typography
              variant="body1"
              sx={{ mb: 2, color: "#04206dff", fontWeight: 500 }}
            >
              Enter your registered email to get a reset link
            </Typography>
            <TextField
              label="Email"
              type="email"
              size="small"
              margin="normal"
              sx={{ width: "17rem" }}
            />

            {/* Back to Login link */}
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: "#04206dff",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => setAuthMode("login")}
            >
              ← Back to Login
            </Typography>
          </>
        )}

        {/* ---------------- RESET PASSWORD ---------------- */}
        {isReset && (
          <>
            <Typography
              variant="body1"
              sx={{ mb: 2, color: "#04206dff", fontWeight: 500 }}
            >
              Set your new password
            </Typography>
            <TextField
              label="New Password"
              type="password"
              size="small"
              margin="normal"
              sx={{ width: "17rem" }}
            />
            <TextField
              label="Confirm Password"
              type="password"
              size="small"
              margin="normal"
              sx={{ width: "17rem" }}
            />

            {/* Back to Login link */}
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: "#04206dff",
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => setAuthMode("login")}
            >
              ← Back to Login
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 4, pb: 3, mt: 2, justifyContent: "center" }}>
        <Button
          component={motion.button}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 4px 15px rgba(4,32,109,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          variant="contained"
          sx={{
            backgroundColor: "#04206dff",
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "12px",
            px: 4,
            py: 1.2,
            boxShadow: "0 5px 15px rgba(4,32,109,0.3)",
            "&:hover": { backgroundColor: "#062989ff" },
          }}
          onClick={() => {
            if (isForgot) setAuthMode("reset");
            else if (isReset) setAuthMode("login");
          }}
        >
          {isLogin
            ? "Login"
            : isSignup
            ? "Sign Up"
            : isForgot
            ? "Send Reset Link"
            : "Reset Password"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const OtpDialog = ({ open, email, onVerified, onClose }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (timer > 0 && open) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else if (timer === 0) {
      setDisabled(true);
    }
  }, [timer, open]);

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/verify-otp", {
        email,
        otp,
      });
      alert(res.data.message);
      onVerified();
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/resend-otp", {
        email,
      });
      alert(res.data.message);
      setTimer(60);
      setDisabled(false);
    } catch (err) {
      alert(err.response?.data?.message || "Resend failed");
    }
  };

  return (
    <Dialog
      open={open}
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4 },
        sx: {
          borderRadius: "16px",
          width: "350px",
          background: "linear-gradient(145deg, #f5f8ff, #ffffff)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
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
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Enter OTP
        <IconButton onClick={onClose} sx={{ color: "#04206dff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </Typography>
        <TextField
          label="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          fullWidth
          size="small"
        />
        <Typography variant="body2" sx={{ mt: 2 }}>
          {disabled
            ? "OTP expired. Click Resend to get a new one."
            : `You can resend OTP in ${timer} seconds`}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleVerify}
          variant="contained"
          sx={{
            backgroundColor: "#04206dff",
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            px: 3,
            "&:hover": { backgroundColor: "#062989ff" },
          }}
        >
          Verify
        </Button>
        <Button
          onClick={handleResend}
          disabled={!disabled}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#04206dff",
            color: "#04206dff",
            fontWeight: 600,
            borderRadius: "10px",
            px: 3,
          }}
        >
          Resend OTP
        </Button>
      </DialogActions>
    </Dialog>
  );
};


const AuthDialog = ({
  open,
  handleClose,
  mode,
  setAuthMode,
  resetToken,
  resetEmail,
}) => {
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";


  useEffect(() => {

    // Reset form only when switching between login and signup
    if (isLogin || isSignup) {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }

    // Keep email when switching to forgot-password
    if (isForgot) {
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    }
  }, [mode]);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");


  useEffect(() => {
    if (isReset && resetEmail) {
      setFormData((prev) => ({ ...prev, email: resetEmail }));
    }
  }, [isReset, resetEmail]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};

    if (isSignup && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (isSignup && formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must contain at least 3 letters";
    } else if (isSignup && !/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full name can only contain letters and spaces";
    }

    if ((isLogin || isSignup || isForgot) && !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      (isLogin || isSignup || isForgot) &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if ((isLogin || isSignup || isReset) && !formData.password) {
      newErrors.password = "Password is required";
    } else if ((isSignup || isReset) && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (
      (isSignup || isReset) &&
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include 1 uppercase, 1 number, and 1 special character";
    }

    if ((isSignup || isReset) && !formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (
      (isSignup || isReset) &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      if (isLogin) {
        const res = await axios.post("http://localhost:8000/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const { user, token } = res.data;
        if (!user || !token) return alert("Login failed.");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        alert(res.data.message || "Login successful!");

        navigate(user.role === "admin" ? "/admindash" : "/userdashboard");
        handleClose();
      } else if (isSignup) {
        const res = await axios.post("http://localhost:8000/auth/signup", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: "user",
        });
        alert(res.data.message || "Signup successful! Please verify email.");
        setEmailForOtp(formData.email);
        setShowOtpDialog(true);
      } else if (isForgot) {
        const res = await axios.post(
          "http://localhost:8000/api/auth/forgot-password",
          { email: formData.email }
        );
        alert(res.data.msg || "Password reset link sent! Check your email.");
        setAuthMode("login");
      } else if (isReset) {
        const res = await axios.post(
          `http://localhost:8000/api/auth/reset-password/${resetToken}`,
          {
            password: formData.password,
          }
        );
        alert(res.data.msg || "Password reset successful!");
        setAuthMode("login");
        handleClose();
        navigate("/");

      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setAuthMode(isLogin ? "signup" : "login");
  };

  const handleOtpVerified = () => {
    setShowOtpDialog(false);
    alert("Email verified successfully! You can now log in.");
    setAuthMode("login");
  };

  const handleOtpClose = () => setShowOtpDialog(false);


  return (
    <>
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
            gap: 1,
            background: "linear-gradient(145deg, #ffffff, #f0f4ff)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          {isSignup && (
            <TextField
              label="Full Name"
              name="fullName"
              size="small"
              fullWidth
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          )}

          {/* Email */}
          {(isLogin || isSignup || isForgot) && (
            <TextField
              label="Email"
              name="email"
              type="email"
              size="small"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                readOnly: isReset,
              }}
            />
          )}

          {/* Password */}
          {(isLogin || isSignup || isReset) && (
            <TextField
              label={isReset ? "New Password" : "Password"}
              name="password"
              type={showPassword ? "text" : "password"}
              size="small"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}


          {(isSignup || isReset) && (
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              size="small"
              fullWidth
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword((p) => !p)
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {isLogin && (
            <Typography
              variant="body2"
              sx={{
                alignSelf: "flex-end",
                color: "#04206dff",
                mt: 1,
                cursor: "pointer",
              }}
              onClick={() => setAuthMode("forgot")}
            >
              Forgot Password?
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 4, pb: 3, justifyContent: "center" }}>
          <Button
            component={motion.button}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 4px 15px rgba(4,32,109,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "#04206dff",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "12px",
              px: 4,
              py: 1.2,
              width: "100%",
              "&:hover": { backgroundColor: "#062989ff" },
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

        {/* Google Auth */}
        {(isLogin || isSignup) && (
          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              variant="outlined"
              onClick={() =>
                window.open("http://localhost:8000/auth/google", "_self")
              }
              sx={{
                width: "70%",
                textTransform: "none",
                borderColor: "#0c0e10ff",
                color: "#231f1fff",
                fontWeight: "bold",
                boxShadow: 3,
              }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width="20"
                height="20"
                style={{ marginRight: 10 }}
              />
              Continue with Google
            </Button>
          </DialogActions>
        )}

        {(isLogin || isSignup) && (
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Typography variant="body2">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
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
                {isLogin ? "Sign Up" : "Login"}
              </Button>
            </Typography>
          </DialogActions>
        )}
      </Dialog>

      {/* OTP Dialog */}
      <OtpDialog
        open={showOtpDialog}
        email={emailForOtp}
        onVerified={handleOtpVerified}
        onClose={handleOtpClose}
      />
    </>
  );
};

export default AuthDialog;

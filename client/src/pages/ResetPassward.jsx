import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AuthDialog from "../components/AuthDialog";

const ResetPassword = () => {
  const location = useLocation();
  const { token: paramToken } = useParams(); 
  const [open, setOpen] = useState(false);
  const [mode, setAuthMode] = useState("login");
  const [resetData, setResetData] = useState({ token: "", email: "" });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token") || paramToken; 
    const email = params.get("email") || ""; 

    if (token) {
      setResetData({ token, email });
      setAuthMode("reset");
      setOpen(true);
    }
  }, [location, paramToken]);

  return (
    <AuthDialog
      open={open}
      handleClose={() => setOpen(false)}
      mode={mode}
      setAuthMode={setAuthMode}
      resetToken={resetData.token}
      resetEmail={resetData.email}
    />
  );
};

export default ResetPassword;

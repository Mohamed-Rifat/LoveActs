import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/UseCart";

export default function FinalMessage() {
  const { clearAllCart } = useCart();
  const navigate = useNavigate();

  const handleFinish = async () => {
    await clearAllCart();   // 🧹 يمسح الكارت
    navigate("/");          // ↩️ يرجع للهوم
  };

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        🎉 Thank you for your order 🎉
      </Typography>
      <Typography variant="h6" gutterBottom>
        We are happy with your order and hope you enjoy it 💖
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        You can return to the home page or start a new order.
      </Typography>

      <Button variant="contained" color="primary" onClick={handleFinish}>
        Close
      </Button>
    </Box>
  );
}

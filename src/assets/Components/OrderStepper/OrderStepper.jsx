import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel, Box, Paper, Container, Typography, IconButton } from "@mui/material";
import { FiCoffee, FiX, FiCheckCircle } from "react-icons/fi";

import ChooseDrink from "./Steps/ChooseDrink";
import ConfirmPersonalInfo from "./Steps/ConfirmPersonalInfo";
import ReviewOrder from "./Steps/ReviewOrder";
import DeliveryStatus from "./Steps/DeliveryStatus";
import FinalMessage from "./Steps/FinalMessage";

const steps = [
  "Select Cafe & Drink",
  "Confirm Personal Info",
  "Review & Confirm Order",
  "Order in Progress",
  "Thank You Message"
];

export default function OrderStepper({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setUserData(JSON.parse(user));
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => {
    setActiveStep(0);
    setSelectedCafe(null);
    setSelectedDrink(null);
    setUserData({ name: "", email: "", phone: "" });
  };

  const handlePersonalInfoConfirm = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUserData(data);
    handleNext();
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ChooseDrink
            selectedCafe={selectedCafe}
            selectedDrink={selectedDrink}
            onSelectCafe={setSelectedCafe}
            onSelectDrink={(drink) => { setSelectedDrink(drink); handleNext(); }}
          />
        );
      case 1:
        return <ConfirmPersonalInfo userInitialData={userData} onConfirm={handlePersonalInfoConfirm} onBack={handleBack} />;
      case 2:
        return <ReviewOrder selectedCafe={selectedCafe} selectedDrink={selectedDrink} userData={userData} onBack={handleBack} onConfirm={handleNext} />;
      case 3:
        return <DeliveryStatus onNext={handleNext} />;
      case 4:
        return <FinalMessage onFinish={onClose || handleReset} />;
      default:
        return <Box>Unknown step</Box>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
          <Box className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
            <Box className="flex items-center">
              <FiCoffee className="text-2xl mr-2" />
              <Typography variant="h6" fontWeight={600}>Drink Order System</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{
                        width: 32, height: 32, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        backgroundColor: activeStep === index ? "primary.main" : activeStep > index ? "#4caf50" : "#e0e0e0",
                        color: "white"
                      }}>
                        {activeStep > index ? <FiCheckCircle /> : index + 1}
                      </Box>
                    )}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ minHeight: 420 }}>
              {renderStepContent(activeStep)}
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

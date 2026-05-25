import React, { useState, useEffect, useRef } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  Container,
  Typography
} from "@mui/material";
import { FiCoffee, FiCheckCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmPersonalInfo from "./Steps/ConfirmPersonalInfo";
import ReviewOrder from "./Steps/ReviewOrder";
import DeliveryStatus from "./Steps/DeliveryStatus";
import FinalMessage from "./Steps/FinalMessage";

const steps = [
  "Confirm Personal Info",
  "Review & Confirm Order",
  "Order in Progress",
  "Order Confirmed"
];

export default function OrderStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const isMovingToNext = useRef(false);

  const [userData, setUserData] = useState({});
  const [orderData, setOrderData] = useState({
    deliveryOption: "",
    finalTotal: 0,
    drinkSelections: []
  });
  const [cartData, setCartData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUserData(JSON.parse(savedUser));

      if (location.state) {
        const {
          deliveryOption = "",
          finalTotal = 0,
          drinkSelections = [],
          cartData = []
        } = location.state;

        setOrderData({ deliveryOption, finalTotal, drinkSelections });
        setCartData(cartData);
      }
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  }, [location.state]);

  useEffect(() => {
    if (!isLoading && (!orderData.deliveryOption || orderData.finalTotal <= 0)) {
      navigate("/cart", { replace: true });
    }
  }, [isLoading, orderData, navigate]);

  const handleNext = () => {
    if (isMovingToNext.current) {
      return;
    }

    if (activeStep < steps.length - 1) {
      isMovingToNext.current = true;
      setActiveStep(prev => {
        const newStep = prev + 1;
        setTimeout(() => {
          isMovingToNext.current = false;
        }, 500);
        return newStep;
      });
    } else {
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate("/cart");
    } else {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleOrderConfirm = (orderResult) => {
    setOrderNumber(orderResult.orderId);
    setOrderDetails(orderResult);
    handleNext();
  };

  const handleFinish = () => {
    localStorage.removeItem("cartDrinkSelections");
    localStorage.removeItem("cartDeliveryOption");
    localStorage.removeItem("user");
    localStorage.removeItem("cartId");
    navigate("/", { replace: true });
  };

  const renderStepContent = (step) => {
    if (isLoading) {
      return <Typography>Loading...</Typography>;
    }
    switch (step) {
      case 0:
        return (
          <ConfirmPersonalInfo
            userInitialData={userData}
            onConfirm={(data) => {
              setUserData(data);
              handleNext();
            }}
            onBack={handleBack}
          />
        );

      case 1:
        return (
          <ReviewOrder
            userData={userData}
            deliveryOption={orderData.deliveryOption}
            finalTotal={orderData.finalTotal}
            drinkSelections={orderData.drinkSelections}
            cartData={cartData}
            expandedItems={orderData.expandedItems}
            groupedItems={orderData.groupedItems}
            subtotal={orderData.subtotal}
            onBack={handleBack}
            onConfirm={handleOrderConfirm}
          />
        );

      case 2:
        return <DeliveryStatus orderNumber={orderNumber} onComplete={handleNext} />;

      case 3:
        return (
          <FinalMessage
            orderNumber={orderNumber}
            orderDetails={orderDetails}
            userData={userData}
            orderData={orderData}
            cartData={cartData}
            onFinish={handleFinish}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Container maxWidth="lg">
        <Paper elevation={2}>
          <Box className="bg-gradient-to-r from-[#CF848A] to-[#A85C68] p-6 text-white">
            <Box className="flex items-center justify-between">
              <Box className="flex items-center">
                <FiCoffee className="text-2xl mr-3" />
                <Typography variant="h6" fontWeight={600}>
                  Complete Your Order
                </Typography>
              </Box>
              <Typography variant="body2">
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor:
                            activeStep > index ? "#10b981" :
                              activeStep === index ? "#CF848A" :
                                "#e5e7eb",
                          color: "white"
                        }}
                      >
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
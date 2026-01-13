// import React, { useEffect, useState } from "react";
// import { Box, Typography, Button } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiHome, FiCheckCircle, FiShoppingBag, FiHeart, FiStar } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../../../hooks/UseCart";

// export default function FinalMessage() {
//   const { clearAllCart, cart } = useCart();
//   const navigate = useNavigate();
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showElements, setShowElements] = useState([false, false, false, false]);

//   useEffect(() => {
//     const clearCartOnLoad = async () => {
//       if (cart && cart.length > 0) {
//         await clearAllCart();
//         console.log("Cart automatically cleared on page load");
//       }
//     };
//     clearCartOnLoad();

//     setTimeout(() => setShowConfetti(true), 500);

//     showElements.forEach((_, index) => {
//       setTimeout(() => {
//         setShowElements(prev => {
//           const newArr = [...prev];
//           newArr[index] = true;
//           return newArr;
//         });
//       }, 800 + index * 300);
//     });
//   }, []);

//   const handleFinish = () => {
//     navigate("/");
//   };

//   const handleNewOrder = () => {
//     navigate("/products");
//   };

//   const Confetti = () => (
//     <div className="confetti-container">
//       {[...Array(50)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="confetti"
//           initial={{
//             opacity: 0,
//             y: -100,
//             x: Math.random() * 100 - 50
//           }}
//           animate={{
//             opacity: [0, 1, 0],
//             y: window.innerHeight,
//             x: Math.random() * 200 - 100,
//             rotate: Math.random() * 360
//           }}
//           transition={{
//             duration: 2 + Math.random() * 2,
//             delay: Math.random() * 1.5,
//             ease: "easeOut"
//           }}
//           style={{
//             left: `${Math.random() * 100}%`,
//             background: ['#CF848A', '#A85C68', '#FFD700', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 5)],
//             width: Math.random() * 10 + 5,
//             height: Math.random() * 15 + 10,
//             position: 'absolute',
//             borderRadius: '2px'
//           }}
//         />
//       ))}
//     </div>
//   );

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         background: "white",
//         p: 2,
//         position: "relative",
//         overflow: "hidden"
//       }}
//     >
//       <AnimatePresence>
//         {showConfetti && <Confetti />}
//       </AnimatePresence>

//       <div className="stars">
//         {[...Array(20)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="star"
//             animate={{
//               opacity: [0.3, 1, 0.3],
//               scale: [1, 1.2, 1]
//             }}
//             transition={{
//               duration: 2 + Math.random() * 2,
//               repeat: Infinity,
//               delay: Math.random() * 2
//             }}
//             style={{
//               position: 'absolute',
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               color: '#FFD700',
//               fontSize: `${Math.random() * 10 + 10}px`
//             }}
//           >
//             <FiStar />
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         initial={{ opacity: 0, scale: 0.8, y: 40 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         style={{
//           background: "rgba(255, 255, 255, 0.95)",
//           backdropFilter: "blur(20px)",
//           borderRadius: "24px",
//           boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.1)",
//           padding: "50px 40px",
//           maxWidth: "500px",
//           width: "100%",
//           textAlign: "center",
//           position: "relative",
//           zIndex: 10
//         }}
//       >
//         <motion.div
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
//           style={{
//             marginBottom: "30px",
//             position: "relative",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center"
//           }}
//         >

//           <motion.div
//             animate={{
//               scale: [1, 1.1, 1],
//               rotate: [0, 5, -5, 0]
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               repeatDelay: 3
//             }}
//           >
//             <FiCheckCircle size={80} color="#CF848A" />
//           </motion.div>

//           <motion.div
//             initial={{ scale: 0, opacity: 0 }}
//             animate={{ scale: 1.5, opacity: 0 }}
//             transition={{ duration: 1.5, delay: 0.8 }}
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: '100px',
//               height: '100px',
//               borderRadius: '50%',
//               border: '3px solid #CF848A',
//               zIndex: -1
//             }}
//           />
//         </motion.div>

//         <AnimatePresence>
//           {showElements[0] && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <Typography
//                 variant="h3"
//                 fontWeight="bold"
//                 sx={{
//                   mb: 2,
//                   color: "#2D3748",
//                   background: "#CF848A",
//                   backgroundClip: "text",
//                   WebkitBackgroundClip: "text",
//                   color: "transparent"
//                 }}
//               >
//                 Order Complete! 🎉
//               </Typography>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {showElements[1] && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{
//                   mb: 2,
//                   color: "#4A5568",
//                   lineHeight: 1.6
//                 }}
//               >
//                 Your order has been placed successfully!
//               </Typography>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {showElements[2] && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//             >
//               <Typography
//                 sx={{
//                   mb: 4,
//                   color: "#718096",
//                   fontSize: "16px",
//                   lineHeight: 1.6
//                 }}
//               >
//                 Thank you for choosing us! Your products and drinks are being prepared
//                 with love and care. We can't wait to serve you again! ✨
//               </Typography>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <AnimatePresence>
//           {showElements[3] && (
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//               style={{
//                 display: "flex",
//                 gap: "16px",
//                 justifyContent: "center",
//                 flexWrap: "wrap"
//               }}
//             >
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button
//                   variant="contained"
//                   onClick={handleFinish}
//                   size="large"
//                   startIcon={<FiHome />}
//                   sx={{
//                     backgroundColor: "#CF848A",
//                     "&:hover": {
//                       backgroundColor: "#A85C68",
//                       transform: "translateY(-2px)",
//                       boxShadow: "0 8px 20px rgba(207, 132, 138, 0.3)"
//                     },
//                     px: 4,
//                     py: 1.5,
//                     borderRadius: "12px",
//                     fontSize: "16px",
//                     textTransform: "none",
//                     fontWeight: "600",
//                     transition: "all 0.3s ease",
//                     boxShadow: "0 4px 12px rgba(207, 132, 138, 0.2)"
//                   }}
//                 >
//                   Back to Home
//                 </Button>
//               </motion.div>

//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button
//                   variant="outlined"
//                   onClick={handleNewOrder}
//                   size="large"
//                   startIcon={<FiShoppingBag />}
//                   sx={{
//                     borderColor: "#CF848A",
//                     color: "#CF848A",
//                     "&:hover": {
//                       backgroundColor: "#FFF3F3",
//                       borderColor: "#A85C68",
//                       color: "#A85C68",
//                       transform: "translateY(-2px)",
//                       boxShadow: "0 8px 20px rgba(207, 132, 138, 0.2)"
//                     },
//                     px: 4,
//                     py: 1.5,
//                     borderRadius: "12px",
//                     fontSize: "16px",
//                     textTransform: "none",
//                     fontWeight: "600",
//                     transition: "all 0.3s ease"
//                   }}
//                 >
//                   Order Again
//                 </Button>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 2 }}
//           style={{ marginTop: "30px" }}
//         >
//           <Typography
//             variant="caption"
//             sx={{
//               color: "#A0AEC0",
//               fontStyle: "italic",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               gap: "8px"
//             }}
//           >
//             <FiHeart size={14} />
//             Made with love for our amazing customers
//           </Typography>
//         </motion.div>
//       </motion.div>

//       <style>
//         {`
//           .confetti-container {
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             pointer-events: none;
//             z-index: 5;
//           }
          
//           .stars {
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 100%;
//             height: 100%;
//             pointer-events: none;
//             z-index: 1;
//           }
//         `}
//       </style>
//     </Box>
//   );
// }
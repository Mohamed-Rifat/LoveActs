import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import Divider from '@mui/material/Divider';
import { useReactToPrint } from 'react-to-print';
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Paper,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  useTheme,
  alpha
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useToken } from "../../Context/TokenContext/TokenContext";
import {
  Person as PersonIcon,
  ShoppingBag as ShoppingBagIcon,
  Print as PrintIcon,
  WhatsApp as WhatsAppIcon,
  Image as ImageIcon,
  PictureAsPdf as PictureAsPdfIcon
} from "@mui/icons-material";

const BASE_URL = "https://flowers-vert-six.vercel.app";

const fetchAdminOrders = async ({ token, status }) => {
  try {
    const params = { sort: "-createdAt" };
    if (status && status !== "all") {
      params.status = status;
    }

    const response = await axios.get(`${BASE_URL}/api/order/admin/orders`, {
      params,
      headers: { Authorization: `Admin ${token}` },
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(response.data)}`);
    }
    return response.data.orders || [];
  } catch (err) {
    throw err;
  }
};

const updateOrderStatus = async ({ token, orderId, status }) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/order/admin/${orderId}/status`,
      { status },
      {
        headers: { Authorization: `Admin ${token}`, "Content-Type": "application/json" },
        validateStatus: () => true,
      }
    );

    if (response.status !== 200) {
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(response.data)}`);
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};

const OrderDetailsDialog = ({ order, open, onClose }) => {
  if (!order) return null;

  const theme = useTheme();
  const invoiceRef = useRef();
  const baseProductPrice = order.productId?.price || 0;
  const baseProductQuantity = 1;
  const baseProductTotal = baseProductPrice * baseProductQuantity;

  const cafeProductsTotal = Array.isArray(order.cafeProduct)
    ? order.cafeProduct.reduce((sum, product) => sum + (product.price || 0) * (product.quantity || 1), 0)
    : 0;

  const totalWithCafe = baseProductTotal + cafeProductsTotal;

  const formatDate = (dateString) => {
    if (!dateString) return "Not Selected";
    try {
      const [day, month, year] = dateString.split('/');
      const date = new Date(`${year}-${month}-${day}`);

      return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (error) {
      return dateString;
    }
  };

  const sendWhatsApp = () => {
    const customerName = order.userId?.name || "Customer";
    const orderId = order._id?.slice(-8).toUpperCase() || "N/A";
    const totalAmount = totalWithCafe;
    const formattedDate = formatDate(order.selectedDate);

    let productsText = "";

    if (order.productId) {
      productsText += ` *${order.productId.name}*\n`;
      productsText += `   Price: ${order.productId.price} LE x 1 = ${order.productId.price} LE\n\n`;
    }

    if (Array.isArray(order.cafeProduct) && order.cafeProduct.length > 0) {
      productsText += `☕ *Cafe Drinks:*\n`;
      order.cafeProduct.forEach((product, index) => {
        const subtotal = product.price * (product.quantity || 1);
        productsText += `   ${index + 1}. ${product.name} - ${product.price} LE x ${product.quantity || 1} = ${subtotal} LE\n`;
      });
      productsText += '\n';
    }

    const message =
      `💐 *Love Acts* 💐
━━━━━━━━━━━━━━━━━━
✨ *Your Order Details* ✨
━━━━━━━━━━━━━━━━━━

🧾 *Order Name:* ${customerName}'s Order  
🆔 *Order ID:* ${orderId}  
👤 *Customer:* ${customerName}  
📞 *Phone:* ${order.contactPhone || 'N/A'}  
📌 *Status:* ${order.status?.toUpperCase()}  

📅 *Order Date:* ${new Date(order.createdAt).toLocaleDateString()}  
🚚 *Delivery Date:* ${formattedDate}  
⏰ *Delivery Time:* ${order.selectedTimeSlote || 'Not specified'}

━━━━━━━━━━━━━━━━━━
🛍️ *ORDER ITEMS*
━━━━━━━━━━━━━━━━━━

${productsText}
━━━━━━━━━━━━━━━━━━
💰 *ORDER SUMMARY*
━━━━━━━━━━━━━━━━━━

🌸 Base Products: ${baseProductTotal} LE  
${order.cafeProduct?.length ? `☕ Cafe Drinks: ${cafeProductsTotal} LE\n` : ''}

━━━━━━━━━━━━━━━━━━
✨ *TOTAL AMOUNT: ${totalAmount} LE* ✨
━━━━━━━━━━━━━━━━━━

❤️ *Thank you for choosing Love Acts!* ❤️  
Your trust means everything to us 🌹  

✨ We carefully prepare every order with love to make your moments unforgettable.  
✨ We’d be happy to serve you again very soon!

📞 *Support Team:*  
If you need any help, feel free to contact us anytime — we’re always here for you 🤍

🌷 *Love Acts – Because every flower tells a story* 🌷`;


    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

    toast.success("Order details ready to share on WhatsApp!");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Invoice - ${order._id?.slice(-8).toUpperCase()}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background: #fff;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #1976d2;
            border-radius: 10px;
            padding: 25px;
            background: #fff;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #1976d2;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #1976d2;
            margin: 0;
            font-size: 32px;
          }
          .header h2 {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 18px;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .info-box {
            flex: 1;
          }
          .info-box h3 {
            color: #1976d2;
            margin: 0 0 10px 0;
            font-size: 18px;
          }
          .info-box p {
            margin: 5px 0;
            font-size: 14px;
          }
          .table-container {
            margin: 30px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th {
            background: #1976d2;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background: #f8f9fa;
          }
          .total-section {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
          }
          .grand-total {
            font-size: 24px;
            font-weight: bold;
            color: #1976d2;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #1976d2;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          @media print {
            body { padding: 0; }
            .invoice-container { border: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>Love Acts</h1>
            <h2>Order #${order._id?.slice(-8).toUpperCase()}</h2>
            <p>Date: ${new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
          </div>
          
          <div class="info-section">
            <div class="info-box">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${order.name || "Unknown"}</p>
              <p><strong>Email:</strong> ${order.userId?.email || "Unknown"}</p>
              <p><strong>Phone:</strong> ${order.contactPhone || "Not provided"}</p>
            </div>
            <div class="info-box">
              <h3>Delivery Information</h3>
              <p><strong>Date:</strong> ${formatDate(order.selectedDate)}</p>
              <p><strong>Time:</strong> ${order.selectedTimeSlote || "Not specified"}</p>
              <p><strong>Status:</strong> ${order.status?.toUpperCase()}</p>
            </div>
          </div>
          
          <div class="table-container">
            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${order.productId ? `
                <tr>
                  <td>${order.productId.name}</td>
                  <td>Flower Product</td>
                  <td>1</td>
                  <td>${order.productId.price} LE</td>
                  <td>${order.productId.price} LE</td>
                </tr>
                ` : ''}
                
                ${Array.isArray(order.cafeProduct) ? order.cafeProduct.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>Cafe Drink</td>
                  <td>${product.quantity || 1}</td>
                  <td>${product.price} LE</td>
                  <td>${(product.price || 0) * (product.quantity || 1)} LE</td>
                </tr>
                `).join('') : ''}
              </tbody>
            </table>
          </div>
          
          <div class="total-section">
            <h3>Order Summary</h3>
            <div class="total-row">
              <span>Base Product:</span>
              <span>${baseProductTotal} LE</span>
            </div>
            ${order.cafeProduct?.length > 0 ? `
            <div class="total-row">
              <span>Cafe Drinks (${order.cafeProduct.length} items):</span>
              <span>${cafeProductsTotal} LE</span>
            </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>TOTAL AMOUNT:</span>
              <span>${totalWithCafe} LE</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your order!</p>
            <p>For any inquiries, please contact our customer service.</p>
            <p>This is a computer-generated invoice. No signature required.</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    toast.success("Print dialog opened successfully!");
  };

  const saveAsImage = async () => {
    if (!invoiceRef.current) return;

    toast.loading("Generating image...");

    try {
      const dataUrl = await toPng(invoiceRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '10px',
          padding: '20px',
          background: '#ffffff'
        }
      });

      const link = document.createElement('a');
      link.download = `order-${order._id?.slice(-8).toUpperCase()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss();
      toast.success("Image saved successfully!");
    } catch (error) {
      console.error('Error saving image:', error);
      toast.dismiss();
      toast.error("Failed to save image");
    }
  };

  const saveAsPDF = () => {
    toast.loading("Generating PDF...");

    const pdfWindow = window.open('', '_blank');

    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice { max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #1976d2; }
          .info { display: flex; justify-content: space-between; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background: #1976d2; color: white; }
          .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>INVOICE</h1>
            <h3>Order #${order._id?.slice(-8).toUpperCase()}</h3>
          </div>
          
          <div class="info">
            <div>
              <h4>Customer:</h4>
              <p>${order.name || "Unknown"}</p>
              <p>${order.contactPhone || "N/A"}</p>
            </div>
            <div>
              <h4>Order Date:</h4>
              <p>${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.productId ? `
              <tr>
                <td>${order.name} (Flower)</td>
                <td>1</td>
                <td>${order.productId.price} LE</td>
                <td>${order.productId.price} LE</td>
              </tr>
              ` : ''}
              
              ${Array.isArray(order.cafeProduct) ? order.cafeProduct.map(product => `
              <tr>
                <td>${product.name} (Drink)</td>
                <td>${product.quantity || 1}</td>
                <td>${product.price} LE</td>
                <td>${(product.price || 0) * (product.quantity || 1)} LE</td>
              </tr>
              `).join('') : ''}
            </tbody>
          </table>
          
          <div class="total">
            <p>Total Amount: <strong>${totalWithCafe} LE</strong></p>
          </div>
          
          <div class="footer">
            <p>Thank you for your order!</p>
          </div>
        </div>
        
        <script>
          setTimeout(() => {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          }, 500);
        </script>
      </body>
      </html>
    `;

    pdfWindow.document.write(pdfContent);
    pdfWindow.document.close();

    setTimeout(() => {
      toast.dismiss();
      toast.success("PDF ready to print/save!");
    }, 1000);
  };

  const products = [];

  if (order.productId) {
    products.push({
      ...order.productId,
      id: order.productId._id,
      name: order.productId.name,
      price: order.productId.price,
      quantity: 1,
      isBaseProduct: true,
      image: order.productId.image || "/Logo.PNG",
      type: "Flower Arrangement"
    });
  }

  if (Array.isArray(order.cafeProduct)) {
    order.cafeProduct.forEach((product, index) => {
      products.push({
        ...product,
        id: product._id || `cafe-${index}`,
        name: product.name || "Cafe Drink",
        price: product.price || 0,
        quantity: product.quantity || 1,
        isCafeProduct: true,
        image: "/Logo.PNG",
        type: "Cafe Drink"
      });
    });
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[8]
          }
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 3,
            position: 'relative'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Order #{order._id?.slice(-8).toUpperCase() || "N/A"}
              </Typography>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </Typography>
            </Box>
            <Chip
              label={order.status?.toUpperCase()}
              color={getStatusColor(order.status)}
              sx={{
                fontWeight: 'bold',
                color: 'white',
                height: 32,
                boxShadow: theme.shadows[2]
              }}
            />
          </Box>
        </Box>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box ref={invoiceRef} sx={{ display: 'none' }}>
            <InvoicePreview order={order} products={products} totalWithCafe={totalWithCafe} />
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">Customer Information</Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <InfoCard title="Personal Details">
                  <Typography variant="body2" fontWeight="bold">{order.name || "Unknown"}</Typography>
                  {/* <Typography variant="caption" color="text.secondary">{order.email || "Unknown"}</Typography> */}
                </InfoCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoCard title="Contact">
                  <Typography variant="body2" fontWeight="bold">{order.contactPhone || "Not Provided"}</Typography>
                  <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                </InfoCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <InfoCard title="Delivery">
                  <Typography variant="body2" fontWeight="bold">{formatDate(order.selectedDate)}</Typography>
                  <Typography variant="caption" color="text.secondary">{order.selectedTimeSlote || "Time not set"}</Typography>
                </InfoCard>
              </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingBagIcon sx={{ color: theme.palette.success.main, mr: 2 }} />
                <Typography variant="h6" fontWeight="bold">Order Items</Typography>
              </Box>

              {products.map((product, index) => (
                <ProductItem key={index} product={product} index={index} theme={theme} />
              ))}
            </Box>

            <Box sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
            }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Order Summary</Typography>

              <Box sx={{ mb: 2 }}>
                <SummaryRow label="Base Product" value={`${baseProductTotal} LE`} />
                {order.cafeProduct?.length > 0 && (
                  <SummaryRow
                    label={`Cafe Drinks (${order.cafeProduct.length})`}
                    value={`${cafeProductsTotal} LE`}
                  />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">Total Amount</Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {totalWithCafe} LE
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{
          p: 2,
          bgcolor: 'background.default',
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Close
          </Button>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={sendWhatsApp}
              sx={{ borderRadius: 2 }}
            >
              WhatsApp
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<ImageIcon />}
              onClick={saveAsImage}
              sx={{ borderRadius: 2 }}
            >
              Save Image
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<PictureAsPdfIcon />}
              onClick={saveAsPDF}
              sx={{ borderRadius: 2 }}
            >
              Save PDF
            </Button>

            <Button
              variant="contained"
              color="info"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ borderRadius: 2 }}
            >
              Print
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

const InfoCard = ({ title, children }) => (
  <Box sx={{
    p: 2,
    borderRadius: 2,
    bgcolor: 'background.default',
    border: `1px solid`,
    borderColor: 'divider',
    height: '100%'
  }}>
    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const ProductItem = ({ product, index, theme }) => (
  <Box sx={{
    display: 'flex',
    alignItems: 'center',
    p: 2,
    mb: 1,
    borderRadius: 2,
    bgcolor: product.isCafeProduct ? alpha('#FFA500', 0.05) : alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${product.isCafeProduct ? alpha('#FFA500', 0.2) : alpha(theme.palette.primary.main, 0.2)}`
  }}>
    <Box sx={{ position: 'relative', mr: 2 }}>
      <Box
        component="img"
        src={product.image}
        alt={product.name}
        sx={{
          width: 50,
          height: 50,
          borderRadius: 50,
          objectFit: 'cover',
          border: `2px solid ${product.isCafeProduct ? '#FFA500' : theme.palette.primary.main}`
        }}
      />
    </Box>

    <Box sx={{ flex: 1 }}>
      <Typography variant="body1" fontWeight="medium">
        {product.name}
        <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
          ({product.isCafeProduct ? 'Drink' : 'Flower'})
        </Typography>
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          {product.price} LE × {product.quantity}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {product.price * product.quantity} LE
        </Typography>
      </Box>
    </Box>
  </Box>
);

const SummaryRow = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" fontWeight="bold">{value}</Typography>
  </Box>
);

const InvoicePreview = ({ order, products, totalWithCafe }) => (
  <Box sx={{
    width: 800,
    p: 4,
    bgcolor: 'white',
    color: 'black',
    fontFamily: 'Arial, sans-serif'
  }}>
    <Typography variant="h4" fontWeight="bold" color="#1976d2" textAlign="center">
      ORDER INVOICE
    </Typography>
    <Typography variant="h6" color="#666" textAlign="center" gutterBottom>
      #{order._id?.slice(-8).toUpperCase()}
    </Typography>
  </Box>
);

const InvoiceContent = React.forwardRef(({ order, products, totalWithCafe }, ref) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not Selected";
    try {
      const [day, month, year] = dateString.split('/');
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
      <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
        <Typography variant="h4" fontWeight="bold" color="#1976d2">
          Love Acts
        </Typography>
        <Typography variant="h6" color="#666">
          Order #{order._id?.slice(-8).toUpperCase()}
        </Typography>
        <Typography variant="body2" color="#999">
          Date: {new Date(order.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" mb={1}>From:</Typography>
          <Typography variant="body1" fontWeight="bold">Flower Shop & Cafe</Typography>
          <Typography variant="body2">123 Flower Street, Cairo</Typography>
          <Typography variant="body2">Phone: +20 100 000 0000</Typography>
          <Typography variant="body2">Email: info@flowershop.com</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold" mb={1}>Bill To:</Typography>
          <Typography variant="body1" fontWeight="bold">{order.name || "Customer"}</Typography>
          <Typography variant="body2">{order.userId?.email || "N/A"}</Typography>
          <Typography variant="body2">Phone: {order.contactPhone || "N/A"}</Typography>
          <Typography variant="body2">Delivery: {formatDate(order.selectedDate)}</Typography>
          <Typography variant="body2">Time: {order.selectedTimeSlote || "N/A"}</Typography>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Order Details</Typography>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
          <Box sx={{
            display: 'flex',
            bgcolor: '#f5f5f5',
            p: 2,
            borderBottom: '1px solid #ddd',
            fontWeight: 'bold'
          }}>
            <Box sx={{ flex: 2 }}>Description</Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>Qty</Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>Unit Price</Box>
            <Box sx={{ flex: 1, textAlign: 'right' }}>Total</Box>
          </Box>

          {products.map((product, index) => (
            <Box key={index} sx={{
              display: 'flex',
              p: 2,
              borderBottom: '1px solid #eee',
              '&:last-child': { borderBottom: 'none' }
            }}>
              <Box sx={{ flex: 2 }}>
                <Typography fontWeight="medium">{product.name}</Typography>
                <Typography variant="caption" color="#666">
                  {product.isCafeProduct ? 'Cafe Drink' : 'Flower Product'}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>{product.quantity}</Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>{product.price} LE</Box>
              <Box sx={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
                {product.price * product.quantity} LE
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{
        bgcolor: '#f9f9f9',
        p: 3,
        borderRadius: 1,
        border: '1px solid #ddd'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography fontWeight="bold">{totalWithCafe} LE</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tax (0%):</Typography>
          <Typography>0.00 LE</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Shipping:</Typography>
          <Typography>0.00 LE</Typography>
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 2,
          pt: 2,
          borderTop: '2px solid #1976d2'
        }}>
          <Typography variant="h6" fontWeight="bold">Total:</Typography>
          <Typography variant="h5" fontWeight="bold" color="#1976d2">
            {totalWithCafe} LE
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #ddd', textAlign: 'center' }}>
        <Typography variant="caption" color="#666">
          Thank you for choosing Love Acts ❤️
          Your trust means everything to us 🌹
          ✨ We carefully prepare every order with love to make your moments unforgettable.
          ✨ We’d be happy to serve you again very soon!
        </Typography>
        <Typography variant="caption" color="#999" display="block">
          📞 *Support Team:*
          If you need any help, feel free to contact us anytime — we’re always here for you 🤍
        </Typography>
      </Box>
    </Box>
  );
});

const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "warning";
    case "processing": return "info";
    case "delivered": return "success";
    case "cancelled": return "error";
    default: return "default";
  }
};

export default function DashboardOrders() {
  const { user, token } = useToken();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [tab, setTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!user || user.role !== "Admin") {
    return (
      <Box className="text-center p-6">
        <Alert severity="error" sx={{ maxWidth: 500, mx: 'auto' }}>
          ⚠️ You must be an administrator to access this page.
        </Alert>
      </Box>
    );
  }

  const { data: orders = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["adminOrders", tab],
    queryFn: () => fetchAdminOrders({ token, status: tab }),
    enabled: !!token,
  });

  const mutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus({ token, orderId, status }),
    onSuccess: () => {
      toast.success("Order status updated successfully!");
      queryClient.invalidateQueries(["adminOrders", tab]);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    mutation.mutate({ orderId, status: newStatus });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed");
  };

  if (isLoading) {
    return (
      <Box className="flex flex-col justify-center items-center h-64">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading orders...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="text-center p-4">
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load orders: {error.message}
        </Alert>
        <Button
          variant="contained"
          onClick={() => refetch()}
          startIcon={<RefreshIcon />}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Paper
      className="p-4 shadow-lg rounded-2xl"
      sx={{
        background: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.8)
          : '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          📦 Order Management
        </Typography>
        <IconButton
          onClick={handleRefresh}
          color="primary"
          aria-label="Refresh"
          sx={{
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.1)
              : theme.palette.primary.light,
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.2)
                : alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant={isSmallScreen ? "scrollable" : "standard"}
        scrollButtons="auto"
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            fontWeight: 600,
            minWidth: isSmallScreen ? 80 : 100,
          }
        }}
      >
        <Tab value="all" label="All" />
        <Tab value="pending" label="Pending" />
        <Tab value="processing" label="Processing" />
        <Tab value="delivered" label="Delivered" />
        <Tab value="cancelled" label="Cancelled" />
      </Tabs>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No orders {tab !== 'all' ? `with status ${tab}` : ''}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Change the tab or check back later
          </Typography>
        </Box>
      ) : isMobile ? (
        <Grid spacing={2}>
          {orders.map((order) => {
            const totalWithCafe = (order.totalPrice || 0) + (order.cafeProduct?.price || 0);

            return (
              <Grid item xs={12} key={order._id}>
                <Card className=" m-2 " sx={{ boxShadow: theme.shadows[3] }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </Typography>
                      <IconButton size="small" onClick={() => handleViewDetails(order)} color="info">
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      User: {order.userId?.name || "Unknown"}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Total: {totalWithCafe} LE
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" sx={{ minWidth: 80 }} />
                      <Select size="small" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} sx={{ minWidth: 120 }}>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ overflowX: 'auto', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : theme.palette.primary.light }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => {
                const totalWithCafe = (order.totalPrice || 0) + (order.cafeProduct?.price || 0);

                return (
                  <TableRow key={order._id} sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.03) : alpha(theme.palette.primary.main, 0.02) } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>#{order._id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell>{order.name || "Unknown"}</TableCell>
                    <TableCell>{totalWithCafe} LE</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewDetails(order)} color="info" sx={{ border: `1px solid ${theme.palette.info.main}`, borderRadius: 1 }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <Select size="small" value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} sx={{ minWidth: 120 }}>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="processing">Processing</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      <OrderDetailsDialog order={selectedOrder} open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </Paper>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
    Grid,
    Chip,
    Snackbar,
    Alert,
    Avatar,
    Stack,
    alpha,
    IconButton,
    Tooltip,
    Container,
    Card,
    CardContent,
    Skeleton,
    useMediaQuery,
    useTheme,
    Fade,
    Grow,
    Zoom,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide
} from '@mui/material';
import {
    FiCheckCircle,
    FiCoffee,
    FiHome,
    FiClock,
    FiMapPin,
    FiPhone,
    FiUser,
    FiMail,
    FiCalendar,
    FiShoppingBag,
    FiCamera,
    FiTruck,
    FiGift,
    FiCopy,
    FiCheck,
    FiPackage,
    FiHeart,
    FiDownload,
    FiShare2,
    FiStar,
    FiAward,
    FiX,
    FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomToast = ({ open, message, severity, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClose, 300);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    if (!open && !visible) return null;

    return (
        <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    minWidth: { xs: '90%', sm: 400 },
                    maxWidth: 450,
                    animation: 'slideUp 0.3s ease-out'
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        background: severity === 'success'
                            ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                            : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                        color: 'white',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 2 }}>
                        <Box sx={{ flexShrink: 0 }}>
                            {severity === 'success' ? (
                                <FiCheckCircle size={28} />
                            ) : (
                                <FiAlertCircle size={28} />
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                {severity === 'success' ? 'Success!' : 'Error!'}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.95 }}>
                                {message}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setVisible(false);
                                setTimeout(onClose, 300);
                            }}
                            sx={{ color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                            <FiX size={18} />
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            bgcolor: 'rgba(255,255,255,0.3)',
                            animation: 'progressBar 3s linear forwards'
                        }}
                    />
                </Paper>
            </Box>
        </Slide>
    );
};

const ConfirmationDialog = ({ open, onClose, onConfirm, loading }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    overflow: 'hidden',
                    animation: 'scaleUp 0.3s ease-out'
                }
            }}
        >
            <Box sx={{
                bgcolor: '#CF848A',
                p: 3,
                textAlign: 'center',
                color: 'white'
            }}>
                <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    p: 1.5,
                    mb: 2
                }}>
                    <FiDownload size={32} />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                    Save Order Summary?
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                    Would you like to save your order summary before leaving?
                </Typography>
            </Box>

            <DialogContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    You can always view your order details in your account later.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: '#CF848A',
                        color: '#CF848A',
                        '&:hover': {
                            borderColor: '#A85C68',
                            bgcolor: alpha('#CF848A', 0.05)
                        }
                    }}
                >
                    No, Thanks
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onConfirm}
                    disabled={loading}
                    sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        bgcolor: '#CF848A',
                        '&:hover': {
                            bgcolor: '#A85C68'
                        }
                    }}
                >
                    {loading ? 'Saving...' : 'Save & Return'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default function FinalMessage({
    orderNumber,
    orderDetails,
    userData,
    orderData,
    cartData,
    onFinish
}) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const orderRef = useRef(null);
    const [screenshotLoading, setScreenshotLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [copied, setCopied] = useState(false);
    const [cafesData, setCafesData] = useState([]);
    const [productImageMap, setProductImageMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [orderItems, setOrderItems] = useState([]);
    const [orderDataLoaded, setOrderDataLoaded] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('success');

    const showToast = (message, severity = 'success') => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const handleToastClose = () => {
        setToastOpen(false);
    };

    useEffect(() => {
        const fetchCafesData = async () => {
            try {
                const { data } = await axios.get(
                    "https://flowers-vert-six.vercel.app/api/cafe/display-all-cafes"
                );
                const cafesDataArray = data?.cafeData || data || [];
                setCafesData(cafesDataArray);

                const mapping = {};
                cafesDataArray.forEach(cafe => {
                    if (cafe.products && Array.isArray(cafe.products)) {
                        cafe.products.forEach(product => {
                            const key = `${product.productName}-${product.price}`;
                            mapping[key] = product.image || 'https://cdn-icons-png.flaticon.com/512/924/924514.png';
                        });
                    }
                });
                setProductImageMap(mapping);
            } catch (error) {
                console.error('Error fetching cafes data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCafesData();
    }, []);

    useEffect(() => {
        if (!loading && orderDetails) {
            processOrderItems();
        }
    }, [loading, orderDetails, productImageMap]);

    const formatDate = (dateString) => {
        if (dateString) {
            return new Date(dateString).toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short'
            });
        }
        const now = new Date();
        return now.toLocaleString('en-US', {
            dateStyle: 'full',
            timeStyle: 'short'
        });
    };

    const formatPrice = (price) => {
        return `EGP ${price?.toFixed(2) || 0}`;
    };

    const getProductImage = (productName, productPrice) => {
        const key = `${productName}-${productPrice}`;
        if (productImageMap[key]) {
            return productImageMap[key];
        }

        const lowerName = productName?.toLowerCase() || '';
        if (lowerName.includes('coffee') || lowerName.includes('latte') || lowerName.includes('espresso') || lowerName.includes('cappuccino')) {
            return 'https://cdn-icons-png.flaticon.com/512/924/924514.png';
        } else if (lowerName.includes('tea') || lowerName.includes('chai')) {
            return 'https://cdn-icons-png.flaticon.com/512/1047/1047501.png';
        } else if (lowerName.includes('juice') || lowerName.includes('smoothie')) {
            return 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png';
        } else {
            return 'https://cdn-icons-png.flaticon.com/512/924/924514.png';
        }
    };

    const orderResponseData = orderDetails?.orderResponse?.order;
    const realOrderId = orderResponseData?._id || orderDetails?.orderId || orderNumber;
    const displayOrderNumber = realOrderId ? realOrderId.slice(-6).toUpperCase() : 'N/A';
    const fullOrderId = realOrderId || 'N/A';
    const displayDate = orderDetails?.selectedDate || orderData?.selectedDate;
    const displayTimeSlot = orderDetails?.selectedTimeSlot || orderData?.selectedTimeSlot;
    const displayTotal = orderResponseData?.totalPrice || orderDetails?.totalAmount || orderData?.finalTotal || 0;
    const deliveryFee = orderData?.deliveryOption === 'delivery' ? 50 : 0;

    const processOrderItems = () => {
        const items = [];
        const addedItems = new Set();

        if (orderResponseData?.productId) {
            const product = orderResponseData.productId;
            const itemKey = `${product.name}-${product.price}`;
            if (!addedItems.has(itemKey)) {
                items.push({
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    type: 'product',
                    image: product.image || 'https://cdn-icons-png.flaticon.com/512/1047/1047501.png'
                });
                addedItems.add(itemKey);
            }
        }

        const cafeProducts = orderResponseData?.cafeProduct || [];
        if (cafeProducts.length > 0) {
            cafeProducts.forEach(product => {
                const itemKey = `${product.name}-${product.price}`;
                if (!addedItems.has(itemKey)) {
                    items.push({
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity || 1,
                        type: 'cafe',
                        image: getProductImage(product.name, product.price)
                    });
                    addedItems.add(itemKey);
                }
            });
        }

        setOrderItems(items);
        setOrderDataLoaded(true);
    };

    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal + deliveryFee;

    const copyOrderId = () => {
        navigator.clipboard.writeText(fullOrderId);
        setCopied(true);
        showToast('Order ID copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const captureScreenshot = async () => {
        if (!orderRef.current) return;

        setScreenshotLoading(true);
        try {
            const canvas = await html2canvas(orderRef.current, {
                scale: 3,
                backgroundColor: '#ffffff',
                logging: false,
                useCORS: true,
                windowWidth: orderRef.current.scrollWidth,
                windowHeight: orderRef.current.scrollHeight,
                onclone: (clonedDoc, element) => {
                    const images = clonedDoc.querySelectorAll('img');
                    return Promise.all(Array.from(images).map(img => {
                        if (img.complete) return Promise.resolve();
                        return new Promise(resolve => {
                            img.onload = resolve;
                            img.onerror = resolve;
                        });
                    }));
                }
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            link.download = `LoveActs-Order-${displayOrderNumber}.png`;
            link.href = image;
            link.click();

            showToast('Order summary saved successfully!', 'success');

            setTimeout(() => {
                setShowConfirmation(false);
                if (onFinish) {
                    onFinish();
                } else {
                    navigate('/');
                }
            }, 1500);

        } catch (error) {
            console.error('Error capturing screenshot:', error);
            showToast('Failed to save order. Please try again.', 'error');
            setScreenshotLoading(false);
        }
    };

    const handleHomeClick = () => {
        setShowConfirmation(true);
    };

    const confirmAndSave = () => {
        captureScreenshot();
    };

    const cancelAndReturn = () => {
        setShowConfirmation(false);
        if (onFinish) {
            onFinish();
        } else {
            navigate('/');
        }
    };

    const OrderSkeleton = () => (
        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ bgcolor: '#CF848A', p: { xs: 3, md: 5 }, textAlign: 'center' }}>
                <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', mb: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.3)' }} />
            </Box>

            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Skeleton variant="text" width="30%" height={20} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="50%" height={48} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="40%" height={16} sx={{ mx: 'auto' }} />
            </Box>

            <Box sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
                        {[1, 2].map((i) => (
                            <Card key={i} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Skeleton variant="rounded" width={70} height={70} />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Skeleton variant="text" width="60%" height={24} />
                                                <Skeleton variant="text" width="20%" height={24} />
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Skeleton variant="rounded" width={80} height={24} />
                                                <Skeleton variant="text" width={60} height={20} />
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                            <CardContent>
                                <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
                                {[1, 2, 3].map((i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Skeleton variant="text" width="40%" height={20} />
                                        <Skeleton variant="text" width="30%" height={20} />
                                    </Box>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      
      @keyframes progressBar {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }
      
      @keyframes scaleUp {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <>
            <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
                {loading || !orderDataLoaded ? (
                    <OrderSkeleton />
                ) : (
                    <Fade in={!loading && orderDataLoaded} timeout={500}>
                        <div>
                            <div ref={orderRef}>
                                <Paper elevation={0} sx={{
                                    borderRadius: { xs: 0, sm: 0, md: 0 },
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.3s ease'
                                }}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #CF848A 0%, #A85C68 100%)',
                                        color: 'white',
                                        p: { xs: 3, sm: 4, md: 5 },
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                                        >
                                            <Box sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                borderRadius: '50%',
                                                p: { xs: 1.5, sm: 2 },
                                                mb: 2
                                            }}>
                                                <FiCheckCircle size={isMobile ? 40 : 48} />
                                            </Box>
                                        </motion.div>
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" gutterBottom>
                                                Order Confirmed! 🎉
                                            </Typography>
                                            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                                Thank you for your order, {orderResponseData?.name || userData?.name || 'Valued Customer'}
                                            </Typography>
                                        </motion.div>
                                    </Box>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Box sx={{
                                            p: { xs: 2, sm: 3, md: 4 },
                                            textAlign: 'center',
                                            borderBottom: 1,
                                            borderColor: 'divider',
                                            bgcolor: '#FAFAFA'
                                        }}>
                                            <Typography variant="subtitle2" sx={{ color: '#CF848A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                                                Order Number
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                <Typography variant={isMobile ? "h4" : "h3"} sx={{
                                                    fontWeight: 'bold',
                                                    fontFamily: 'monospace',
                                                    letterSpacing: 2,
                                                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' }
                                                }}>
                                                    #{displayOrderNumber}
                                                </Typography>
                                                <Tooltip title={copied ? "Copied!" : "Copy order ID"}>
                                                    <IconButton onClick={copyOrderId} size="small">
                                                        {copied ? <FiCheck color="#4CAF50" /> : <FiCopy />}
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                Placed on {formatDate(orderResponseData?.createdAt || orderDetails?.createdAt)}
                                            </Typography>
                                        </Box>
                                    </motion.div>

                                    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                                        <Grid
                                            container
                                            spacing={{ xs: 2, sm: 3, md: 4 }}
                                            justifyContent="space-between"
                                        >
                                            <Grid item xs={12} md={7}>
                                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <FiShoppingBag /> Order Items
                                                </Typography>

                                                <AnimatePresence>
                                                    {orderItems.length > 0 ? (
                                                        orderItems.map((item, index) => (
                                                            <Grow
                                                                key={index}
                                                                in={true}
                                                                timeout={300 + index * 100}
                                                            >
                                                                <Card variant="outlined" sx={{
                                                                    mb: 2,
                                                                    borderRadius: 0,
                                                                    transition: 'all 0.3s ease',
                                                                    '&:hover': {
                                                                        transform: 'translateY(-4px)',
                                                                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                                                                    }
                                                                }}>
                                                                    <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                                                        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                                                                            <Avatar
                                                                                src={item.image}
                                                                                variant="rounded"
                                                                                sx={{
                                                                                    width: { xs: 60, sm: 70 },
                                                                                    height: { xs: 60, sm: 70 },
                                                                                    borderRadius: '50%',
                                                                                    mx: { xs: 'auto', sm: 0 }
                                                                                }}
                                                                            >
                                                                                {item.type === 'cafe' ? <FiCoffee /> : <FiGift />}
                                                                            </Avatar>
                                                                            <Box sx={{ flex: 1 }}>
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'space-between',
                                                                                    flexWrap: 'wrap',
                                                                                    gap: 1,
                                                                                    flexDirection: { xs: 'column', sm: 'row' }
                                                                                }}>
                                                                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                                                                        {item.name}
                                                                                    </Typography>
                                                                                    <Typography variant="h6" fontWeight="bold" color="#CF848A" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                                                                        {formatPrice(item.price * item.quantity)}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                                                    <Chip
                                                                                        label={item.type === 'cafe' ? 'Beverage' : 'Flowers'}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            bgcolor: alpha(item.type === 'cafe' ? '#CF848A' : '#4CAF50', 0.1),
                                                                                            color: item.type === 'cafe' ? '#CF848A' : '#4CAF50',
                                                                                            fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                                                                        }}
                                                                                    />
                                                                                    <Typography variant="caption" color="text.secondary">
                                                                                        Qty: {item.quantity}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grow>
                                                        ))
                                                    ) : (
                                                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                                            No items to display
                                                        </Typography>
                                                    )}
                                                </AnimatePresence>
                                            </Grid>

                                            <Grid item xs={12} md={5}>
                                                <motion.div
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <Card variant="outlined" sx={{ borderRadius: 0, mb: 3 }}>
                                                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                                Order Summary
                                                            </Typography>

                                                            <Stack spacing={1.5}>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <Typography color="text.secondary">Subtotal</Typography>
                                                                    <Typography fontWeight="500">{formatPrice(subtotal)}</Typography>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <Typography color="text.secondary">
                                                                        {orderData?.deliveryOption === 'delivery' ? 'Delivery Fee' : 'Pickup'}
                                                                    </Typography>
                                                                    <Typography fontWeight="500">
                                                                        {orderData?.deliveryOption === 'delivery' ? formatPrice(50) : 'Free'}
                                                                    </Typography>
                                                                </Box>

                                                                <Divider />

                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography variant="h6" fontWeight="bold">Total</Typography>
                                                                    <Typography variant="h5" fontWeight="bold" color="#CF848A" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                                                        {formatPrice(finalTotal)}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>

                                                    <Card variant="outlined" sx={{ borderRadius: 0 }}>
                                                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                                Delivery Details
                                                            </Typography>

                                                            <Stack spacing={2}>
                                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                                    <Avatar sx={{ bgcolor: alpha('#CF848A', 0.1), width: 36, height: 36 }}>
                                                                        <FiUser size={18} color="#CF848A" />
                                                                    </Avatar>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography variant="caption" color="text.secondary" display="block">Name</Typography>
                                                                        <Typography variant="body2" fontWeight="500">{orderResponseData?.name || userData?.name || 'Not provided'}</Typography>
                                                                    </Box>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                                    <Avatar sx={{ bgcolor: alpha('#CF848A', 0.1), width: 36, height: 36 }}>
                                                                        <FiPhone size={18} color="#CF848A" />
                                                                    </Avatar>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography variant="caption" color="text.secondary" display="block">Phone</Typography>
                                                                        <Typography variant="body2" fontWeight="500">{orderResponseData?.phone || userData?.phone || 'Not provided'}</Typography>
                                                                    </Box>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                                    <Avatar sx={{ bgcolor: alpha('#CF848A', 0.1), width: 36, height: 36 }}>
                                                                        {orderData?.deliveryOption === 'delivery' ? <FiTruck size={18} /> : <FiMapPin size={18} />}
                                                                    </Avatar>
                                                                    <Box sx={{ flex: 1 }}>
                                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                                            {orderData?.deliveryOption === 'delivery' ? 'Delivery Address' : 'Pickup Location'}
                                                                        </Typography>
                                                                        <Typography variant="body2" fontWeight="500">
                                                                            {orderData?.deliveryOption === 'delivery'
                                                                                ? `${orderResponseData?.address?.street || userData?.street || 'Your address'}, ${orderResponseData?.address?.city || userData?.city || ''}`
                                                                                : 'LoveActs Coffee Shop, Downtown'
                                                                            }
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>

                                                                {(displayDate || displayTimeSlot) && (
                                                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                                                        <Avatar sx={{ bgcolor: alpha('#CF848A', 0.1), width: 36, height: 36 }}>
                                                                            <FiCalendar size={18} color="#CF848A" />
                                                                        </Avatar>
                                                                        <Box sx={{ flex: 1 }}>
                                                                            <Typography variant="caption" color="text.secondary" display="block">
                                                                                {orderData?.deliveryOption === 'delivery' ? 'Delivery Time' : 'Pickup Time'}
                                                                            </Typography>
                                                                            <Typography variant="body2" fontWeight="500">
                                                                                {displayDate && `${displayDate} `}
                                                                                {displayTimeSlot && `at ${displayTimeSlot}`}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                )}
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>

                                                    <Zoom in={true} timeout={500}>
                                                        <Card variant="outlined" sx={{ borderRadius: 2, mt: 3, bgcolor: '#F5F5F5' }}>
                                                            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
                                                                    <FiHeart color="#CF848A" size={24} />
                                                                    <Box>
                                                                        <Typography variant="body2" fontWeight="500">
                                                                            Need help with your order?
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            Contact us on WhatsApp: +20 XXX XXX XXX
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Zoom>
                                                </motion.div>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </div>
                        </div>
                    </Fade>
                )}

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: { xs: 1.5, sm: 2 },
                    mt: { xs: 3, sm: 4 },
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Button
                        variant="contained"
                        size={isMobile ? "medium" : "large"}
                        onClick={handleHomeClick}
                        startIcon={<FiHome />}
                        disabled={screenshotLoading || loading}
                        fullWidth={isMobile}
                        sx={{
                            px: { xs: 3, sm: 4 },
                            py: { xs: 1, sm: 1.5 },
                            borderRadius: 0,
                            textTransform: 'none',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            fontWeight: 600,
                            backgroundColor: '#CF848A',
                            '&:hover': {
                                backgroundColor: '#A85C68',
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Return to Home
                    </Button>

                    <Button
                        variant="outlined"
                        size={isMobile ? "medium" : "large"}
                        onClick={captureScreenshot}
                        startIcon={screenshotLoading ? <FiClock /> : <FiDownload />}
                        disabled={screenshotLoading || loading}
                        fullWidth={isMobile}
                        sx={{
                            px: { xs: 3, sm: 4 },
                            py: { xs: 1, sm: 1.5 },
                            borderRadius: 0,
                            textTransform: 'none',
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            fontWeight: 600,
                            borderColor: '#CF848A',
                            color: '#CF848A',
                            '&:hover': {
                                borderColor: '#A85C68',
                                backgroundColor: alpha('#CF848A', 0.05),
                                transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {screenshotLoading ? 'Saving...' : 'Save Order Summary'}
                    </Button>
                </Box>
            </Container>

            <ConfirmationDialog
                open={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={confirmAndSave}
                loading={screenshotLoading}
            />

            <CustomToast
                open={toastOpen}
                message={toastMessage}
                severity={toastSeverity}
                onClose={handleToastClose}
            />
        </>
    );
}
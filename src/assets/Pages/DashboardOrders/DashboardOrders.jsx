import React, { useState } from "react";
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

// Component to display order details
const OrderDetailsDialog = ({ order, open, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Order Details #{order._id.slice(-6).toUpperCase()}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">User</Typography>
            <Typography variant="body1">{order.user?.name || "Unknown"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Email</Typography>
            <Typography variant="body1">{order.user?.email || "Unknown"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Status</Typography>
            <Chip 
              label={order.status} 
              color={getStatusColor(order.status)} 
              sx={{ mt: 0.5 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Total</Typography>
            <Typography variant="body1">${order.totalPrice || 0}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">Created At</Typography>
            <Typography variant="body1">
              {new Date(order.createdAt).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>
              Products
            </Typography>
            {order.products?.map((product, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box
                  component="img"
                  src={product.image || "/placeholder-image.jpg"}
                  alt={product.name}
                  sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Quantity: {product.quantity} | Price: ${product.price}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper function to get status color
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
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Card 
                className="rounded-xl"
                sx={{ 
                  boxShadow: theme.shadows[3],
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewDetails(order)}
                      color="info"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    User: {order.user?.name || "Unknown"}
                  </Typography>
                  
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Total: ${order.totalPrice || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status)} 
                      size="small"
                      sx={{ minWidth: 80 }}
                    />
                    <Select 
                      size="small" 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ overflowX: 'auto', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.1) : theme.palette.primary.light }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow 
                  key={order._id}
                  sx={{ 
                    '&:hover': {
                      bgcolor: theme.palette.mode === 'dark' 
                        ? alpha(theme.palette.primary.main, 0.03) 
                        : alpha(theme.palette.primary.main, 0.02),
                    }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>
                    #{order._id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>{order.userId?.name || "Unknown"}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      color={getStatusColor(order.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${order.totalPrice || 0}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleViewDetails(order)}
                        color="info"
                        sx={{ 
                          border: `1px solid ${theme.palette.info.main}`, 
                          borderRadius: 1 
                        }}
                      >
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <Select
                        size="small"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <OrderDetailsDialog 
        order={selectedOrder} 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
      />
    </Paper>
  );
}
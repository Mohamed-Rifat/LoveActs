'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    LocalCafe as CafeIcon,
    ShoppingBag as ProductsIcon,
    People as UsersIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
    CheckCircle as ActiveIcon,
    Star as StarIcon,
    Schedule as NewIcon,
    Add as AddIcon,
    Edit as EditIcon,
    TrendingUp as TrendingUpIcon,
    Inventory as InventoryIcon,
    Category as CategoryIcon,
    ShoppingCart as OrdersIcon,
    Pending as PendingIcon,
    CheckCircle as CompletedIcon,
    Cancel as CancelledIcon,
    Autorenew as ProcessingIcon
} from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import DashboardCafes from '../DashboardCafes/DashboardCafes';
import DashboardProducts from '../DashboardProducts/DashboardProducts';
import DashboardOrders from '../DashboardOrders/DashboardOrders';
import { useToken } from '../../Context/TokenContext/TokenContext';

const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api';

const AdminDashboard = () => {
    const { token, user, removeToken } = useToken();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats] = useState({
        totalCafes: 0,
        activeCafes: 0,
        featuredCafes: 0,
        newCafesThisWeek: 0,
        totalProducts: 0,
        activeProducts: 0,
        outOfStockProducts: 0,
        newProductsThisWeek: 0,
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);

    const api = useMemo(() => {
        return axios.create({
            baseURL: API_BASE_URL,
            headers: token ? { 'Authorization': `Admin ${token}` } : {}
        });
    }, [token]);

    useEffect(() => {
        if (activeSection === 'dashboard' && token) {
            fetchDashboardData();
        }
    }, [activeSection, token]);

    const fetchDashboardData = async () => {
        if (!token) {
            console.error('No token available');
            return;
        }

        try {
            setLoading(true);

            const cafesResponse = await api.get('/cafe/display-all-cafes');
            const cafesData = cafesResponse.data.cafeData || [];

            const productsResponse = await api.get('/product/');
            const productsData = productsResponse.data || [];

            const ordersResponse = await api.get('/order/admin/orders');
            const ordersData = ordersResponse.data.orders || [];

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const newCafesThisWeek = cafesData.filter(cafe => {
                const cafeDate = new Date(cafe.createdAt || cafe.dateAdded);
                return cafeDate >= oneWeekAgo;
            }).length;

            const newProductsThisWeek = productsData.filter(product => {
                const productDate = new Date(product.createdAt || product.dateAdded);
                return productDate >= oneWeekAgo;
            }).length;

            const pendingOrders = ordersData.filter(order => order.status === 'pending').length;
            const processingOrders = ordersData.filter(order => order.status === 'processing').length;
            const completedOrders = ordersData.filter(order => order.status === 'delivered').length;
            const cancelledOrders = ordersData.filter(order => order.status === 'cancelled').length;

            setStats({
                totalCafes: cafesData.length,
                activeCafes: cafesData.filter(cafe => !cafe.isDeleted).length,
                featuredCafes: cafesData.filter(cafe => cafe.isFeatured).length,
                newCafesThisWeek: newCafesThisWeek,
                totalProducts: productsData.length,
                activeProducts: productsData.filter(product => !product.isDeleted).length,
                outOfStockProducts: productsData.filter(product => product.stock === 0).length,
                newProductsThisWeek: newProductsThisWeek,
                totalOrders: ordersData.length,
                pendingOrders: pendingOrders,
                processingOrders: processingOrders,
                completedOrders: completedOrders,
                cancelledOrders: cancelledOrders
            });

            prepareChartData(cafesData, productsData, ordersData);
            prepareOrderStatusData(ordersData);

            const activities = [];

            if (cafesData.length > 0) {
                const latestCafe = cafesData[cafesData.length - 1];
                activities.push({
                    type: 'add',
                    description: `Added new cafe "${latestCafe.name}"`,
                    timestamp: new Date(latestCafe.createdAt || latestCafe.dateAdded || Date.now())
                });

                const featuredCafe = cafesData.find(cafe => cafe.isFeatured);
                if (featuredCafe) {
                    activities.push({
                        type: 'feature',
                        description: `Featured "${featuredCafe.name}" cafe`,
                        timestamp: new Date(featuredCafe.updatedAt || Date.now() - 3 * 24 * 60 * 60 * 1000)
                    });
                }
            }

            if (productsData.length > 0) {
                const latestProduct = productsData[productsData.length - 1];
                activities.push({
                    type: 'add',
                    description: `Added new product "${latestProduct.name}"`,
                    timestamp: new Date(latestProduct.createdAt || latestProduct.dateAdded || Date.now())
                });
            }

            if (ordersData.length > 0) {
                const latestOrder = ordersData[ordersData.length - 1];
                activities.push({
                    type: 'order',
                    description: `New order #${latestOrder._id.slice(-6).toUpperCase()}`,
                    timestamp: new Date(latestOrder.createdAt || Date.now())
                });

                const pendingOrder = ordersData.find(order => order.status === 'pending');
                if (pendingOrder) {
                    activities.push({
                        type: 'pending',
                        description: `Pending order needs attention`,
                        timestamp: new Date(pendingOrder.createdAt || Date.now() - 2 * 60 * 60 * 1000)
                    });
                }

                const processingOrder = ordersData.find(order => order.status === 'processing');
                if (processingOrder) {
                    activities.push({
                        type: 'processing',
                        description: `Order in processing`,
                        timestamp: new Date(processingOrder.updatedAt || Date.now() - 1 * 60 * 60 * 1000)
                    });
                }
            }

            activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setRecentActivities(activities.slice(0, 4));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const prepareChartData = (cafesData, productsData, ordersData) => {
        const monthlyData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date();
            monthDate.setMonth(currentDate.getMonth() - i);
            const monthName = months[monthDate.getMonth()];

            const cafesThisMonth = cafesData.filter(cafe => {
                const cafeDate = new Date(cafe.createdAt || cafe.dateAdded);
                return cafeDate.getMonth() === monthDate.getMonth() &&
                    cafeDate.getFullYear() === monthDate.getFullYear();
            }).length;

            const productsThisMonth = productsData.filter(product => {
                const productDate = new Date(product.createdAt || product.dateAdded);
                return productDate.getMonth() === monthDate.getMonth() &&
                    productDate.getFullYear() === monthDate.getFullYear();
            }).length;

            const ordersThisMonth = ordersData.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getMonth() === monthDate.getMonth() &&
                    orderDate.getFullYear() === monthDate.getFullYear();
            }).length;

            monthlyData.push({
                name: monthName,
                cafes: cafesThisMonth,
                products: productsThisMonth,
                orders: ordersThisMonth
            });
        }

        const categoryMap = {};
        productsData.forEach(product => {
            const category = product.category || 'Uncategorized';
            categoryMap[category] = (categoryMap[category] || 0) + 1;
        });

        const categoryDistribution = Object.keys(categoryMap).map(category => ({
            name: category,
            value: categoryMap[category]
        }));

        const trendData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 6; i >= 0; i--) {
            const dayDate = new Date();
            dayDate.setDate(dayDate.getDate() - i);
            const dayName = days[dayDate.getDay()];

            const cafesThisDay = cafesData.filter(cafe => {
                const cafeDate = new Date(cafe.createdAt || cafe.dateAdded);
                return cafeDate.getDate() === dayDate.getDate() &&
                    cafeDate.getMonth() === dayDate.getMonth() &&
                    cafeDate.getFullYear() === dayDate.getFullYear();
            }).length;

            const productsThisDay = productsData.filter(product => {
                const productDate = new Date(product.createdAt || product.dateAdded);
                return productDate.getDate() === dayDate.getDate() &&
                    productDate.getMonth() === dayDate.getMonth() &&
                    productDate.getFullYear() === dayDate.getFullYear();
            }).length;

            const ordersThisDay = ordersData.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate.getDate() === dayDate.getDate() &&
                    orderDate.getMonth() === dayDate.getMonth() &&
                    orderDate.getFullYear() === dayDate.getFullYear();
            }).length;

            trendData.push({
                day: dayName,
                cafes: cafesThisDay,
                products: productsThisDay,
                orders: ordersThisDay
            });
        }

        setChartData(monthlyData);
        setCategoryData(categoryDistribution);
        setTrendData(trendData);
    };

    const prepareOrderStatusData = (ordersData) => {
        const statusCount = {
            pending: ordersData.filter(order => order.status === 'pending').length,
            processing: ordersData.filter(order => order.status === 'processing').length,
            delivered: ordersData.filter(order => order.status === 'delivered').length,
            cancelled: ordersData.filter(order => order.status === 'cancelled').length
        };

        const statusData = [
            { name: 'Pending', value: statusCount.pending, color: '#FF8042' },
            { name: 'Processing', value: statusCount.processing, color: '#0088FE' },
            { name: 'Delivered', value: statusCount.delivered, color: '#00C49F' },
            { name: 'Cancelled', value: statusCount.cancelled, color: '#FF0000' }
        ];

        setOrderStatusData(statusData);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const closeMobileMenu = () => {
        if (mobileOpen) {
            setMobileOpen(false);
        }
    };

    const handleAddNewCafe = () => {
        setActiveSection('cafes');
    };

    const handleAddNewProduct = () => {
        setActiveSection('products');
    };

    const handleViewAllCafes = () => {
        setActiveSection('cafes');
    };

    const handleViewAllProducts = () => {
        setActiveSection('products');
    };

    const handleViewAllOrders = () => {
        setActiveSection('orders');
    };

    const handleLogout = () => {
        removeToken();
        // toast.success("Goodbye! Admin 👋", { duration: 4000 });
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'cafes':
                return <DashboardCafes />;
            case 'products':
                return <DashboardProducts />;
            case 'orders':
                return <DashboardOrders />;
            default:
                return (
                    <div className="p-6">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Total Cafes</h3>
                                                <p className="text-2xl font-bold mt-2 text-amber-600">{stats.totalCafes}</p>
                                            </div>
                                            <div className="p-3 bg-amber-100 rounded-lg">
                                                <CafeIcon className="text-amber-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">Total registered cafes</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Active Cafes</h3>
                                                <p className="text-2xl font-bold mt-2 text-green-600">{stats.activeCafes}</p>
                                            </div>
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <ActiveIcon className="text-green-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">Currently active cafes</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                                                <p className="text-2xl font-bold mt-2 text-blue-600">{stats.totalProducts}</p>
                                            </div>
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <InventoryIcon className="text-blue-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">Total products in system</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                                                <p className="text-2xl font-bold mt-2 text-purple-600">{stats.totalOrders}</p>
                                            </div>
                                            <div className="p-3 bg-purple-100 rounded-lg">
                                                <OrdersIcon className="text-purple-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">All time orders</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Pending Orders</h3>
                                                <p className="text-2xl font-bold mt-2 text-orange-600">{stats.pendingOrders}</p>
                                            </div>
                                            <div className="p-3 bg-orange-100 rounded-lg">
                                                <PendingIcon className="text-orange-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">Orders awaiting processing</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Processing Orders</h3>
                                                <p className="text-2xl font-bold mt-2 text-blue-600">{stats.processingOrders}</p>
                                            </div>
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <ProcessingIcon className="text-blue-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">Orders in progress</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Completed Orders</h3>
                                                <p className="text-2xl font-bold mt-2 text-green-600">{stats.completedOrders}</p>
                                            </div>
                                            <div className="p-3 bg-green-100 rounded-lg">
                                                <CompletedIcon className="text-green-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">Successfully delivered orders</p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-700">Cancelled Orders</h3>
                                                <p className="text-2xl font-bold mt-2 text-red-600">{stats.cancelledOrders}</p>
                                            </div>
                                            <div className="p-3 bg-red-100 rounded-lg">
                                                <CancelledIcon className="text-red-600" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-4">Cancelled orders</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                            <TrendingUpIcon className="mr-2 text-blue-500" />
                                            Monthly Growth
                                        </h3>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="cafes" fill="#F59E0B" name="Cafes" />
                                                    <Bar dataKey="products" fill="#3B82F6" name="Products" />
                                                    <Bar dataKey="orders" fill="#8B5CF6" name="Orders" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Status Distribution</h3>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={orderStatusData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {orderStatusData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Weekly Trends</h3>
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={trendData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="day" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Line type="monotone" dataKey="cafes" stroke="#F59E0B" strokeWidth={2} activeDot={{ r: 8 }} />
                                                    <Line type="monotone" dataKey="products" stroke="#3B82F6" strokeWidth={2} />
                                                    <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
                                                onClick={handleAddNewCafe}
                                            >
                                                <div className="p-3 bg-amber-100 rounded-full mb-2">
                                                    <AddIcon className="text-amber-600" />
                                                </div>
                                                <span className="text-amber-700 font-medium">Add New Cafe</span>
                                            </button>
                                            <button
                                                className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                                onClick={handleViewAllCafes}
                                            >
                                                <div className="p-3 bg-blue-100 rounded-full mb-2">
                                                    <CafeIcon className="text-blue-600" />
                                                </div>
                                                <span className="text-blue-700 font-medium">View All Cafes</span>
                                            </button>
                                            <button
                                                className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
                                                onClick={handleAddNewProduct}
                                            >
                                                <div className="p-3 bg-green-100 rounded-full mb-2">
                                                    <AddIcon className="text-green-600" />
                                                </div>
                                                <span className="text-green-700 font-medium">Add New Product</span>
                                            </button>
                                            <button
                                                className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
                                                onClick={handleViewAllProducts}
                                            >
                                                <div className="p-3 bg-purple-100 rounded-full mb-2">
                                                    <ProductsIcon className="text-purple-600" />
                                                </div>
                                                <span className="text-purple-700 font-medium">View All Products</span>
                                            </button>
                                            <button
                                                className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                                                onClick={handleViewAllOrders}
                                            >
                                                <div className="p-3 bg-indigo-100 rounded-full mb-2">
                                                    <OrdersIcon className="text-indigo-600" />
                                                </div>
                                                <span className="text-indigo-700 font-medium">View All Orders</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 md:col-span-2">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
                                        <div className="space-y-4">
                                            {recentActivities.length > 0 ? (
                                                recentActivities.map((activity, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <div className={`p-2 ${getActivityColor(activity.type).bg} rounded-full mr-4`}>
                                                            {getActivityIcon(activity.type)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{activity.description}</p>
                                                            <p className="text-sm text-gray-500">{formatDate(activity.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No recent activities</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'edit':
                return <EditIcon className="text-green-600 text-sm" />;
            case 'add':
                return <AddIcon className="text-amber-600 text-sm" />;
            case 'feature':
                return <StarIcon className="text-blue-600 text-sm" />;
            case 'order':
                return <OrdersIcon className="text-purple-600 text-sm" />;
            case 'pending':
                return <PendingIcon className="text-orange-600 text-sm" />;
            case 'processing':
                return <ProcessingIcon className="text-blue-600 text-sm" />;
            default:
                return <EditIcon className="text-gray-600 text-sm" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'edit':
                return { bg: 'bg-green-100', text: 'text-green-600' };
            case 'add':
                return { bg: 'bg-amber-100', text: 'text-amber-600' };
            case 'feature':
                return { bg: 'bg-blue-100', text: 'text-blue-600' };
            case 'order':
                return { bg: 'bg-purple-100', text: 'text-purple-600' };
            case 'pending':
                return { bg: 'bg-orange-100', text: 'text-orange-600' };
            case 'processing':
                return { bg: 'bg-blue-100', text: 'text-blue-600' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-600' };
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hours ago`;
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US');
        }
    };

    const drawerItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'cafes', text: 'Cafes', icon: <CafeIcon /> },
        { id: 'products', text: 'Products', icon: <ProductsIcon /> },
        { id: 'orders', text: 'Users Orders', icon: <UsersIcon /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={handleDrawerToggle}
                ></div>
            )}

            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                } md:relative md:translate-x-0`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-start h-16 px-4 bg-white border-b border-gray-200">
                        <img className="h-10 w-auto mr-2" src="./Logo.PNG" alt="Love Acts Logo" />
                        <h2 className="text-xl font-bold text-gray-800">Love Acts</h2>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul>
                            {drawerItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`px-4 py-3 mx-2 rounded-md flex items-center cursor-pointer transition-colors ${activeSection === item.id
                                        ? 'bg-amber-100 text-amber-800 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        closeMobileMenu();
                                    }}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <button
                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            onClick={handleLogout}
                        >
                            <LogoutIcon className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {drawerItems.find(item => item.id === activeSection)?.text || 'Dashboard'}
                        </h1>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Welcome, {user?.name || 'Admin'}</span>
                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <span className="text-amber-700 font-medium">{user?.name?.[0] || 'A'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
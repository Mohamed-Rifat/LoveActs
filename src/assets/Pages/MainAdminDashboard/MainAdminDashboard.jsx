'use client';
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Main Sections/Sidebar';
import Header from './Main Sections/Header';
import SectionOne from './Main Sections/SectionOne';
import SectionTwo from './Main Sections/SectionTwo';
import SectionThree from './Main Sections/SectionThree';
import SectionFour from './Main Sections/SectionFour';
import DashboardCafes from '../DashboardCafes/DashboardCafes';
import DashboardProducts from '../DashboardProducts/DashboardProducts';
import DashboardOrders from '../DashboardOrders/DashboardOrders';
import { useToken } from '../../Context/TokenContext/TokenContext';
import axios from 'axios';

const API_BASE_URL = 'https://flowers-vert-six.vercel.app/api';

const MainAdminDashboard = () => {
    const { token, user } = useToken();
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
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [trendData, setTrendData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    const apiRef = useRef(null);
    const lastFetchTimeRef = useRef(0);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (token && !apiRef.current) {
            apiRef.current = axios.create({
                baseURL: API_BASE_URL,
                headers: { 'Authorization': `Admin ${token}` }
            });
        }
    }, [token]);

    const fetchDashboardData = async (force = false) => {
        if (!token || !apiRef.current) return;

        const now = Date.now();
        const timeSinceLastFetch = now - lastFetchTimeRef.current;

        if (!force && timeSinceLastFetch < 30000 && hasLoaded) return;

        try {
            setLoading(true);
            lastFetchTimeRef.current = now;

            const [cafesResponse, productsResponse, ordersResponse] = await Promise.all([
                apiRef.current.get('/cafe/display-all-cafes'),
                apiRef.current.get('/product/'),
                apiRef.current.get('/order/admin/orders')
            ]);

            const cafesData = cafesResponse.data.cafeData || [];
            const productsData = productsResponse.data || [];
            const ordersData = ordersResponse.data.orders || [];

            processData(cafesData, productsData, ordersData);
            setHasLoaded(true);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processData = (cafesData, productsData, ordersData) => {
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
            newCafesThisWeek,
            totalProducts: productsData.length,
            activeProducts: productsData.filter(product => !product.isDeleted).length,
            outOfStockProducts: productsData.filter(product => product.stock === 0).length,
            newProductsThisWeek,
            totalOrders: ordersData.length,
            pendingOrders,
            processingOrders,
            completedOrders,
            cancelledOrders
        });

        prepareChartData(cafesData, productsData, ordersData);
        prepareOrderStatusData(ordersData);
        prepareRecentActivities(cafesData, productsData, ordersData);
    };

    const prepareChartData = (cafesData, productsData, ordersData) => {
        const monthlyData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();

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

    const prepareRecentActivities = (cafesData, productsData, ordersData) => {
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
                description: `New order #${latestOrder._id?.slice(-6)?.toUpperCase() || 'N/A'}`,
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
        }

        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentActivities(activities.slice(0, 4));
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (mobileOpen) setMobileOpen(false);

        if (section === 'dashboard' && !hasLoaded) {
            setTimeout(() => {
                fetchDashboardData();
            }, 100);
        }
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
                        {!hasLoaded && loading ? (
                            <div className="flex justify-center items-center h-96">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                            </div>
                        ) : (
                            <>
                                <SectionOne stats={stats} onRefresh={fetchDashboardData} loading={loading} />
                                <SectionFour stats={stats} />
                                <SectionTwo
                                    chartData={chartData}
                                    orderStatusData={orderStatusData}
                                    trendData={trendData}
                                />
                                <SectionThree
                                    recentActivities={recentActivities}
                                    onViewAllCafes={() => handleSectionChange('cafes')}
                                    onViewAllProducts={() => handleSectionChange('products')}
                                    onViewAllOrders={() => handleSectionChange('orders')}
                                    onAddNewCafe={() => handleSectionChange('cafes')}
                                    onAddNewProduct={() => handleSectionChange('products')}
                                />

                            </>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                mobileOpen={mobileOpen}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
                onCloseMobileMenu={() => setMobileOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    mobileOpen={mobileOpen}
                    onDrawerToggle={handleDrawerToggle}
                    activeSection={activeSection}
                    user={user}
                    onRefresh={fetchDashboardData}
                    loading={loading}
                />

                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default MainAdminDashboard;
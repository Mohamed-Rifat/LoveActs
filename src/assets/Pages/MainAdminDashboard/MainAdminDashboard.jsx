'use client';
import React, { useState } from 'react';
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
    Edit as EditIcon
} from '@mui/icons-material';
import DashboardCafes from '../DashboardCafes/DashboardCafes';
import DashboardProducts from '../DashboardProducts/DashboardProducts';

const AdminDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const closeMobileMenu = () => {
        if (mobileOpen) {
            setMobileOpen(false);
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'cafes':
                return <DashboardCafes />;
            case 'products':
                return <DashboardProducts/>;
            case 'users':
                return <div className="p-4"> Under Coding</div>;
            case 'settings':
                return <div className="p-4"> Under Coding </div>;
            default:
                return (
                    <div className="p-6 ">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">Total Cafes</h3>
                                        <p className="text-2xl font-bold mt-2 text-amber-600">24</p>
                                    </div>
                                    <div className="p-3 bg-amber-100 rounded-lg">
                                        <CafeIcon className="text-amber-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">إجمالي عدد المقاهي المسجلة</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">Active Cafes</h3>
                                        <p className="text-2xl font-bold mt-2 text-green-600">18</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <ActiveIcon className="text-green-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">المقاهي النشطة حالياً</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">Featured</h3>
                                        <p className="text-2xl font-bold mt-2 text-blue-600">5</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <StarIcon className="text-blue-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">المقاهي المميزة</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700">New This Week</h3>
                                        <p className="text-2xl font-bold mt-2 text-purple-600">3</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <NewIcon className="text-purple-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">المقاهي المضافة هذا الأسبوع</p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition">
                                        <span className="text-amber-700">Add New Cafe</span>
                                        <AddIcon className="text-amber-600" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                                        <span className="text-blue-700">View All Cafes</span>
                                        <CafeIcon className="text-blue-600" />
                                    </button>
                                    <button className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition">
                                        <span className="text-green-700">Manage Users</span>
                                        <UsersIcon className="text-green-600" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">إجراءات سريعة للتحكم في النظام</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 md:col-span-2">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="p-2 bg-green-100 rounded-full mr-4">
                                            <EditIcon className="text-green-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Updated "Central Perk" cafe details</p>
                                            <p className="text-sm text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="p-2 bg-amber-100 rounded-full mr-4">
                                            <AddIcon className="text-amber-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Added new cafe "Coffee Lab"</p>
                                            <p className="text-sm text-gray-500">1 day ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="p-2 bg-blue-100 rounded-full mr-4">
                                            <StarIcon className="text-blue-600 text-sm" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Featured "Brew & Bites" cafe</p>
                                            <p className="text-sm text-gray-500">3 days ago</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-4">أحدث الأنشطة على النظام</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const drawerItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'cafes', text: 'Cafes', icon: <CafeIcon /> },
        { id: 'products', text: 'Products', icon: <ProductsIcon /> },
        { id: 'users', text: 'Users', icon: <UsersIcon /> },
        { id: 'settings', text: 'Settings', icon: <SettingsIcon /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-100 md:hidden "
                    onClick={handleDrawerToggle}
                ></div>
            )}

            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-start h-16 px-4 bg-red-200 text-gray-500">
                        <img className="h-10 w-auto mr-2 pr-2" src="./Logo.PNG" alt="Love Acts Logo" />
                        <h2 className="text-xl font-bold">Love Acts</h2>
                    </div>
                    <div className="border-b border-gray-200"></div>
                    <nav className="flex-1 overflow-y-auto">
                        <ul className="py-4">
                            {drawerItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`px-4 py-3 mx-2 rounded-md flex items-center cursor-pointer ${
                                        activeSection === item.id ? 'bg-amber-100 text-amber-800' : 'text-gray-700 hover:bg-gray-100'
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
                            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/login';
                            }}
                        >
                            <LogoutIcon className="mr-3" />
                            LogOut
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between h-16 px-4">
                        <button
                            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {drawerItems.find(item => item.id === activeSection)?.text || 'Dashboard'}
                        </h1>
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
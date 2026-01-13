import React from 'react';
import {
    Dashboard as DashboardIcon,
    LocalCafe as CafeIcon,
    ShoppingBag as ProductsIcon,
    People as UsersIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useToken } from '../../../Context/TokenContext/TokenContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ mobileOpen, activeSection, onSectionChange, onCloseMobileMenu }) => {
    const { removeToken } = useToken();
    const navigate = useNavigate();

    const drawerItems = [
        { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'cafes', text: 'Cafes', icon: <CafeIcon /> },
        { id: 'products', text: 'Products', icon: <ProductsIcon /> },
        { id: 'orders', text: 'Users Orders', icon: <UsersIcon /> },
    ];

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
                    onClick={onCloseMobileMenu}
                ></div>
            )}

            <div className={`fixed md:sticky top-0 left-0 z-50 w-64 h-screen bg-white shadow-xl transition-transform duration-300 ease-out ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}>
                <div className="sticky top-0 flex flex-col h-full">
                    <div className="z-10 bg-white border-b border-gray-200 shrink-0">
                        <div className="flex items-center h-16 px-4">
                            <img className="h-10 w-auto mr-2" src="./Logo.PNG" alt="Love Acts Logo" />
                            <h2 className="text-xl font-bold text-gray-800">Love Acts</h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4 min-h-0">
                        <nav className="px-2">
                            <ul className="space-y-1">
                                {drawerItems.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                                                activeSection === item.id
                                                    ? 'bg-amber-100 text-amber-800 font-semibold shadow-sm'
                                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                            onClick={() => onSectionChange(item.id)}
                                        >
                                            <span className={`mr-3 ${
                                                activeSection === item.id ? 'text-amber-600' : 'text-gray-500'
                                            }`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-sm">{item.text}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="sticky bottom-0 bg-white border-t border-gray-200 shrink-0">
                        <div className="p-4">
                            <button
                                className="flex items-center justify-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                                onClick={handleLogout}
                            >
                                <LogoutIcon className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
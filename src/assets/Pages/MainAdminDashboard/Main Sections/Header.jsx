import React from 'react';
import { Menu as MenuIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const Header = ({ mobileOpen, onDrawerToggle, activeSection, user, onRefresh, loading }) => {
    const drawerItems = [
        { id: 'dashboard', text: 'Dashboard' },
        { id: 'cafes', text: 'Cafes' },
        { id: 'products', text: 'Products' },
        { id: 'orders', text: 'Users Orders' },
    ];

    return (
        <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between h-16 px-4">
                <button
                    className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
                    onClick={onDrawerToggle}
                >
                    <MenuIcon />
                </button>
                
                <h1 className="text-xl font-semibold text-gray-800">
                    {drawerItems.find(item => item.id === activeSection)?.text || 'Dashboard'}
                </h1>
                
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2 hidden md:inline">
                            Welcome, {user?.name || 'Admin'}
                        </span>
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-amber-700 font-medium">{user?.name?.[0] || 'A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
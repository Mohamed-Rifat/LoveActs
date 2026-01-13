import React from 'react';
import { 
    LocalCafe as CafeIcon,
    CheckCircle as ActiveIcon,
    Inventory as InventoryIcon,
    ShoppingCart as OrdersIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';

const SectionOne = ({ stats, onRefresh, loading }) => {
    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h2>
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-sm"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Refreshing...
                        </>
                    ) : (
                        <>
                            <RefreshIcon className="mr-2 text-sm" />
                            Refresh Data
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Cafes" 
                    value={stats.totalCafes} 
                    icon={<CafeIcon className="text-amber-600" />}
                    color="amber"
                    description="Total registered cafes"
                />
                <StatCard 
                    title="Active Cafes" 
                    value={stats.activeCafes} 
                    icon={<ActiveIcon className="text-green-600" />}
                    color="green"
                    description="Currently active cafes"
                />
                <StatCard 
                    title="Total Products" 
                    value={stats.totalProducts} 
                    icon={<InventoryIcon className="text-blue-600" />}
                    color="blue"
                    description="Total products in system"
                />
                <StatCard 
                    title="Total Orders" 
                    value={stats.totalOrders} 
                    icon={<OrdersIcon className="text-purple-600" />}
                    color="purple"
                    description="All time orders"
                />
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color, description }) => {
    const colorClasses = {
        amber: 'bg-amber-100 text-amber-600',
        green: 'bg-green-100 text-green-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        red: 'bg-red-100 text-red-600',
        orange: 'bg-orange-100 text-orange-600'
    };

    const textColors = {
        amber: 'text-amber-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        red: 'text-red-600',
        orange: 'text-orange-600'
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    <p className={`text-2xl font-bold mt-2 ${textColors[color]}`}>{value}</p>
                </div>
                <div className={`p-3 ${colorClasses[color]} rounded-lg`}>
                    {icon}
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">{description}</p>
        </div>
    );
};

export default SectionOne;
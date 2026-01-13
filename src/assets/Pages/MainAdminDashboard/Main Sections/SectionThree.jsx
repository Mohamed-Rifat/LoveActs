import React from 'react';
import { 
    Add as AddIcon,
    LocalCafe as CafeIcon,
    ShoppingBag as ProductsIcon,
    ShoppingCart as OrdersIcon,
    Edit as EditIcon,
    Star as StarIcon,
    Pending as PendingIcon,
    Autorenew as ProcessingIcon
} from '@mui/icons-material';

const SectionThree = ({ 
    recentActivities, 
    onViewAllCafes, 
    onViewAllProducts, 
    onViewAllOrders,
    onAddNewCafe,
    onAddNewProduct 
}) => {
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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickActionButton
                        icon={<AddIcon className="text-amber-600" />}
                        label="Add New Cafe"
                        color="amber"
                        onClick={onAddNewCafe}
                    />
                    <QuickActionButton
                        icon={<CafeIcon className="text-blue-600" />}
                        label="View All Cafes"
                        color="blue"
                        onClick={onViewAllCafes}
                    />
                    <QuickActionButton
                        icon={<AddIcon className="text-green-600" />}
                        label="Add New Product"
                        color="green"
                        onClick={onAddNewProduct}
                    />
                    <QuickActionButton
                        icon={<ProductsIcon className="text-purple-600" />}
                        label="View All Products"
                        color="purple"
                        onClick={onViewAllProducts}
                    />
                    <QuickActionButton
                        icon={<OrdersIcon className="text-indigo-600" />}
                        label="View All Orders"
                        color="indigo"
                        onClick={onViewAllOrders}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
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
    );
};

const QuickActionButton = ({ icon, label, color, onClick }) => {
    const colorClasses = {
        amber: 'bg-amber-50 hover:bg-amber-100 text-amber-700',
        blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
        green: 'bg-green-50 hover:bg-green-100 text-green-700',
        purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
        indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
    };

    const iconBgClasses = {
        amber: 'bg-amber-100',
        blue: 'bg-blue-100',
        green: 'bg-green-100',
        purple: 'bg-purple-100',
        indigo: 'bg-indigo-100'
    };

    return (
        <button
            className={`flex flex-col items-center justify-center p-4 ${colorClasses[color]} rounded-lg transition`}
            onClick={onClick}
        >
            <div className={`p-3 ${iconBgClasses[color]} rounded-full mb-2`}>
                {icon}
            </div>
            <span className="font-medium">{label}</span>
        </button>
    );
};

export default SectionThree;
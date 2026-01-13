import React from 'react';
import { 
    Pending as PendingIcon,
    Autorenew as ProcessingIcon,
    CheckCircle as CompletedIcon,
    Cancel as CancelledIcon,
    Star as StarIcon,
    Schedule as NewIcon,
    Category as CategoryIcon
} from '@mui/icons-material';

const SectionFour = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="Pending Orders" 
                value={stats.pendingOrders} 
                icon={<PendingIcon className="text-orange-600" />}
                color="orange"
                description="Orders awaiting processing"
            />
            <StatCard 
                title="Processing Orders" 
                value={stats.processingOrders} 
                icon={<ProcessingIcon className="text-blue-600" />}
                color="blue"
                description="Orders in progress"
            />
            <StatCard 
                title="Completed Orders" 
                value={stats.completedOrders} 
                icon={<CompletedIcon className="text-green-600" />}
                color="green"
                description="Successfully delivered orders"
            />
            <StatCard 
                title="Cancelled Orders" 
                value={stats.cancelledOrders} 
                icon={<CancelledIcon className="text-red-600" />}
                color="red"
                description="Cancelled orders"
            />

         
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
        orange: 'bg-orange-100 text-orange-600',
        yellow: 'bg-yellow-100 text-yellow-600'
    };

    const textColors = {
        amber: 'text-amber-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        red: 'text-red-600',
        orange: 'text-orange-600',
        yellow: 'text-yellow-600'
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

export default SectionFour;
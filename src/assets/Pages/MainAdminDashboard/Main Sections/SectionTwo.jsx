import React, { useState, useEffect } from 'react';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const SectionTwo = ({ chartData, orderStatusData, trendData }) => {
    const [barData, setBarData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [lineData, setLineData] = useState([]);

    useEffect(() => {
        if (chartData?.length) setBarData(chartData);
        if (orderStatusData?.length) setPieData(orderStatusData);
        if (trendData?.length) setLineData(trendData);
    }, [chartData, orderStatusData, trendData]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {barData.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <TrendingUpIcon className="mr-2 text-blue-500" />
                        Monthly Growth
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cafes" fill="#F59E0B" name="Cafes" isAnimationActive={false} />
                                <Bar dataKey="products" fill="#3B82F6" name="Products" isAnimationActive={false} />
                                <Bar dataKey="orders" fill="#8B5CF6" name="Orders" isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {pieData.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                label={(entry) => `${entry.name}: ${entry.value || 0}`}
                                isAnimationActive={false}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || '#ccc'} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value || 0} orders`, 'Count']}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {lineData.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Weekly Trends</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="cafes" stroke="#F59E0B" strokeWidth={2} activeDot={{ r: 8 }} isAnimationActive={false} />
                                <Line type="monotone" dataKey="products" stroke="#3B82F6" strokeWidth={2} isAnimationActive={false} />
                                <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={2} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionTwo;

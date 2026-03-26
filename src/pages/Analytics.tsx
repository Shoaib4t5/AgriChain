import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';

export const Analytics: React.FC = () => {
  const { user } = useAuth();
  const allProducts = storage.getProducts();
  const userProducts = allProducts.filter(p => p.currentHolderEmail === user?.email);

  // Colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  const renderFarmerCharts = () => {
    const pieData = userProducts.map(p => ({ name: p.name, value: p.qty }));
    
    // For Bar Chart: Added vs Shipped
    // In this simple demo, we'll count products created by user that are still with them vs shipped
    const createdByMe = allProducts.filter(p => p.createdBy === user?.email);
    const shipped = createdByMe.filter(p => p.currentHolderEmail !== user?.email).length;
    const current = createdByMe.filter(p => p.currentHolderEmail === user?.email).length;
    
    const barData = [
      { name: 'Current Stock', count: current },
      { name: 'Shipped', count: shipped },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Stock Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Added vs Shipped</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderDistributorCharts = () => {
    const inWarehouse = userProducts.filter(p => p.status === 'In-Warehouse');
    const pieData = inWarehouse.map(p => ({ name: p.name, value: p.qty }));
    
    // Received vs Sent
    // We'll track products where currentHolderEmail is user (Received) 
    // vs products that were once with user but now elsewhere (Sent)
    // For this demo, we'll just use counts
    const received = userProducts.length;
    const sent = allProducts.filter(p => p.currentHolderEmail !== user?.email && p.role === 'Farmer').length; // Simplified logic

    const barData = [
      { name: 'Received', count: received },
      { name: 'Sent', count: sent },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Warehouse Stock</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Received vs Sent</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderRetailerCharts = () => {
    // Product Sales (Simplified: just showing current stock levels as "available for sale")
    const barData = userProducts.map(p => ({ name: p.name, stock: p.qty }));

    return (
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Product Stock Levels</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="stock" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Low Stock Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProducts.filter(p => p.qty < 50).map(p => (
              <div key={p.id} className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="font-bold text-red-900">{p.name}</p>
                <p className="text-2xl font-black text-red-600">{p.qty}</p>
                <p className="text-xs text-red-500 uppercase font-bold tracking-wider mt-1">Kg Remaining</p>
              </div>
            ))}
            {userProducts.filter(p => p.qty < 50).length === 0 && (
              <p className="text-slate-400 col-span-full text-center py-4">No low stock items.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Supply Chain Analytics</h1>
        <p className="text-slate-500">Visual insights into your agricultural operations.</p>
      </div>

      {user?.role === 'Farmer' && renderFarmerCharts()}
      {user?.role === 'Distributor' && renderDistributorCharts()}
      {user?.role === 'Retailer' && renderRetailerCharts()}
    </div>
  );
};

import React from 'react';
import { Package, Truck, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const products = storage.getProducts();
  
  const userProducts = products.filter(p => p.currentHolderEmail === user?.email);
  const totalStock = userProducts.reduce((acc, p) => acc + p.qty, 0);
  const pendingShipments = products.filter(p => p.status === 'In-Transit' && p.currentHolderEmail === user?.email).length;
  
  const lowStockProducts = userProducts.filter(p => p.qty < 50 && p.status !== 'Sold');

  const stats = [
    { name: 'Total Stock', value: totalStock, icon: Package, color: 'bg-emerald-500' },
    { name: 'Active Products', value: userProducts.length, icon: TrendingUp, color: 'bg-blue-500' },
    { name: 'Pending Actions', value: pendingShipments, icon: Truck, color: 'bg-amber-500' },
    { name: 'Role', value: user?.role, icon: ShoppingCart, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-slate-200`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {userProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">Qty: {product.qty}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.status === 'In-Stock' ? 'bg-emerald-100 text-emerald-700' :
                  product.status === 'In-Transit' ? 'bg-amber-100 text-amber-700' :
                  product.status === 'In-Warehouse' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {product.status}
                </span>
              </div>
            ))}
            {userProducts.length === 0 && (
              <p className="text-slate-400 text-center py-8">No recent activity found.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Alerts</h2>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-amber-900">{product.name}</p>
                  <p className="text-sm text-amber-700">Stock is low: {product.qty} Kg left</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-slate-400 text-center py-8">All stock levels are healthy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

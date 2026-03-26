import React, { useState, useEffect } from 'react';
import { Plus, Send, Download, ShoppingCart, Search, Filter, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { Product, ProductStatus } from '../types';
import { Modal } from '../components/Modal';

export const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState(0);
  const [shipEmail, setShipEmail] = useState('');

  useEffect(() => {
    setProducts(storage.getProducts());
  }, []);

  const refreshProducts = () => {
    setProducts(storage.getProducts());
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      qty: newQty,
      status: 'In-Stock',
      currentHolderEmail: user!.email,
      createdBy: user!.email,
      role: user!.role,
    };
    const allProducts = [...storage.getProducts(), newProduct];
    storage.saveProducts(allProducts);
    refreshProducts();
    setIsAddModalOpen(false);
    setNewName('');
    setNewQty(0);
  };

  const handleShipProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const allProducts = storage.getProducts().map(p => {
      if (p.id === selectedProduct.id) {
        return {
          ...p,
          status: 'In-Transit' as ProductStatus,
          currentHolderEmail: shipEmail,
        };
      }
      return p;
    });

    storage.saveProducts(allProducts);
    refreshProducts();
    setIsShipModalOpen(false);
    setShipEmail('');
    setSelectedProduct(null);
  };

  const handleReceiveProduct = (productId: string) => {
    const allProducts = storage.getProducts().map(p => {
      if (p.id === productId) {
        return {
          ...p,
          status: user?.role === 'Distributor' ? 'In-Warehouse' : 'In-Stock' as ProductStatus,
        };
      }
      return p;
    });
    storage.saveProducts(allProducts);
    refreshProducts();
  };

  const handleSellProduct = (productId: string, sellQty: number) => {
    const allProducts = storage.getProducts().map(p => {
      if (p.id === productId) {
        const remainingQty = p.qty - sellQty;
        return {
          ...p,
          qty: remainingQty < 0 ? 0 : remainingQty,
          status: remainingQty <= 0 ? 'Sold' : p.status as ProductStatus,
        };
      }
      return p;
    });
    storage.saveProducts(allProducts);
    refreshProducts();
  };

  const filteredProducts = products.filter(p => 
    p.currentHolderEmail === user?.email &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500">Manage your stock and track supply chain movements.</p>
        </div>
        {user?.role === 'Farmer' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Package className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-semibold text-slate-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 font-medium">{product.qty} Kg</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.status === 'In-Stock' ? 'bg-emerald-100 text-emerald-700' :
                      product.status === 'In-Transit' ? 'bg-amber-100 text-amber-700' :
                      product.status === 'In-Warehouse' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {product.status === 'In-Transit' && (
                        <button
                          onClick={() => handleReceiveProduct(product.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Receive
                        </button>
                      )}
                      
                      {(product.status === 'In-Stock' || product.status === 'In-Warehouse') && user?.role !== 'Retailer' && (
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsShipModalOpen(true);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-all"
                        >
                          <Send className="w-4 h-4" />
                          Ship
                        </button>
                      )}

                      {user?.role === 'Retailer' && product.status === 'In-Stock' && product.qty > 0 && (
                        <button
                          onClick={() => handleSellProduct(product.id, 10)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg transition-all"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Sell 10
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No products found in your inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Product Name</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Organic Tomatoes"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Initial Quantity</label>
            <input
              type="number"
              required
              min="1"
              value={newQty}
              onChange={(e) => setNewQty(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all"
          >
            Add Product
          </button>
        </form>
      </Modal>

      {/* Ship Product Modal */}
      <Modal
        isOpen={isShipModalOpen}
        onClose={() => setIsShipModalOpen(false)}
        title={`Ship ${selectedProduct?.name}`}
      >
        <form onSubmit={handleShipProduct} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Recipient Email</label>
            <input
              type="email"
              required
              value={shipEmail}
              onChange={(e) => setShipEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="distributor@example.com"
            />
          </div>
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
            Shipping this product will change its status to <span className="font-bold text-amber-600">In-Transit</span> and transfer visibility to the recipient.
          </p>
          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all"
          >
            Ship Product
          </button>
        </form>
      </Modal>
    </div>
  );
};

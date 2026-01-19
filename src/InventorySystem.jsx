import React, { useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, Eye, Upload, Download, AlertCircle, Check, X, Boxes } from 'lucide-react';

const InventorySystem = ({ embedded = false }) => {
    const [currentPage, setCurrentPage] = useState('products');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);

    // Sample Inventory Data
    const [inventory] = useState([
        { id: 'SKU-001', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Navy', size: '20', qty: 45, minStock: 20, maxStock: 100, rate: 420, shelf: 'A-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-002', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Navy', size: '22', qty: 38, minStock: 20, maxStock: 100, rate: 430, shelf: 'A-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-003', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Navy', size: '24', qty: 18, minStock: 20, maxStock: 100, rate: 450, shelf: 'A-3', hsn: '6103', lastUpdated: '14-Jan-2026' },
        { id: 'SKU-004', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Black', size: '22', qty: 52, minStock: 20, maxStock: 100, rate: 430, shelf: 'A-2', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-005', product: 'Speedo Pro', category: 'Sports Track Pants', color: 'Black', size: '22', qty: 20, minStock: 15, maxStock: 80, rate: 520, shelf: 'B-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-006', product: 'Speedo Pro', category: 'Sports Track Pants', color: 'Navy', size: '24', qty: 8, minStock: 15, maxStock: 80, rate: 540, shelf: 'B-2', hsn: '6103', lastUpdated: '13-Jan-2026' },
        { id: 'SKU-007', product: 'Champion', category: 'Sports Track Pants', color: 'Grey', size: '20', qty: 5, minStock: 15, maxStock: 80, rate: 380, shelf: 'B-5', hsn: '6103', lastUpdated: '12-Jan-2026' },
        { id: 'SKU-008', product: 'Turbo', category: 'Premium Track Pants', color: 'Maroon', size: '26', qty: 30, minStock: 10, maxStock: 50, rate: 680, shelf: 'C-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-009', product: 'Sprint', category: 'Budget Track Pants', color: 'Black', size: '24', qty: 75, minStock: 30, maxStock: 150, rate: 320, shelf: 'D-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-010', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Grey', size: '26', qty: 0, minStock: 15, maxStock: 80, rate: 460, shelf: 'A-4', hsn: '6103', lastUpdated: '10-Jan-2026' },
    ]);

    // Products Master Data
    const [products] = useState([
        { id: 'PROD-001', name: 'Raftaar Kids', category: 'Kids Track Pants', sizes: ['20', '22', '24', '26'], colors: ['Navy', 'Black', 'Grey'], baseRate: 420, hsn: '6103', active: true },
        { id: 'PROD-002', name: 'Speedo Pro', category: 'Sports Track Pants', sizes: ['22', '24', '26', '28'], colors: ['Black', 'Navy'], baseRate: 520, hsn: '6103', active: true },
        { id: 'PROD-003', name: 'Champion', category: 'Sports Track Pants', sizes: ['20', '22', '24'], colors: ['Grey', 'Navy', 'Black'], baseRate: 380, hsn: '6103', active: true },
        { id: 'PROD-004', name: 'Turbo', category: 'Premium Track Pants', sizes: ['24', '26', '28', '30'], colors: ['Maroon', 'Navy', 'Black'], baseRate: 680, hsn: '6103', active: true },
        { id: 'PROD-005', name: 'Sprint', category: 'Budget Track Pants', sizes: ['22', '24', '26', '28'], colors: ['Black', 'Grey'], baseRate: 320, hsn: '6103', active: true },
    ]);

    // Navigation Button
    const NavButton = ({ icon: Icon, label, page }) => (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${currentPage === page
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
        >
            <Icon size={14} />
            {label}
        </button>
    );

    // Products Master Page
    const ProductsPage = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Products</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={14} />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Products</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{products.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total SKUs</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{inventory.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Categories</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">4</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Active Products</div>
                    <div className="text-xl font-bold text-green-700 mt-1">{products.filter(p => p.active).length}</div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by product name, category..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Categories</option>
                    <option>Kids Track Pants</option>
                    <option>Sports Track Pants</option>
                    <option>Premium Track Pants</option>
                    <option>Budget Track Pants</option>
                </select>
            </div>

            {/* Products Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">Product ID</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Product Name</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Category</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Sizes</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Colors</th>
                            <th className="text-right p-3 font-semibold text-gray-600">Base Rate</th>
                            <th className="text-center p-3 font-semibold text-gray-600">HSN</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-3 font-mono text-blue-600 font-medium text-[10px]">{product.id}</td>
                                <td className="p-3 font-medium text-gray-900">{product.name}</td>
                                <td className="p-3 text-gray-600">{product.category}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {product.sizes.map(size => (
                                            <span key={size} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{size}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {product.colors.map(color => (
                                            <span key={color} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">{color}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3 text-right font-medium text-gray-700">₹{product.baseRate}</td>
                                <td className="p-3 text-center font-mono text-gray-500">{product.hsn}</td>
                                <td className="p-3 text-center">
                                    {product.active ? (
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-semibold">Active</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-semibold">Inactive</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                                            <Eye size={14} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit">
                                            <Edit size={14} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Stock Management Page
    const StockPage = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Stock</h2>
                </div>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                        <Upload size={14} />
                        Import Stock
                        <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                    </label>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        <Download size={14} />
                        Export
                    </button>
                    <button
                        onClick={() => setShowStockModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={14} />
                        Add Stock
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total SKUs</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{inventory.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Stock Units</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{inventory.reduce((sum, i) => sum + i.qty, 0).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-100 bg-red-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-red-600">Low Stock</div>
                    <div className="text-xl font-bold text-red-700 mt-1">{inventory.filter(i => i.qty <= i.minStock && i.qty > 0).length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-orange-100 bg-orange-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-orange-600">Out of Stock</div>
                    <div className="text-xl font-bold text-orange-700 mt-1">{inventory.filter(i => i.qty === 0).length}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by product, SKU, color..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Products</option>
                    <option>Raftaar Kids</option>
                    <option>Speedo Pro</option>
                    <option>Champion</option>
                    <option>Turbo</option>
                    <option>Sprint</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Colors</option>
                    <option>Navy</option>
                    <option>Black</option>
                    <option>Grey</option>
                    <option>Maroon</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>Stock Status</option>
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                </select>
            </div>

            {/* Stock Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">SKU</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Product</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Color</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Size</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Qty</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Min</th>
                            <th className="text-right p-3 font-semibold text-gray-600">Rate</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Shelf</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map((item) => (
                            <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${item.qty === 0 ? 'bg-orange-50/30' : item.qty <= item.minStock ? 'bg-red-50/30' : ''}`}>
                                <td className="p-3 font-mono text-blue-600 font-medium text-[10px]">{item.id}</td>
                                <td className="p-3">
                                    <div className="font-medium text-gray-900">{item.product}</div>
                                    <div className="text-[10px] text-gray-400">{item.category}</div>
                                </td>
                                <td className="p-3 text-gray-600">{item.color}</td>
                                <td className="p-3 text-center text-gray-600">{item.size}</td>
                                <td className="p-3 text-center font-semibold text-gray-800">{item.qty}</td>
                                <td className="p-3 text-center text-gray-400">{item.minStock}</td>
                                <td className="p-3 text-right font-medium text-gray-700">₹{item.rate}</td>
                                <td className="p-3 font-mono text-[10px] text-gray-500">{item.shelf}</td>
                                <td className="p-3 text-center">
                                    {item.qty === 0 ? (
                                        <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-[10px] font-semibold">Out of Stock</span>
                                    ) : item.qty <= item.minStock ? (
                                        <span className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-[10px] font-semibold">Low Stock</span>
                                    ) : item.qty >= item.maxStock * 0.8 ? (
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-semibold">Well Stocked</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold">In Stock</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                                            <Eye size={14} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit">
                                            <Edit size={14} />
                                        </button>
                                        <button className="px-2 py-1 bg-blue-600 text-white rounded-md text-[10px] font-semibold hover:bg-blue-700 transition-colors">
                                            + Stock
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing {inventory.length} items • Total Value: ₹{inventory.reduce((sum, i) => sum + (i.qty * i.rate), 0).toLocaleString()}</span>
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Previous</button>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">1</button>
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Stock Movements Page
    const MovementsPage = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Stock Movements</h2>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by SKU, product..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Types</option>
                    <option>Stock In</option>
                    <option>Stock Out (Sale)</option>
                    <option>Adjustment</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                </select>
            </div>

            {/* Movements Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                            <th className="text-left p-3 font-semibold text-gray-600">SKU</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Product</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Type</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Qty</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Reference</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100 hover:bg-blue-50/30">
                            <td className="p-3 text-gray-600">15-Jan-2026</td>
                            <td className="p-3 font-mono text-blue-600 text-[10px]">SKU-001</td>
                            <td className="p-3 text-gray-900">Raftaar Kids Navy 20</td>
                            <td className="p-3 text-center"><span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-semibold">Stock In</span></td>
                            <td className="p-3 text-center font-semibold text-green-600">+50</td>
                            <td className="p-3 text-gray-500">Production Batch #PB-156</td>
                            <td className="p-3 text-gray-400">From finishing</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50/30">
                            <td className="p-3 text-gray-600">15-Jan-2026</td>
                            <td className="p-3 font-mono text-blue-600 text-[10px]">SKU-003</td>
                            <td className="p-3 text-gray-900">Raftaar Kids Navy 24</td>
                            <td className="p-3 text-center"><span className="px-2 py-1 bg-red-50 text-red-700 rounded text-[10px] font-semibold">Stock Out</span></td>
                            <td className="p-3 text-center font-semibold text-red-600">-10</td>
                            <td className="p-3 text-gray-500">Order #ORD-001</td>
                            <td className="p-3 text-gray-400">Dispatched</td>
                        </tr>
                        <tr className="border-b border-gray-100 hover:bg-blue-50/30">
                            <td className="p-3 text-gray-600">14-Jan-2026</td>
                            <td className="p-3 font-mono text-blue-600 text-[10px]">SKU-007</td>
                            <td className="p-3 text-gray-900">Champion Grey 20</td>
                            <td className="p-3 text-center"><span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-[10px] font-semibold">Adjustment</span></td>
                            <td className="p-3 text-center font-semibold text-yellow-600">-3</td>
                            <td className="p-3 text-gray-500">Stock Count</td>
                            <td className="p-3 text-gray-400">Damaged items</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    // Add Product Modal
    const AddProductModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[500px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add New Product</h3>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Product Name</label>
                            <input type="text" placeholder="e.g., Raftaar Kids" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Category</label>
                            <select className="w-full px-3 py-2 border rounded-lg">
                                <option>Kids Track Pants</option>
                                <option>Sports Track Pants</option>
                                <option>Premium Track Pants</option>
                                <option>Budget Track Pants</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Base Rate (₹)</label>
                            <input type="number" placeholder="450" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">HSN Code</label>
                            <input type="text" value="6103" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Available Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {['20', '22', '24', '26', '28', '30'].map(size => (
                                <label key={size} className="flex items-center gap-1 px-2 py-1 border rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" />
                                    <span>{size}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Available Colors</label>
                        <div className="flex flex-wrap gap-2">
                            {['Navy', 'Black', 'Grey', 'Maroon', 'White'].map(color => (
                                <label key={color} className="flex items-center gap-1 px-2 py-1 border rounded cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" />
                                    <span>{color}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                        Add Product
                    </button>
                </div>
            </div>
        </div>
    );

    // Add Stock Modal
    const AddStockModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[450px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add Stock</h3>
                    <button onClick={() => setShowStockModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 text-xs">
                    <div>
                        <label className="block text-gray-500 mb-1">Product</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Select product</option>
                            <option>Raftaar Kids</option>
                            <option>Speedo Pro</option>
                            <option>Champion</option>
                            <option>Turbo</option>
                            <option>Sprint</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Color</label>
                            <select className="w-full px-3 py-2 border rounded-lg">
                                <option>Navy</option>
                                <option>Black</option>
                                <option>Grey</option>
                                <option>Maroon</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Size</label>
                            <select className="w-full px-3 py-2 border rounded-lg">
                                <option>20</option>
                                <option>22</option>
                                <option>24</option>
                                <option>26</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Quantity</label>
                            <input type="number" placeholder="50" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Shelf Location</label>
                            <input type="text" placeholder="A-1" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Reference</label>
                        <input type="text" placeholder="e.g., Production Batch #PB-156" className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
                    <button onClick={() => setShowStockModal(false)} className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                        Add Stock
                    </button>
                </div>
            </div>
        </div>
    );

    // Tab navigation for embedded mode
    const TabNav = () => (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg mb-4">
            <NavButton icon={Package} label="Products" page="products" />
            <NavButton icon={Boxes} label="Stock" page="stock" />
            <NavButton icon={AlertCircle} label="Movements" page="movements" />
        </div>
    );

    // Render
    if (embedded) {
        return (
            <div className="text-sm">
                <TabNav />
                {showAddModal && <AddProductModal />}
                {showStockModal && <AddStockModal />}
                {currentPage === 'products' && <ProductsPage />}
                {currentPage === 'stock' && <StockPage />}
                {currentPage === 'movements' && <MovementsPage />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex text-sm">
            {showAddModal && <AddProductModal />}
            {showStockModal && <AddStockModal />}
            <aside className="w-56 bg-white shadow-lg p-4 space-y-1">
                <div className="mb-6">
                    <h2 className="text-base font-bold text-gray-800">Inventory</h2>
                    <p className="text-xs text-gray-500">Stock Management</p>
                </div>
                <NavButton icon={Package} label="Products" page="products" />
                <NavButton icon={Boxes} label="Stock" page="stock" />
                <NavButton icon={AlertCircle} label="Movements" page="movements" />
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                {currentPage === 'products' && <ProductsPage />}
                {currentPage === 'stock' && <StockPage />}
                {currentPage === 'movements' && <MovementsPage />}
            </main>
        </div>
    );
};

export default InventorySystem;

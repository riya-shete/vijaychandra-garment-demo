import React, { useState } from 'react';
import { Users, FileText, Package, Truck, Receipt, CreditCard, Plus, Search, Edit, Trash2, Eye, ChevronRight, X, Check, AlertCircle, Download, Mail, Printer, Upload, FileSpreadsheet } from 'lucide-react';

const CRMSalesSystem = ({ embedded = false }) => {
    const [currentPage, setCurrentPage] = useState('customers');
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Sample Data
    const [customers] = useState([
        { id: 'CUST-001', name: 'ABC Textiles Pvt Ltd', contact: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@abctextiles.com', gst: '27AABCU9603R1ZM', city: 'Mumbai', state: 'Maharashtra', creditLimit: 100000, paymentTerms: '15 Days' },
        { id: 'CUST-002', name: 'XYZ Traders', contact: 'Amit Shah', phone: '9876543211', email: 'amit@xyztraders.com', gst: '24AABCU9603R1ZN', city: 'Ahmedabad', state: 'Gujarat', creditLimit: 75000, paymentTerms: '30 Days' },
        { id: 'CUST-003', name: 'PQR Garments', contact: 'Suresh Patel', phone: '9876543212', email: 'suresh@pqrgarments.com', gst: '29AABCU9603R1ZO', city: 'Bangalore', state: 'Karnataka', creditLimit: 50000, paymentTerms: 'Advance' },
    ]);

    const [orders] = useState([
        { id: 'ORD-001', date: '15-Jan-2026', customer: 'ABC Textiles Pvt Ltd', customerId: 'CUST-001', salesperson: 'Vijay', items: 3, total: 21262, status: 'Pending', deliveryDate: '20-Jan-2026' },
        { id: 'ORD-002', date: '14-Jan-2026', customer: 'XYZ Traders', customerId: 'CUST-002', salesperson: 'Rahul', items: 5, total: 35000, status: 'Dispatched', deliveryDate: '18-Jan-2026' },
        { id: 'ORD-003', date: '13-Jan-2026', customer: 'PQR Garments', customerId: 'CUST-003', salesperson: 'Vijay', items: 2, total: 15500, status: 'Confirmed', deliveryDate: '19-Jan-2026' },
    ]);

    const [invoices] = useState([
        { id: 'INV-2026-0001', date: '15-Jan-2026', orderId: 'ORD-002', customer: 'XYZ Traders', amount: 35000, paid: 35000, status: 'Paid', dueDate: '30-Jan-2026' },
        { id: 'INV-2026-0002', date: '14-Jan-2026', orderId: 'ORD-001', customer: 'ABC Textiles Pvt Ltd', amount: 21262, paid: 0, status: 'Pending', dueDate: '29-Jan-2026' },
        { id: 'INV-2026-0003', date: '10-Jan-2026', orderId: 'ORD-003', customer: 'PQR Garments', amount: 28500, paid: 0, status: 'Overdue', dueDate: '10-Jan-2026' },
    ]);

    const orderItems = [
        { product: 'Raftaar Kids', color: 'Navy', size: '24', qty: 10, rate: 450, amount: 4500 },
        { product: 'Speedo Pro', color: 'Black', size: '22', qty: 15, rate: 520, amount: 7800 },
        { product: 'Champion', color: 'Grey', size: '20', qty: 20, rate: 380, amount: 7600 },
    ];

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

    // Customer Management Page - Improved UI
    const CustomersPage = () => (
        <div className="space-y-5">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Customers</h2>

                </div>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                        <Upload size={14} />
                        Import Excel
                        <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                    </label>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                        <Plus size={14} />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Customers</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{customers.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Credit Limit</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">₹{customers.reduce((sum, c) => sum + c.creditLimit, 0).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Active This Month</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{customers.length}</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by name, contact, or GST..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Payment Terms</option>
                    <option>Advance</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Cities</option>
                    <option>Mumbai</option>
                    <option>Ahmedabad</option>
                    <option>Bangalore</option>
                </select>
            </div>

            {/* Customer Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">Customer ID</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Business Name</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Contact Person</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Phone</th>
                            <th className="text-left p-3 font-semibold text-gray-600">City</th>
                            <th className="text-right p-3 font-semibold text-gray-600">Credit Limit</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Payment Terms</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-3 font-mono text-xs text-blue-600">{customer.id}</td>
                                <td className="p-3">
                                    <div className="font-medium text-gray-900">{customer.name}</div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">GST: {customer.gst}</div>
                                </td>
                                <td className="p-3 text-gray-600">{customer.contact}</td>
                                <td className="p-3 text-gray-600">{customer.phone}</td>
                                <td className="p-3">
                                    <span className="text-gray-700">{customer.city}</span>
                                    <span className="text-gray-400">, {customer.state}</span>
                                </td>
                                <td className="p-3 text-right font-medium text-gray-800">₹{customer.creditLimit.toLocaleString()}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-semibold ${customer.paymentTerms === 'Advance' ? 'bg-green-50 text-green-700' :
                                        customer.paymentTerms === '15 Days' ? 'bg-blue-50 text-blue-700' :
                                            'bg-yellow-50 text-yellow-700'
                                        }`}>
                                        {customer.paymentTerms}
                                    </span>
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

                {/* Table Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing {customers.length} customers</span>
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Previous</button>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">1</button>
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Order Entry Page (Salesperson View) - No stock checking here
    const OrderEntryPage = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">New Sales Order</h2>
                <div className="text-xs text-gray-500">Order Date: {new Date().toLocaleDateString('en-IN')}</div>
            </div>

            <div className="bg-white rounded-xl p-5" style={{ boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)' }}>
                {/* Order Header */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Customer</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs">
                            <option>ABC Textiles Pvt Ltd</option>
                            <option>XYZ Traders</option>
                            <option>PQR Garments</option>
                            <option value="new" className="text-blue-600">+ Add New Customer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Salesperson</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs">
                            <option>Vijay</option>
                            <option>Rahul</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Delivery Date</label>
                        <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs" />
                    </div>
                </div>

                {/* Order Items - Clean table with editable fields */}
                <div className="mb-5">
                    <div className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Order Items</div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-3 font-semibold text-gray-600">Product</th>
                                    <th className="text-left p-3 font-semibold text-gray-600">Color</th>
                                    <th className="text-left p-3 font-semibold text-gray-600">Size</th>
                                    <th className="text-left p-3 font-semibold text-gray-600 w-20">Qty</th>
                                    <th className="text-left p-3 font-semibold text-gray-600 w-24">Rate (₹)</th>
                                    <th className="text-right p-3 font-semibold text-gray-600 w-28">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {orderItems.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3">
                                            <select className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100">
                                                <option>{item.product}</option>
                                                <option>Raftaar Kids</option>
                                                <option>Speedo Pro</option>
                                                <option>Champion</option>
                                                <option>Turbo</option>
                                                <option>Sprint</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <select className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100">
                                                <option>{item.color}</option>
                                                <option>Navy</option>
                                                <option>Black</option>
                                                <option>Grey</option>
                                                <option>White</option>
                                                <option>Maroon</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <select className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100">
                                                <option>{item.size}</option>
                                                <option>20</option>
                                                <option>22</option>
                                                <option>24</option>
                                                <option>26</option>
                                                <option>28</option>
                                                <option>30</option>
                                            </select>
                                        </td>
                                        <td className="p-3">
                                            <input type="number" defaultValue={item.qty} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs text-center focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                                        </td>
                                        <td className="p-3">
                                            <input type="number" defaultValue={item.rate} className="w-full px-2.5 py-1.5 border border-gray-200 rounded-md text-xs text-right focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                                        </td>
                                        <td className="p-3 text-right font-semibold text-gray-800">₹{item.amount.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="flex items-center gap-1.5 mt-3 px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                        <Plus size={14} /> Add Item
                    </button>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal:</span>
                            <span className="font-medium">₹20,250</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Discount:</span>
                            <div className="flex items-center gap-1">
                                <input type="number" placeholder="0" className="w-12 px-2 py-0.5 border rounded text-right text-xs" />
                                <span>%</span>
                                <span className="ml-2">= ₹0</span>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">GST (5%):</span>
                            <span>₹1,012.50</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold text-sm">
                            <span>TOTAL:</span>
                            <span>₹21,262.50</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Save as Draft
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                        Confirm Order
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 flex items-center gap-1">
                        <Printer size={12} /> Confirm & Print
                    </button>
                </div>
            </div>
        </div>
    );

    // Order List Page (Admin View) - Improved UI
    const OrderListPage = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Order List</h2>

                </div>
                <button
                    onClick={() => setCurrentPage('order-entry')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus size={14} />
                    New Order
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Orders</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{orders.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-100 bg-yellow-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-yellow-600">Pending</div>
                    <div className="text-xl font-bold text-yellow-700 mt-1">{orders.filter(o => o.status === 'Pending').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100 bg-blue-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-blue-600">Confirmed</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">{orders.filter(o => o.status === 'Confirmed').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Dispatched</div>
                    <div className="text-xl font-bold text-green-700 mt-1">{orders.filter(o => o.status === 'Dispatched').length}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by order #, customer..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Dispatched</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Salespersons</option>
                    <option>Vijay</option>
                    <option>Rahul</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">Order #</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Customer</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Salesperson</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Items</th>
                            <th className="text-right p-3 font-semibold text-gray-600">Total</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-3 font-mono text-blue-600 font-medium">{order.id}</td>
                                <td className="p-3 text-gray-600">{order.date}</td>
                                <td className="p-3">
                                    <div className="font-medium text-gray-900">{order.customer}</div>
                                    <div className="text-[10px] text-gray-400">Delivery: {order.deliveryDate}</div>
                                </td>
                                <td className="p-3 text-gray-600">{order.salesperson}</td>
                                <td className="p-3 text-center text-gray-600">{order.items} items</td>
                                <td className="p-3 text-right font-semibold text-gray-800">₹{order.total.toLocaleString()}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                                        order.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' :
                                            order.status === 'Dispatched' ? 'bg-green-50 text-green-700' : ''
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                                            <Eye size={14} />
                                        </button>
                                        {order.status === 'Pending' && (
                                            <>
                                                <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Confirm">
                                                    <Check size={14} />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Cancel">
                                                    <X size={14} />
                                                </button>
                                            </>
                                        )}
                                        {order.status === 'Confirmed' && (
                                            <button
                                                onClick={() => { setSelectedOrder(order); setCurrentPage('dispatch'); }}
                                                className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[10px] font-semibold hover:bg-blue-700 transition-colors"
                                            >
                                                Dispatch
                                            </button>
                                        )}
                                        {order.status === 'Dispatched' && (
                                            <button className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-semibold">
                                                ✓ Completed
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing {orders.length} orders</span>
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Previous</button>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">1</button>
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Dispatch/Fulfillment Page - Shows ALL confirmed orders ready for dispatch
    const DispatchPage = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Dispatch / Fulfillment</h2>

                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-blue-100 bg-blue-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-blue-600">Ready to Dispatch</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">{orders.filter(o => o.status === 'Confirmed').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Dispatched Today</div>
                    <div className="text-xl font-bold text-green-700 mt-1">1</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-100 bg-yellow-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-yellow-600">Pending Items Short</div>
                    <div className="text-xl font-bold text-yellow-700 mt-1">3</div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by order #, customer, salesperson..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Salespersons</option>
                    <option>Vijay</option>
                    <option>Rahul</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">Order #</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Customer</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Salesperson</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Items</th>
                            <th className="text-right p-3 font-semibold text-gray-600">Total</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Delivery Date</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Stock</th>
                            <th className="text-center p-3 font-semibold text-gray-600 w-36">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.filter(o => o.status === 'Confirmed' || o.status === 'Dispatched').map((order) => (
                            <tr key={order.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-3 font-mono text-blue-600 font-medium">{order.id}</td>
                                <td className="p-3">
                                    <div className="font-medium text-gray-900">{order.customer}</div>
                                    <div className="text-[10px] text-gray-400">{order.customerId}</div>
                                </td>
                                <td className="p-3 text-gray-600">{order.salesperson}</td>
                                <td className="p-3 text-center text-gray-600">{order.items}</td>
                                <td className="p-3 text-right font-semibold text-gray-800">₹{order.total.toLocaleString()}</td>
                                <td className="p-3 text-gray-600">{order.deliveryDate}</td>
                                <td className="p-3 text-center">
                                    {order.status === 'Confirmed' ? (
                                        <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-semibold">✓ Available</span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-semibold">—</span>
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    {order.status === 'Confirmed' ? (
                                        <button
                                            onClick={() => setShowInvoiceModal(true)}
                                            className="px-3 py-1.5 bg-green-600 text-white rounded-md text-[10px] font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-1"
                                        >
                                            <Truck size={12} /> Complete & Invoice
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setCurrentPage('invoices')}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-semibold hover:bg-blue-100 transition-colors"
                                        >
                                            View Invoice
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing {orders.filter(o => o.status === 'Confirmed' || o.status === 'Dispatched').length} orders</span>
                    <div className="text-xs text-gray-400">Invoice auto-generated on dispatch</div>
                </div>
            </div>
        </div>
    );

    // Invoice List Page - Improved UI with auto-invoice indication
    const InvoicesPage = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Invoices</h2>

                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={14} />
                    Export All
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Invoices</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{invoices.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-100 bg-yellow-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-yellow-600">Pending</div>
                    <div className="text-xl font-bold text-yellow-700 mt-1">₹{invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-100 bg-red-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-red-600">Overdue</div>
                    <div className="text-xl font-bold text-red-700 mt-1">₹{invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Collected</div>
                    <div className="text-xl font-bold text-green-700 mt-1">₹{invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by invoice #, customer..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Overdue</option>
                    <option>Paid</option>
                </select>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>Last 3 Months</option>
                    <option>All Time</option>
                </select>
            </div>

            {/* Invoices Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">Invoice #</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Order</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Customer</th>
                            <th className="text-right p-3 font-semibold text-gray-600">Amount</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Due Date</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-3 font-mono text-blue-600 font-medium">{invoice.id}</td>
                                <td className="p-3 text-gray-600">{invoice.date}</td>
                                <td className="p-3">
                                    <span className="text-gray-500 font-mono text-[10px]">{invoice.orderId}</span>
                                </td>
                                <td className="p-3 font-medium text-gray-900">{invoice.customer}</td>
                                <td className="p-3 text-right font-semibold text-gray-800">₹{invoice.amount.toLocaleString()}</td>
                                <td className="p-3 text-gray-600">{invoice.dueDate}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${invoice.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                                        invoice.status === 'Paid' ? 'bg-green-50 text-green-700' :
                                            invoice.status === 'Overdue' ? 'bg-red-50 text-red-700' : ''
                                        }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-0.5">
                                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View">
                                                <Eye size={14} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Download PDF">
                                                <Download size={14} />
                                            </button>
                                            <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Email">
                                                <Mail size={14} />
                                            </button>
                                        </div>
                                        <div className="w-[95px] text-right">
                                            {invoice.status !== 'Paid' ? (
                                                <button
                                                    onClick={() => setShowPaymentModal(true)}
                                                    className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[10px] font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
                                                >
                                                    Record Payment
                                                </button>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-[10px] font-semibold whitespace-nowrap">✓ Paid</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing {invoices.length} invoices</span>
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Previous</button>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">1</button>
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Inventory Management Page
    const InventoryPage = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Inventory</h2>
                </div>
                <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                        <Upload size={14} />
                        Import Stock
                        <input type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                    </label>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                        <Plus size={14} />
                        Add Product
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
                    <div className="text-xs text-red-600">Low Stock Items</div>
                    <div className="text-xl font-bold text-red-700 mt-1">{inventory.filter(i => i.qty <= i.minStock).length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Stock Value</div>
                    <div className="text-xl font-bold text-green-700 mt-1">₹{inventory.reduce((sum, i) => sum + (i.qty * i.rate), 0).toLocaleString()}</div>
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

            {/* Inventory Table */}
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
                            <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50/30 transition-colors ${item.qty <= item.minStock ? 'bg-red-50/30' : ''}`}>
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
                                    {item.qty <= item.minStock ? (
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
                    <span className="text-xs text-gray-500">Showing {inventory.length} items</span>
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Previous</button>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">1</button>
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Invoice Modal (shown when dispatching)
    const InvoiceModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[600px] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🧾 Generate Invoice</h3>
                    <button onClick={() => setShowInvoiceModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 text-xs">
                    {/* Invoice Header */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Invoice Number</label>
                            <input type="text" value="INV-2026-0004" disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Invoice Date</label>
                            <input type="text" value="15-Jan-2026" disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" />
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-700 mb-1">BILL TO:</div>
                        <div className="text-gray-600">
                            PQR Garments<br />
                            Address Line, Bangalore<br />
                            GSTIN: 29AABCU9603R1ZO
                        </div>
                    </div>

                    {/* Items */}
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-2 font-medium text-gray-600">#</th>
                                <th className="text-left p-2 font-medium text-gray-600">Description</th>
                                <th className="text-left p-2 font-medium text-gray-600">HSN</th>
                                <th className="text-left p-2 font-medium text-gray-600">Qty</th>
                                <th className="text-left p-2 font-medium text-gray-600">Rate</th>
                                <th className="text-left p-2 font-medium text-gray-600">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-2">1</td>
                                <td className="p-2">Track Pants Navy, Size 24</td>
                                <td className="p-2 text-gray-500">6103</td>
                                <td className="p-2">10</td>
                                <td className="p-2">₹450</td>
                                <td className="p-2">₹4,500</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2">2</td>
                                <td className="p-2">Track Pants Black, Size 22</td>
                                <td className="p-2 text-gray-500">6103</td>
                                <td className="p-2">12</td>
                                <td className="p-2">₹450</td>
                                <td className="p-2">₹5,400</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-56 space-y-1">
                            <div className="flex justify-between"><span className="text-gray-500">Subtotal:</span><span>₹9,900</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">CGST (2.5%):</span><span>₹247.50</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">SGST (2.5%):</span><span>₹247.50</span></div>
                            <div className="flex justify-between pt-2 border-t font-semibold"><span>GRAND TOTAL:</span><span>₹10,395</span></div>
                        </div>
                    </div>

                    {/* E-Way Bill */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">E-Way Bill No</label>
                            <input type="text" placeholder="Enter if required" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Vehicle No</label>
                            <input type="text" placeholder="MH-01-AB-1234" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
                    <button className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Preview PDF
                    </button>
                    <button className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1">
                        <Mail size={12} /> Email to Customer
                    </button>
                    <button
                        onClick={() => { setShowInvoiceModal(false); setCurrentPage('invoices'); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 flex items-center gap-1"
                    >
                        <Printer size={12} /> Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );

    // Payment Modal
    const PaymentModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[450px]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold"> Record Payment</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 text-xs">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-gray-500">Invoice: INV-2026-0002</div>
                        <div className="font-medium text-gray-900">ABC Textiles Pvt Ltd</div>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-gray-500">Invoice Amount</div>
                                <div className="font-semibold">₹21,262</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Amount Paid</div>
                                <div className="font-semibold text-green-600">₹0</div>
                            </div>
                            <div>
                                <div className="text-gray-500">Balance Due</div>
                                <div className="font-semibold text-red-600">₹21,262</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Amount Received</label>
                        <input type="number" value="21262" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Payment Date</label>
                        <input type="date" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Payment Mode</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1"><input type="radio" name="mode" defaultChecked /> Bank Transfer</label>
                            <label className="flex items-center gap-1"><input type="radio" name="mode" /> Cash</label>
                            <label className="flex items-center gap-1"><input type="radio" name="mode" /> Cheque</label>
                            <label className="flex items-center gap-1"><input type="radio" name="mode" /> UPI</label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Reference / UTR</label>
                        <input type="text" placeholder="Transaction reference" className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-gray-500 mb-1">Remarks</label>
                        <input type="text" placeholder="Optional notes" className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
                    <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={() => setShowPaymentModal(false)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 flex items-center gap-1"
                    >
                        <Check size={12} /> Record Payment
                    </button>
                </div>
            </div>
        </div>
    );

    // Tab navigation for embedded mode
    const TabNav = () => (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg mb-4">
            <NavButton icon={Users} label="Customers" page="customers" />
            <NavButton icon={Plus} label="New Order" page="order-entry" />
            <NavButton icon={Package} label="Orders" page="orders" />
            <NavButton icon={Truck} label="Dispatch" page="dispatch" />
            <NavButton icon={Receipt} label="Invoices" page="invoices" />
        </div>
    );

    // Render
    if (embedded) {
        return (
            <div className="text-sm">
                <TabNav />
                {showInvoiceModal && <InvoiceModal />}
                {showPaymentModal && <PaymentModal />}
                {currentPage === 'customers' && <CustomersPage />}
                {currentPage === 'order-entry' && <OrderEntryPage />}
                {currentPage === 'orders' && <OrderListPage />}
                {currentPage === 'dispatch' && <DispatchPage />}
                {currentPage === 'invoices' && <InvoicesPage />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex text-sm">
            {showInvoiceModal && <InvoiceModal />}
            {showPaymentModal && <PaymentModal />}
            <aside className="w-56 bg-white shadow-lg p-4 space-y-1">
                <div className="mb-6">
                    <h2 className="text-base font-bold text-gray-800">CRM & Sales</h2>
                    <p className="text-xs text-gray-500">B2B Management</p>
                </div>
                <NavButton icon={Users} label="Customers" page="customers" />
                <NavButton icon={Plus} label="New Order" page="order-entry" />
                <NavButton icon={Package} label="Orders" page="orders" />
                <NavButton icon={Truck} label="Dispatch" page="dispatch" />
                <NavButton icon={Receipt} label="Invoices" page="invoices" />
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                {currentPage === 'customers' && <CustomersPage />}
                {currentPage === 'order-entry' && <OrderEntryPage />}
                {currentPage === 'orders' && <OrderListPage />}
                {currentPage === 'dispatch' && <DispatchPage />}
                {currentPage === 'invoices' && <InvoicesPage />}
            </main>
        </div>
    );
};

export default CRMSalesSystem;

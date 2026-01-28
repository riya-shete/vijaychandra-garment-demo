import React, { useState } from 'react';
import { Users, Shield, Settings, Bell, Database, Key, Plus, Edit, Trash2, Eye, EyeOff, X, Check, Search, Lock, Unlock, UserCheck, AlertCircle, Save } from 'lucide-react';

const SettingsSystem = ({ embedded = false }) => {
    const [currentTab, setCurrentTab] = useState('users');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showPassword, setShowPassword] = useState({});

    // User roles and permissions
    const roles = {
        'Super Admin': {
            color: 'red',
            permissions: ['all'],
            description: 'Full system access'
        },
        'Supervisor': {
            color: 'blue',
            permissions: ['production', 'worker-wages', 'inventory', 'view-reports'],
            description: 'Manage production & workers'
        },
        'Worker': {
            color: 'green',
            permissions: ['work-completion', 'view-own-wages'],
            description: 'Self-service only'
        },
        'Accountant': {
            color: 'purple',
            permissions: ['worker-wages', 'crm', 'view-reports'],
            description: 'Finance & wages'
        },
        'Viewer': {
            color: 'gray',
            permissions: ['view-dashboard', 'view-reports'],
            description: 'Read-only access'
        }
    };

    const [users, setUsers] = useState([
        { id: 1, name: 'Admin User', email: 'admin@vijaychandra.com', phone: '9876543210', role: 'Super Admin', status: 'Active', lastLogin: '2 hours ago' },
        { id: 2, name: 'Rajesh Sharma', email: 'rajesh@vijaychandra.com', phone: '9876543211', role: 'Supervisor', status: 'Active', lastLogin: '1 day ago' },
        { id: 3, name: 'Priya Patel', email: 'priya@vijaychandra.com', phone: '9876543212', role: 'Accountant', status: 'Active', lastLogin: '3 hours ago' },
        { id: 4, name: 'Floor Viewer', email: 'viewer@vijaychandra.com', phone: '9876543213', role: 'Viewer', status: 'Active', lastLogin: '1 week ago' },
    ]);

    const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'Viewer', password: '' });

    // Module permissions mapping
    const modulePermissions = [
        { id: 'dashboard', name: 'Dashboard', description: 'View main dashboard' },
        { id: 'production', name: 'Production', description: 'Manage cotton rolls, cutting, bundles' },
        { id: 'worker-wages', name: 'Worker Wages', description: 'Workers, assignments, wages, reports' },
        { id: 'work-assignment', name: 'Work Assignment', description: 'Assign bundles to workers' },
        { id: 'work-completion', name: 'Work Completion', description: 'Mark work as complete' },
        { id: 'inventory', name: 'Inventory', description: 'Stock management' },
        { id: 'crm', name: 'CRM / Sales', description: 'Customers, orders, invoices' },
        { id: 'view-reports', name: 'View Reports', description: 'Access wage and production reports' },
        { id: 'view-own-wages', name: 'View Own Wages', description: 'Workers view their earnings' },
        { id: 'settings', name: 'Settings', description: 'System configuration (Admin only)' },
    ];

    const [systemSettings, setSystemSettings] = useState({
        companyName: 'Vijaychandra Garments',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        workingHours: '09:00 - 18:00',
        autoLogout: 30,
        requirePasswordChange: 90,
    });

    const [notificationSettings, setNotificationSettings] = useState({
        lowStockAlert: true,
        orderDeadline: true,
        dailyReport: true,
        workerAbsence: true,
        wageApproval: false,
    });

    // Add new user
    const addUser = () => {
        if (!newUser.name || !newUser.email) return;
        setUsers(prev => [...prev, {
            id: prev.length + 1,
            ...newUser,
            status: 'Active',
            lastLogin: 'Never'
        }]);
        setNewUser({ name: '', email: '', phone: '', role: 'Viewer', password: '' });
        setShowAddUserModal(false);
    };

    // Delete user
    const deleteUser = (userId) => {
        if (users.find(u => u.id === userId)?.role === 'Super Admin') {
            alert('Cannot delete Super Admin');
            return;
        }
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    // Toggle user status
    const toggleUserStatus = (userId) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
        ));
    };

    const getRoleColor = (role) => {
        const colors = {
            'Super Admin': 'bg-red-100 text-red-700 border-red-200',
            'Supervisor': 'bg-blue-100 text-blue-700 border-blue-200',
            'Worker': 'bg-green-100 text-green-700 border-green-200',
            'Accountant': 'bg-purple-100 text-purple-700 border-purple-200',
            'Viewer': 'bg-gray-100 text-gray-700 border-gray-200',
        };
        return colors[role] || colors['Viewer'];
    };

    // Tab Navigation
    const TabNav = () => (
        <div className="flex gap-1 border-b border-gray-200 mb-4">
            {[
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'roles', label: 'Roles & Permissions', icon: Shield },
                { id: 'general', label: 'General Settings', icon: Settings },
                { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${currentTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <tab.icon size={14} />
                    {tab.label}
                </button>
            ))}
        </div>
    );

    // User Management Tab
    const UsersTab = () => (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">User Accounts</h3>
                    <p className="text-xs text-gray-500">Manage who can access the system and their permissions</p>
                </div>
                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1.5"
                >
                    <Plus size={14} /> Add User
                </button>
            </div>

            {/* Search */}
            <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs"
                />
            </div>

            {/* Users Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">User</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Contact</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Role</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Last Login</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-blue-50/30">
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">{user.name}</div>
                                            <div className="text-[10px] text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-gray-600 font-mono">{user.phone}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => toggleUserStatus(user.id)}
                                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${user.status === 'Active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {user.status}
                                    </button>
                                </td>
                                <td className="p-3 text-gray-500">{user.lastLogin}</td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                                            <Edit size={14} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded" title="Reset Password">
                                            <Key size={14} />
                                        </button>
                                        {user.role !== 'Super Admin' && (
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[500px] overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Add New User</h3>
                                <p className="text-xs text-gray-500">Create a new user account with role-based access</p>
                            </div>
                            <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser(p => ({ ...p, name: e.target.value }))}
                                        placeholder="Enter name..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={newUser.phone}
                                        onChange={(e) => setNewUser(p => ({ ...p, phone: e.target.value }))}
                                        placeholder="9876543210"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser(p => ({ ...p, email: e.target.value }))}
                                    placeholder="user@vijaychandra.com"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword.new ? 'text' : 'password'}
                                        value={newUser.password}
                                        onChange={(e) => setNewUser(p => ({ ...p, password: e.target.value }))}
                                        placeholder="Enter password..."
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Select Role</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(roles).filter(([r]) => r !== 'Super Admin').map(([role, info]) => (
                                        <label
                                            key={role}
                                            className={`flex items-start gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${newUser.role === role
                                                ? 'bg-blue-50 border-blue-400'
                                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                checked={newUser.role === role}
                                                onChange={() => setNewUser(p => ({ ...p, role }))}
                                                className="mt-0.5"
                                            />
                                            <div>
                                                <div className="text-xs font-semibold text-gray-800">{role}</div>
                                                <div className="text-[10px] text-gray-500">{info.description}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                            <button
                                onClick={() => setShowAddUserModal(false)}
                                className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addUser}
                                disabled={!newUser.name || !newUser.email}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                            >
                                <UserCheck size={14} /> Create User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Roles & Permissions Tab
    const RolesTab = () => (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-800">Roles & Permissions</h3>
                <p className="text-xs text-gray-500">Configure what each role can access in the system</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {Object.entries(roles).map(([role, info]) => (
                    <div key={role} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className={`px-4 py-3 border-b flex items-center justify-between ${role === 'Super Admin' ? 'bg-red-50' : 'bg-gray-50'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'Super Admin' ? 'bg-red-100' :
                                    role === 'Supervisor' ? 'bg-blue-100' :
                                        role === 'Worker' ? 'bg-green-100' :
                                            role === 'Accountant' ? 'bg-purple-100' : 'bg-gray-100'
                                    }`}>
                                    <Shield size={16} className={
                                        role === 'Super Admin' ? 'text-red-600' :
                                            role === 'Supervisor' ? 'text-blue-600' :
                                                role === 'Worker' ? 'text-green-600' :
                                                    role === 'Accountant' ? 'text-purple-600' : 'text-gray-600'
                                    } />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800">{role}</div>
                                    <div className="text-xs text-gray-500">{info.description}</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400">
                                {users.filter(u => u.role === role).length} users
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-5 gap-2">
                                {modulePermissions.map(perm => {
                                    const hasAccess = info.permissions.includes('all') || info.permissions.includes(perm.id);
                                    return (
                                        <div
                                            key={perm.id}
                                            className={`p-2.5 rounded-lg border text-center ${hasAccess
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-gray-50 border-gray-200'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center mb-1">
                                                {hasAccess ? (
                                                    <Unlock size={12} className="text-green-600" />
                                                ) : (
                                                    <Lock size={12} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className={`text-[10px] font-medium ${hasAccess ? 'text-green-700' : 'text-gray-400'}`}>
                                                {perm.name}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // General Settings Tab
    const GeneralTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-800">General Settings</h3>
                <p className="text-xs text-gray-500">Configure system-wide preferences</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Company Information</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Company Name</label>
                        <input
                            type="text"
                            value={systemSettings.companyName}
                            onChange={(e) => setSystemSettings(p => ({ ...p, companyName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Currency</label>
                        <select
                            value={systemSettings.currency}
                            onChange={(e) => setSystemSettings(p => ({ ...p, currency: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Timezone</label>
                        <select
                            value={systemSettings.timezone}
                            onChange={(e) => setSystemSettings(p => ({ ...p, timezone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                            <option value="UTC">UTC</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Working Hours</label>
                        <input
                            type="text"
                            value={systemSettings.workingHours}
                            onChange={(e) => setSystemSettings(p => ({ ...p, workingHours: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Security Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Auto Logout (minutes)</label>
                        <input
                            type="number"
                            value={systemSettings.autoLogout}
                            onChange={(e) => setSystemSettings(p => ({ ...p, autoLogout: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Password Change Required (days)</label>
                        <input
                            type="number"
                            value={systemSettings.requirePasswordChange}
                            onChange={(e) => setSystemSettings(p => ({ ...p, requirePasswordChange: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-1.5">
                    <Save size={14} /> Save Settings
                </button>
            </div>
        </div>
    );

    // Notifications Tab
    const NotificationsTab = () => (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-800">Notification Preferences</h3>
                <p className="text-xs text-gray-500">Configure system alerts and notifications</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                {[
                    { key: 'lowStockAlert', label: 'Low Stock Alerts', description: 'Get notified when inventory falls below threshold' },
                    { key: 'orderDeadline', label: 'Order Deadline Warnings', description: 'Alerts before order delivery deadlines' },
                    { key: 'dailyReport', label: 'Daily Production Report', description: 'Receive end-of-day production summary' },
                    { key: 'workerAbsence', label: 'Worker Absence Alerts', description: 'Notify when workers are absent' },
                    { key: 'wageApproval', label: 'Wage Approval Required', description: 'Require approval before wage processing' },
                ].map(item => (
                    <div key={item.key} className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-gray-800">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                        <button
                            onClick={() => setNotificationSettings(p => ({ ...p, [item.key]: !p[item.key] }))}
                            className={`w-12 h-6 rounded-full transition-colors relative ${notificationSettings[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${notificationSettings[item.key] ? 'right-0.5' : 'left-0.5'
                                }`} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className={embedded ? '' : 'min-h-screen bg-gray-50 p-6'}>
            <div className="space-y-4">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
                        <p className="text-xs text-gray-500">System configuration and user management</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-1.5">
                            <Shield size={14} className="text-red-600" />
                            <span className="text-red-700 font-medium">Super Admin Access</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <TabNav />

                {/* Tab Content */}
                <div className="bg-gray-50 min-h-[500px]">
                    {currentTab === 'users' && <UsersTab />}
                    {currentTab === 'roles' && <RolesTab />}
                    {currentTab === 'general' && <GeneralTab />}
                    {currentTab === 'notifications' && <NotificationsTab />}
                </div>
            </div>
        </div>
    );
};

export default SettingsSystem;

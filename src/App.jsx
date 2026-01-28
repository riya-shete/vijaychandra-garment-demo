import React, { useState } from 'react';
import { LayoutDashboard, Factory, Wallet, Package, ShoppingCart, Settings, TrendingUp, Users, Clock, AlertCircle, ChevronRight, ArrowUpRight, ArrowDownRight, Bell, Search, Calendar, Printer, Sparkles, Box } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BundleProvider } from './contexts/BundleContext';
import WorkerWageSystem from './WorkerWageSystem';
import CRMSalesSystem from './CRMSalesSystem';
import InventorySystem from './InventorySystem';
import ProductionSystem from './ProductionSystem';
import SettingsSystem from './SettingsSystem';
import PrintingSystem from './PrintingSystem';
import IroningSystem from './IroningSystem';
import PackagingSystem from './PackagingSystem';
import { InventoryProvider } from './contexts/InventoryContext';
import './index.css';

function App() {
  const [currentModule, setCurrentModule] = useState('dashboard');

  // Chart Data
  const weeklyProductionData = [
    { day: 'Mon', production: 1120, target: 1000, lastWeek: 950 },
    { day: 'Tue', production: 1350, target: 1000, lastWeek: 1100 },
    { day: 'Wed', production: 980, target: 1000, lastWeek: 1050 },
    { day: 'Thu', production: 1450, target: 1000, lastWeek: 1200 },
    { day: 'Fri', production: 1280, target: 1000, lastWeek: 1150 },
    { day: 'Sat', production: 890, target: 800, lastWeek: 750 },
  ];

  const hourlyOutputData = [
    { hour: '9AM', units: 120 },
    { hour: '10AM', units: 180 },
    { hour: '11AM', units: 210 },
    { hour: '12PM', units: 150 },
    { hour: '1PM', units: 90 },
    { hour: '2PM', units: 200 },
    { hour: '3PM', units: 230 },
    { hour: '4PM', units: 190 },
    { hour: '5PM', units: 170 },
  ];

  const operationWiseData = [
    { name: 'Cutting', value: 320, color: '#3B82F6' },
    { name: 'Stitching', value: 450, color: '#10B981' },
    { name: 'Finishing', value: 280, color: '#F59E0B' },
    { name: 'Packing', value: 200, color: '#8B5CF6' },
  ];

  const fabricInventory = [
    { name: 'Cotton', stock: 850, used: 320 },
    { name: 'Polyester', stock: 520, used: 180 },
    { name: 'Blend', stock: 340, used: 150 },
    { name: 'Denim', stock: 280, used: 90 },
  ];

  const orderStatusData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'In Progress', value: 32, color: '#3B82F6' },
    { name: 'Pending', value: 18, color: '#F59E0B' },
    { name: 'Delayed', value: 5, color: '#EF4444' },
  ];

  const monthlyTrend = [
    { month: 'Jan', production: 28500, wages: 125000 },
    { month: 'Feb', production: 32000, wages: 138000 },
    { month: 'Mar', production: 29800, wages: 128500 },
    { month: 'Apr', production: 35200, wages: 152000 },
    { month: 'May', production: 38500, wages: 168000 },
    { month: 'Jun', production: 42000, wages: 182000 },
  ];

  const stats = {
    todayProduction: 1250,
    productionTarget: 1500,
    workersPresent: 45,
    totalWorkers: 52,
    todayWages: 24580,
    pendingOrders: 23,
    fabricReceived: 450,
    efficiency: 86,
  };

  // Sidebar Navigation - Clean, minimal style
  const NavItem = ({ icon: Icon, label, module, active }) => (
    <button
      onClick={() => setCurrentModule(module)}
      className={`flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg text-xs font-medium transition-all ${active
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  // KPI Card - Clean minimal design with strong shadow
  const KPICard = ({ title, value, subtitle }) => (
    <div
      className="bg-white rounded-xl p-5"
      style={{ boxShadow: '0 4px 25px rgba(0, 0, 0, 0.17)' }}
    >
      <div className="text-xs text-gray-500 mb-2">{title}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {subtitle && <div className="text-[11px] text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );

  // Dashboard Content - Clean, smaller text
  const DashboardHome = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Production Dashboard</h1>

        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." className="pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs w-52 focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all" />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 relative transition-colors">
            <Bell size={16} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 text-white text-[10px] rounded-full flex items-center justify-center font-medium">3</span>
          </button>
          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2">
            <Calendar size={14} />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          title="Today's Production"
          value={`${stats.todayProduction.toLocaleString()} pcs`}
          subtitle={`Target: ${stats.productionTarget}`}
        />
        <KPICard
          title="Workers Present"
          value={`${stats.workersPresent} / ${stats.totalWorkers}`}
          subtitle={`${Math.round(stats.workersPresent / stats.totalWorkers * 100)}% attendance`}
        />
        <KPICard
          title="Today's Wages"
          value={`₹${stats.todayWages.toLocaleString()}`}
        />
        <KPICard
          title="Efficiency Rate"
          value={`${stats.efficiency}%`}
          subtitle="Above target"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-3 gap-3">
        {/* Weekly Production Trend */}
        <div className="col-span-2 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-medium text-gray-800">Weekly Production Trend</h2>
              <p className="text-xs text-gray-400">Production vs Target vs Last Week</p>
            </div>
            <select className="px-2 py-1 text-xs border rounded text-gray-600 bg-gray-50">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyProductionData}>
              <defs>
                <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="production" stroke="#3B82F6" strokeWidth={2} fill="url(#colorProd)" name="Production" />
              <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target" />
              <Line type="monotone" dataKey="lastWeek" stroke="#D1D5DB" strokeWidth={1.5} dot={false} name="Last Week" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Operation Distribution */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-3">
            <h2 className="text-sm font-medium text-gray-800">Operation Distribution</h2>
            <p className="text-xs text-gray-400">Today's pieces by operation</p>
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={operationWiseData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                {operationWiseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {operationWiseData.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-3">
        {/* Hourly Output */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-medium text-gray-800">Hourly Output</h2>
              <p className="text-xs text-gray-400">Today's production by hour</p>
            </div>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded-full">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={hourlyOutputData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" tick={{ fill: '#9CA3AF', fontSize: 9 }} />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
              <Bar dataKey="units" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-medium text-gray-800">Order Status</h2>
              <p className="text-xs text-gray-400">Current order breakdown</p>
            </div>
            <button className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {orderStatusData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-3 gap-3">
        {/* Fabric Inventory */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-3">
            <h2 className="text-sm font-medium text-gray-800">Fabric Inventory</h2>
            <p className="text-xs text-gray-400">Stock vs Usage (mtrs)</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={fabricInventory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 9 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF', fontSize: 9 }} width={55} />
              <Tooltip contentStyle={{ fontSize: 10 }} />
              <Bar dataKey="stock" fill="#3B82F6" radius={[0, 3, 3, 0]} name="Stock" barSize={10} />
              <Bar dataKey="used" fill="#F59E0B" radius={[0, 3, 3, 0]} name="Used" barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="col-span-2 bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-3">
            <h2 className="text-sm font-medium text-gray-800">Monthly Trend</h2>
            <p className="text-xs text-gray-400">Production & Wages (6 months)</p>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 9 }} />
              <YAxis yAxisId="left" tick={{ fill: '#9CA3AF', fontSize: 9 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#9CA3AF', fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="production" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Production" />
              <Line yAxisId="right" type="monotone" dataKey="wages" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Wages" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Recent Activity */}
        <div className="col-span-2 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-800">Recent Activity</h2>
            <button className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-2">
            {[
              { text: 'Bundle #7508 completed - Shirts (50 pcs)', time: '5m ago', type: 'success' },
              { text: 'Fabric received - Cotton Grey (200 mtrs)', time: '15m ago', type: 'info' },
              { text: 'Order #1234 moved to production', time: '32m ago', type: 'info' },
              { text: 'Low stock alert - Black thread', time: '1h ago', type: 'warning' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className={`w-1.5 h-1.5 rounded-full ${activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                <p className="flex-1 text-xs text-gray-700">{activity.text}</p>
                <span className="text-[10px] text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h2 className="text-sm font-medium text-gray-800 mb-3">Alerts</h2>
          <div className="space-y-2">
            <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg">
              <div className="flex items-center gap-1.5 mb-0.5">
                <AlertCircle size={12} className="text-red-500" />
                <span className="text-xs font-medium text-red-700">Critical</span>
              </div>
              <p className="text-[10px] text-red-600">Black thread stock below 20%</p>
            </div>
            <div className="p-2.5 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Clock size={12} className="text-yellow-600" />
                <span className="text-xs font-medium text-yellow-700">Warning</span>
              </div>
              <p className="text-[10px] text-yellow-600">Order #1189 deadline in 2 days</p>
            </div>
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-1.5 mb-0.5">
                <TrendingUp size={12} className="text-blue-500" />
                <span className="text-xs font-medium text-blue-700">Info</span>
              </div>
              <p className="text-[10px] text-blue-600">Weekly target 85% achieved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Placeholder for other modules
  const PlaceholderModule = ({ title, icon: Icon, description }) => (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg border-2 border-dashed border-gray-200">
      <div className="p-3 bg-gray-100 rounded-full mb-3">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h2 className="text-base font-medium text-gray-600 mb-1">{title}</h2>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );

  return (
    <BundleProvider>
      <InventoryProvider>
        <div className="min-h-screen bg-gray-50 flex text-sm">
          {/* Sidebar */}
          <aside className="w-48 bg-white border-r border-gray-200 p-3 flex flex-col">
            <div className="mb-6 px-1">
              <h1 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">

                VIJAYCHANDRA
              </h1>

            </div>

            <nav className="flex-1 space-y-1">
              <NavItem icon={LayoutDashboard} label="Dashboard" module="dashboard" active={currentModule === 'dashboard'} />
              <NavItem icon={Factory} label="Production" module="production" active={currentModule === 'production'} />
              <NavItem icon={Printer} label="Printing Hub" module="printing" active={currentModule === 'printing'} />
              <NavItem icon={LayoutDashboard} label="Sewing Floor" module="worker-wages" active={currentModule === 'worker-wages'} />
              <NavItem icon={Sparkles} label="Finishing Station" module="ironing" active={currentModule === 'ironing'} />
              <NavItem icon={Box} label="Packaging" module="packaging" active={currentModule === 'packaging'} />
              <NavItem icon={Package} label="Inventory" module="inventory" active={currentModule === 'inventory'} />
              <NavItem icon={ShoppingCart} label="CRM / Sales" module="crm" active={currentModule === 'crm'} />
              <NavItem icon={Settings} label="Settings" module="settings" active={currentModule === 'settings'} />
            </nav>

            <div className="pt-3 border-t border-gray-100">
              <div className="px-2 py-2 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-medium text-green-700">Tally Connected</span>
                </div>
                <p className="text-[9px] text-green-600">Last sync: 2 min ago</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 overflow-auto">
            {currentModule === 'dashboard' && <DashboardHome />}
            {currentModule === 'production' && <ProductionSystem embedded={true} />}
            {currentModule === 'printing' && <PrintingSystem embedded={true} />}
            {currentModule === 'worker-wages' && <WorkerWageSystem embedded={true} />}
            {currentModule === 'ironing' && <IroningSystem embedded={true} />}
            {currentModule === 'packaging' && <PackagingSystem embedded={true} />}
            {currentModule === 'inventory' && <InventorySystem embedded={true} />}
            {currentModule === 'crm' && <CRMSalesSystem embedded={true} />}
            {currentModule === 'settings' && <SettingsSystem embedded={true} />}
          </main>
        </div>
      </InventoryProvider>
    </BundleProvider >
  );
}

export default App;

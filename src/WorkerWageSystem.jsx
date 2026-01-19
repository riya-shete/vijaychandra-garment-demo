import React, { useState } from 'react';
import { ChevronRight, Users, FileText, DollarSign, Package, CheckCircle, Clock, Search, Calendar, Plus, Eye, Edit, Trash2, Download, Printer, ScanBarcode as Barcode, Save, X, Settings, ClipboardCheck, UserCheck } from 'lucide-react';

const WorkerWageSystem = ({ embedded = false }) => {
    const [currentPage, setCurrentPage] = useState('workers');
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedDate, setSelectedDate] = useState('2026-01-15');
    const [editingRate, setEditingRate] = useState(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
    const [newWorker, setNewWorker] = useState({ name: '', phone: '', operations: [] });
    const [selectedOperation, setSelectedOperation] = useState('');
    const [selectedBundles, setSelectedBundles] = useState([]);

    const [operationRates, setOperationRates] = useState({
        'Bottom Stitch': 0.30,
        'Pocket Stitch': 0.50,
        'Collar Stitch': 0.35,
        'Elastic Stitch': 0.20,
        'Zip Attach': 0.40,
        'Side Stitch': 0.25,
        'Button Attach': 0.15,
    });

    const [workers, setWorkers] = useState([
        { id: 'WRK-001', name: 'Ramesh Kumar', phone: '9876543210', status: 'Active', operations: ['Bottom Stitch', 'Pocket Stitch', 'Side Stitch', 'Zip Attach'] },
        { id: 'WRK-002', name: 'Suresh Patil', phone: '9876543211', status: 'Active', operations: ['Collar Stitch', 'Button Attach'] },
        { id: 'WRK-003', name: 'Mohan Singh', phone: '9876543212', status: 'Active', operations: ['Elastic Stitch', 'Bottom Stitch'] },
    ]);

    const [attendance, setAttendance] = useState({});

    const [bundles, setBundles] = useState([
        // Enhanced structure: each bundle tracks which operations are done
        {
            id: '7506-1', production: '7506', product: 'Track Pants', color: 'Grey', size: '20', pieces: 8,
            operationsCompleted: {
                'Bottom Stitch': { done: true, worker: 'Ramesh Kumar', time: '10:30 AM' },
                'Pocket Stitch': { done: true, worker: 'Suresh Patil', time: '11:00 AM' },
            },
            currentWorker: null,
            currentOperation: null,
        },
        {
            id: '7506-2', production: '7506', product: 'Track Pants', color: 'Black', size: '22', pieces: 8,
            operationsCompleted: {
                'Bottom Stitch': { done: true, worker: 'Ramesh Kumar', time: '10:45 AM' },
            },
            currentWorker: 'Suresh Patil',
            currentOperation: 'Pocket Stitch',
        },
        {
            id: '7506-3', production: '7506', product: 'Track Pants', color: 'Navy', size: '24', pieces: 8,
            operationsCompleted: {},
            currentWorker: 'Mohan Singh',
            currentOperation: 'Elastic Stitch',
        },
        {
            id: '7507-1', production: '7507', product: 'Track Pants', color: 'Navy', size: '24', pieces: 8,
            operationsCompleted: {},
            currentWorker: null,
            currentOperation: null,
        },
        {
            id: '7507-2', production: '7507', product: 'Track Pants', color: 'Grey', size: '26', pieces: 8,
            operationsCompleted: {},
            currentWorker: null,
            currentOperation: null,
        },
        {
            id: '7507-3', production: '7507', product: 'Track Pants', color: 'Black', size: '28', pieces: 8,
            operationsCompleted: {
                'Bottom Stitch': { done: true, worker: 'Mohan Singh', time: '11:15 AM' },
                'Elastic Stitch': { done: true, worker: 'Mohan Singh', time: '11:30 AM' },
                'Pocket Stitch': { done: true, worker: 'Ramesh Kumar', time: '11:45 AM' },
                'Side Stitch': { done: true, worker: 'Ramesh Kumar', time: '12:00 PM' },
            },
            currentWorker: null,
            currentOperation: null,
        },
        {
            id: '7508-1', production: '7508', product: 'Shirts', color: 'White', size: 'M', pieces: 10,
            operationsCompleted: {},
            currentWorker: null,
            currentOperation: null,
        },
        {
            id: '7508-2', production: '7508', product: 'Shirts', color: 'Blue', size: 'L', pieces: 10,
            operationsCompleted: {
                'Collar Stitch': { done: true, worker: 'Suresh Patil', time: '10:00 AM' },
            },
            currentWorker: null,
            currentOperation: null,
        },
    ]);

    const dailyWork = [
        { operation: 'Bottom Stitching', bundles: 10, pieces: 80, rate: 0.30, amount: 24.00 },
        { operation: 'Pocket Stitching', bundles: 5, pieces: 40, rate: 0.50, amount: 20.00 },
        { operation: 'Elastic Stitching', bundles: 8, pieces: 64, rate: 0.20, amount: 12.80 },
    ];

    const weeklyData = [
        { worker: 'Ramesh Kumar', mon: 56, tue: 62, wed: 58, thu: 45, fri: 70, sat: 55, total: 346, paid: 300, balance: 46 },
        { worker: 'Suresh Patil', mon: 48, tue: 52, wed: 55, thu: 60, fri: 58, sat: 50, total: 323, paid: 300, balance: 23 },
        { worker: 'Mohan Singh', mon: 52, tue: 58, wed: 62, thu: 55, fri: 65, sat: 60, total: 352, paid: 350, balance: 2 },
    ];

    const updateRate = (operation, newRate) => {
        setOperationRates(prev => ({ ...prev, [operation]: parseFloat(newRate) || 0 }));
        setEditingRate(null);
    };

    const toggleAttendance = (workerId) => {
        setAttendance(prev => {
            const current = prev[workerId];
            if (!current) return { ...prev, [workerId]: 'present' };
            if (current === 'present') return { ...prev, [workerId]: 'absent' };
            return { ...prev, [workerId]: undefined };
        });
    };

    const markAllPresent = () => {
        const newAttendance = {};
        workers.filter(w => w.status === 'Active').forEach(w => {
            newAttendance[w.id] = 'present';
        });
        setAttendance(newAttendance);
    };

    const addNewWorker = () => {
        if (!newWorker.name.trim() || !newWorker.phone.trim()) return;
        const newId = `WRK-${String(workers.length + 1).padStart(3, '0')}`;
        setWorkers(prev => [...prev, {
            id: newId,
            name: newWorker.name.trim(),
            phone: newWorker.phone.trim(),
            status: 'Active',
            operations: newWorker.operations
        }]);
        setNewWorker({ name: '', phone: '', operations: [] });
        setShowAddWorkerModal(false);
    };

    const toggleNewWorkerOperation = (operation) => {
        setNewWorker(prev => ({
            ...prev,
            operations: prev.operations.includes(operation)
                ? prev.operations.filter(op => op !== operation)
                : [...prev.operations, operation]
        }));
    };

    const getFilteredWorkers = () => {
        if (!selectedOperation) return workers.filter(w => w.status === 'Active');
        return workers.filter(w => w.status === 'Active' && w.operations.includes(selectedOperation));
    };

    const toggleBundleSelection = (bundleId) => {
        setSelectedBundles(prev =>
            prev.includes(bundleId) ? prev.filter(id => id !== bundleId) : [...prev, bundleId]
        );
    };

    const selectAllBundles = () => {
        const pendingBundles = bundles.filter(b => b.status === 'Pending').map(b => b.id);
        if (selectedBundles.length === pendingBundles.length) {
            setSelectedBundles([]);
        } else {
            setSelectedBundles(pendingBundles);
        }
    };

    const autoAssign = () => {
        if (!selectedOperation) return;
        const skilledWorkers = getFilteredWorkers();
        if (skilledWorkers.length === 0) return;

        const pendingBundles = bundles.filter(b => b.status === 'Pending');
        const updatedBundles = [...bundles];

        pendingBundles.forEach((bundle, idx) => {
            const workerIdx = idx % skilledWorkers.length;
            const bundleIdx = updatedBundles.findIndex(b => b.id === bundle.id);
            updatedBundles[bundleIdx] = { ...bundle, worker: skilledWorkers[workerIdx].name, status: 'In Progress' };
        });

        setBundles(updatedBundles);
        setSelectedBundles([]);
    };

    const getSelectedTotal = () => {
        const selected = bundles.filter(b => selectedBundles.includes(b.id));
        const pieces = selected.reduce((sum, b) => sum + b.pieces, 0);
        const rate = operationRates[selectedOperation] || 0;
        return { count: selected.length, pieces, earning: pieces * rate };
    };

    const NavButton = ({ icon: Icon, label, page, badge }) => (
        <button
            onClick={() => setCurrentPage(page)}
            className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-lg transition-colors text-xs ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
        >
            <div className="flex items-center gap-2">
                <Icon size={16} />
                <span className="font-medium">{label}</span>
            </div>
            {badge && <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{badge}</span>}
        </button>
    );

    // Attendance Modal
    const AttendanceModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Mark Attendance</h2>
                        <p className="text-xs text-gray-500">Today: {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                    </div>
                    <button onClick={() => setShowAttendanceModal(false)} className="p-1 hover:bg-gray-100 rounded">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4">
                    <button onClick={markAllPresent} className="w-full mb-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center gap-2 border border-green-200">
                        <UserCheck size={16} />
                        Mark All Present
                    </button>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {workers.filter(w => w.status === 'Active').map(w => (
                            <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                        {w.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">{w.name}</div>
                                        <div className="text-xs text-gray-500">{w.id}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleAttendance(w.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${attendance[w.id] === 'present' ? 'bg-green-500 text-white' :
                                        attendance[w.id] === 'absent' ? 'bg-red-500 text-white' :
                                            'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {attendance[w.id] === 'present' ? '✓ Present' : attendance[w.id] === 'absent' ? '✗ Absent' : 'Not Marked'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-2">
                    <button onClick={() => setShowAttendanceModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                    <button onClick={() => setShowAttendanceModal(false)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Attendance</button>
                </div>
            </div>
        </div>
    );

    const RateSettings = () => (
        <div className="space-y-4">
            <h1 className="text-lg font-bold text-gray-800">Operation Rate Settings</h1>
            <div className="bg-white rounded-lg shadow-md p-4">
                <p className="text-xs text-gray-500 mb-3">Click on any rate to edit.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(operationRates).map(([operation, rate]) => (
                        <div key={operation} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <span className="text-sm font-medium text-gray-700">{operation}</span>
                            {editingRate === operation ? (
                                <div className="flex items-center gap-1">
                                    <span className="text-sm">₹</span>
                                    <input type="number" step="0.01" defaultValue={rate} className="w-16 px-2 py-1 text-sm border rounded" onBlur={(e) => updateRate(operation, e.target.value)} autoFocus />
                                </div>
                            ) : (
                                <button onClick={() => setEditingRate(operation)} className="flex items-center gap-1 text-sm font-bold text-blue-600">
                                    ₹{rate.toFixed(2)} <Edit size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs rounded-lg flex items-center gap-2">
                    <Plus size={14} /> Add New Operation
                </button>
            </div>
        </div>
    );

    // Production-Level Work Assignment System
    const WorkAssignment = () => {
        // Local state for this component
        const [localBundles, setLocalBundles] = useState(bundles);
        const [activeWorker, setActiveWorker] = useState(null);
        const [activeOperation, setActiveOperation] = useState('');
        const [selectedBundleIds, setSelectedBundleIds] = useState([]);
        const [bundleJourneyModal, setBundleJourneyModal] = useState(null);
        const [scanInput, setScanInput] = useState('');
        const [filterProduction, setFilterProduction] = useState('');
        const [currentPage, setCurrentPageLocal] = useState(1);
        const [viewMode, setViewMode] = useState('kanban'); // 'table' or 'kanban'
        const bundlesPerPage = 15;

        // Get unique productions for filter
        const productions = [...new Set(localBundles.map(b => b.production))];

        // Get all operations
        const allOperations = Object.keys(operationRates);

        // Helper: Get bundles needing a specific operation (for Kanban columns)
        const getBundlesForOperation = (operation) => {
            return localBundles.filter(b =>
                !b.operationsCompleted[operation] && // Operation not done
                !b.currentWorker && // Not currently being worked on
                (filterProduction === '' || b.production === filterProduction)
            );
        };

        // Helper: Get bundles currently being worked on
        const getInProgressBundles = () => {
            return localBundles.filter(b => b.currentWorker);
        };

        // Helper: Get completed bundles (all operations done)
        const getCompletedBundles = () => {
            return localBundles.filter(b => {
                const doneCount = Object.keys(b.operationsCompleted).length;
                return doneCount >= allOperations.length && !b.currentWorker;
            });
        };

        // Helper: Check if bundle has operation that needs to be done
        const bundleNeedsOperation = (bundle, operation) => {
            return !bundle.operationsCompleted[operation] && bundle.currentOperation !== operation;
        };

        // Helper: Get bundles available for pickup by current worker/operation
        const getAvailableBundles = () => {
            if (!activeWorker || !activeOperation) return [];
            return localBundles.filter(b =>
                bundleNeedsOperation(b, activeOperation) &&
                !b.currentWorker &&
                (filterProduction === '' || b.production === filterProduction)
            );
        };

        // Helper: Get bundles currently with the active worker
        const getMyCurrentWork = () => {
            if (!activeWorker) return [];
            const worker = workers.find(w => w.id === activeWorker);
            return localBundles.filter(b => b.currentWorker === worker?.name);
        };

        // Helper: Get worker workload summary
        const getWorkerWorkload = (workerName) => {
            const currentWork = localBundles.filter(b => b.currentWorker === workerName);
            const completedToday = localBundles.reduce((count, b) => {
                return count + Object.values(b.operationsCompleted).filter(op => op.worker === workerName).length;
            }, 0);
            return { current: currentWork.length, completedOps: completedToday };
        };

        // Helper: Bundle status
        const getBundleStatus = (bundle) => {
            const totalOps = Object.keys(operationRates).length;
            const doneOps = Object.keys(bundle.operationsCompleted).length;
            if (bundle.currentWorker) return 'working';
            if (doneOps === 0) return 'new';
            if (doneOps >= totalOps - 1) return 'almost-done'; // Assuming some ops are required
            return 'in-progress';
        };

        // Pick up selected bundles
        const pickUpBundles = () => {
            if (!activeWorker || !activeOperation || selectedBundleIds.length === 0) return;
            const worker = workers.find(w => w.id === activeWorker);
            const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            setLocalBundles(prev => prev.map(b =>
                selectedBundleIds.includes(b.id)
                    ? { ...b, currentWorker: worker.name, currentOperation: activeOperation }
                    : b
            ));
            setSelectedBundleIds([]);
        };

        // Complete work on bundles - mark operation done and release bundle
        const completeMyWork = (bundleId) => {
            const worker = workers.find(w => w.id === activeWorker);
            const bundle = localBundles.find(b => b.id === bundleId);
            if (!bundle || !bundle.currentOperation) return;

            const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            setLocalBundles(prev => prev.map(b =>
                b.id === bundleId
                    ? {
                        ...b,
                        operationsCompleted: {
                            ...b.operationsCompleted,
                            [b.currentOperation]: { done: true, worker: worker.name, time: now }
                        },
                        currentWorker: null,
                        currentOperation: null,
                    }
                    : b
            ));
        };

        // Complete all my work
        const completeAllMyWork = () => {
            const myWork = getMyCurrentWork();
            myWork.forEach(b => completeMyWork(b.id));
        };

        // Toggle bundle selection
        const toggleBundleSelect = (bundleId) => {
            setSelectedBundleIds(prev =>
                prev.includes(bundleId)
                    ? prev.filter(id => id !== bundleId)
                    : [...prev, bundleId]
            );
        };

        // Select all visible bundles
        const selectAllVisible = () => {
            const available = getAvailableBundles();
            const visibleIds = available.slice((currentPage - 1) * bundlesPerPage, currentPage * bundlesPerPage).map(b => b.id);
            if (selectedBundleIds.length === visibleIds.length && visibleIds.every(id => selectedBundleIds.includes(id))) {
                setSelectedBundleIds([]);
            } else {
                setSelectedBundleIds(visibleIds);
            }
        };

        // Barcode scan handler
        const handleScan = (e) => {
            if (e.key === 'Enter' && scanInput.trim()) {
                const bundle = localBundles.find(b => b.id === scanInput.trim());
                if (bundle && activeWorker && activeOperation && bundleNeedsOperation(bundle, activeOperation) && !bundle.currentWorker) {
                    const worker = workers.find(w => w.id === activeWorker);
                    setLocalBundles(prev => prev.map(b =>
                        b.id === bundle.id
                            ? { ...b, currentWorker: worker.name, currentOperation: activeOperation }
                            : b
                    ));
                }
                setScanInput('');
            }
        };

        const availableBundles = getAvailableBundles();
        const myCurrentWork = getMyCurrentWork();
        const totalPages = Math.ceil(availableBundles.length / bundlesPerPage);
        const paginatedBundles = availableBundles.slice((currentPage - 1) * bundlesPerPage, currentPage * bundlesPerPage);
        const activeWorkerData = workers.find(w => w.id === activeWorker);

        return (
            <div className="space-y-4">
                {/* Header with Worker Selection */}
                <div className="bg-white rounded-xl p-4 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">📋 Work Assignment</h2>
                            <p className="text-xs text-gray-500">Assign bundles to workers for specific operations</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                                <span className="text-blue-600">Total Bundles:</span>
                                <span className="font-bold text-blue-800 ml-1">{localBundles.length}</span>
                            </div>
                            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
                                <span className="text-orange-600">Available:</span>
                                <span className="font-bold text-orange-800 ml-1">{localBundles.filter(b => !b.currentWorker).length}</span>
                            </div>
                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-0.5 ml-2">
                                <button
                                    onClick={() => setViewMode('kanban')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    📊 Kanban
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                    📋 Table
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Worker & Operation Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Assign To Worker</label>
                            <select
                                value={activeWorker || ''}
                                onChange={(e) => { setActiveWorker(e.target.value); setSelectedBundleIds([]); }}
                                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                            >
                                <option value="">Select Worker...</option>
                                {workers.filter(w => w.status === 'Active').map(w => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Operation dropdown - only needed for Table view */}
                        {viewMode === 'table' && (
                            <div>
                                <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">For Operation</label>
                                <select
                                    value={activeOperation}
                                    onChange={(e) => { setActiveOperation(e.target.value); setSelectedBundleIds([]); }}
                                    disabled={!activeWorker}
                                    className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 font-medium"
                                >
                                    <option value="">Select Operation...</option>
                                    {activeWorkerData?.operations.map(op => (
                                        <option key={op} value={op}>{op} (₹{operationRates[op]?.toFixed(2)})</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Quick Scan</label>
                            <div className="flex gap-1">
                                <input
                                    type="text"
                                    value={scanInput}
                                    onChange={(e) => setScanInput(e.target.value)}
                                    onKeyDown={handleScan}
                                    placeholder="Scan or enter bundle ID..."
                                    disabled={!activeWorker}
                                    className="flex-1 px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 font-mono"
                                />
                                <button className="px-3 py-2.5 bg-gray-100 border-2 border-gray-200 rounded-lg hover:bg-gray-200">
                                    <Barcode size={18} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-medium text-gray-500 uppercase mb-1">Filter Production</label>
                            <select
                                value={filterProduction}
                                onChange={(e) => setFilterProduction(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg"
                            >
                                <option value="">All Productions</option>
                                {productions.map(p => <option key={p} value={p}>#{p}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* KANBAN VIEW */}
                {viewMode === 'kanban' && (
                    <div className="space-y-4">
                        {/* Kanban Board */}
                        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '500px' }}>
                            {/* In Progress Column */}
                            <div className="min-w-[260px] max-w-[260px] bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl flex flex-col">
                                <div className="bg-blue-600 text-white rounded-t-lg px-3 py-2.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>🔄</span>
                                        <span className="font-semibold text-sm">In Progress</span>
                                    </div>
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{getInProgressBundles().length}</span>
                                </div>
                                <div className="p-2 space-y-2 overflow-y-auto flex-1 max-h-[420px]">
                                    {getInProgressBundles().length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-xs">
                                            <div className="text-2xl mb-1 opacity-40">📭</div>
                                            No bundles in progress
                                        </div>
                                    ) : (
                                        getInProgressBundles().map(bundle => (
                                            <div key={bundle.id} className="bg-white rounded-lg p-2.5 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="font-mono text-xs font-bold text-blue-600">{bundle.id}</span>
                                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{bundle.currentOperation}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-600 mb-1.5">{bundle.product} • {bundle.color}</div>
                                                <div className="text-[10px] text-gray-500 flex items-center gap-1 mb-2">
                                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                                                        {bundle.currentWorker?.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    {bundle.currentWorker}
                                                </div>
                                                {activeWorker && workers.find(w => w.id === activeWorker)?.name === bundle.currentWorker && (
                                                    <button
                                                        onClick={() => completeMyWork(bundle.id)}
                                                        className="w-full px-2 py-1.5 bg-green-600 text-white rounded text-[10px] font-semibold hover:bg-green-700"
                                                    >
                                                        ✓ Done
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Operation Columns */}
                            {allOperations.map(operation => {
                                const opBundles = getBundlesForOperation(operation);
                                const canPickUp = activeWorker && activeWorkerData?.operations.includes(operation);

                                return (
                                    <div key={operation} className="min-w-[260px] max-w-[260px] bg-gradient-to-b from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl flex flex-col">
                                        <div className="bg-orange-500 text-white rounded-t-lg px-3 py-2.5 flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <span>⏳</span>
                                                <span className="font-semibold text-xs truncate">{operation}</span>
                                            </div>
                                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{opBundles.length}</span>
                                        </div>
                                        <div className="p-2 space-y-2 overflow-y-auto flex-1 max-h-[420px]">
                                            {opBundles.length === 0 ? (
                                                <div className="text-center py-8 text-gray-400 text-xs">
                                                    <div className="text-2xl mb-1 opacity-40">✅</div>
                                                    All done
                                                </div>
                                            ) : (
                                                opBundles.slice(0, 10).map(bundle => {
                                                    const opsCount = Object.keys(bundle.operationsCompleted).length;
                                                    return (
                                                        <div key={bundle.id} className="bg-white rounded-lg p-2.5 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <span className="font-mono text-xs font-bold text-orange-700">{bundle.id}</span>
                                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{opsCount}/{allOperations.length} ops</span>
                                                            </div>
                                                            <div className="text-[10px] text-gray-600 mb-1.5">{bundle.product} • {bundle.color}</div>
                                                            <div className="text-[10px] text-gray-500 mb-2">Size {bundle.size} • {bundle.pieces} pcs</div>
                                                            {canPickUp ? (
                                                                <button
                                                                    onClick={() => {
                                                                        setActiveOperation(operation);
                                                                        const worker = workers.find(w => w.id === activeWorker);
                                                                        setLocalBundles(prev => prev.map(b =>
                                                                            b.id === bundle.id ? { ...b, currentWorker: worker.name, currentOperation: operation } : b
                                                                        ));
                                                                    }}
                                                                    className="w-full px-2 py-1.5 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700"
                                                                >
                                                                    📥 Assign
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setBundleJourneyModal(bundle)}
                                                                    className="w-full px-2 py-1.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium hover:bg-gray-200"
                                                                >
                                                                    👁 View Journey
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
                                            {opBundles.length > 10 && (
                                                <div className="text-center py-2 text-xs text-orange-600 font-medium">
                                                    + {opBundles.length - 10} more bundles
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Completed Column */}
                            <div className="min-w-[260px] max-w-[260px] bg-gradient-to-b from-green-50 to-green-100 border-2 border-green-200 rounded-xl flex flex-col">
                                <div className="bg-green-600 text-white rounded-t-lg px-3 py-2.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span>✅</span>
                                        <span className="font-semibold text-sm">Completed</span>
                                    </div>
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{getCompletedBundles().length}</span>
                                </div>
                                <div className="p-2 space-y-2 overflow-y-auto flex-1 max-h-[420px]">
                                    {getCompletedBundles().length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-xs">
                                            <div className="text-2xl mb-1 opacity-40">⏳</div>
                                            No completed bundles yet
                                        </div>
                                    ) : (
                                        getCompletedBundles().map(bundle => (
                                            <div key={bundle.id} className="bg-white rounded-lg p-2.5 border border-green-200 shadow-sm">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-mono text-xs font-bold text-green-700">{bundle.id}</span>
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">✓ All Done</span>
                                                </div>
                                                <div className="text-[10px] text-gray-600">{bundle.product} • {bundle.color} • {bundle.pieces} pcs</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Worker Workload Summary */}
                        <div className="bg-white rounded-xl p-4 border border-gray-100" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <h3 className="font-semibold text-sm text-gray-800 mb-3">👥 Worker Activity Today</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                                {workers.filter(w => w.status === 'Active').map(worker => {
                                    const workload = getWorkerWorkload(worker.name);
                                    return (
                                        <div key={worker.id} className={`p-3 rounded-lg border ${activeWorker === worker.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                                                    {worker.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="text-xs font-medium text-gray-800 truncate">{worker.name.split(' ')[0]}</div>
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                <span className="font-semibold text-blue-600">{workload.completedOps}</span> ops done
                                            </div>
                                            {workload.current > 0 && (
                                                <div className="text-[10px] text-orange-600 font-medium mt-1">{workload.current} active</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* TABLE VIEW */}
                {viewMode === 'table' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Left: Available Bundles Table (2 cols) */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-orange-50">
                                <div className="flex items-center gap-2">
                                    <span className="text-base">📦</span>
                                    <span className="font-semibold text-sm text-orange-800">Bundles Ready for {activeOperation || 'Your Operation'}</span>
                                    <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full">{availableBundles.length}</span>
                                </div>
                                {selectedBundleIds.length > 0 && (
                                    <button
                                        onClick={pickUpBundles}
                                        className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-1"
                                    >
                                        <Package size={14} /> Assign {selectedBundleIds.length} Bundles
                                    </button>
                                )}
                            </div>

                            {!activeWorker || !activeOperation ? (
                                <div className="p-8 text-center text-gray-400">
                                    <div className="text-4xl mb-3 opacity-50">👆</div>
                                    <p className="text-sm">Select a worker and operation above to see available bundles</p>
                                </div>
                            ) : availableBundles.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <div className="text-4xl mb-3 opacity-50">✅</div>
                                    <p className="text-sm">No bundles waiting for {activeOperation}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                                        <table className="w-full text-xs">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-3 py-2 text-left">
                                                        <input
                                                            type="checkbox"
                                                            onChange={selectAllVisible}
                                                            checked={paginatedBundles.length > 0 && paginatedBundles.every(b => selectedBundleIds.includes(b.id))}
                                                            className="rounded"
                                                        />
                                                    </th>
                                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Bundle ID</th>
                                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Prod</th>
                                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Product</th>
                                                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Color</th>
                                                    <th className="px-3 py-2 text-center font-semibold text-gray-600">Size</th>
                                                    <th className="px-3 py-2 text-center font-semibold text-gray-600">Pcs</th>
                                                    <th className="px-3 py-2 text-center font-semibold text-gray-600">Ops Done</th>
                                                    <th className="px-3 py-2 text-center font-semibold text-gray-600">Journey</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {paginatedBundles.map((bundle) => {
                                                    const opsCount = Object.keys(bundle.operationsCompleted).length;
                                                    const totalOps = Object.keys(operationRates).length;
                                                    return (
                                                        <tr key={bundle.id} className={`hover:bg-blue-50/50 transition-colors ${selectedBundleIds.includes(bundle.id) ? 'bg-blue-50' : ''}`}>
                                                            <td className="px-3 py-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedBundleIds.includes(bundle.id)}
                                                                    onChange={() => toggleBundleSelect(bundle.id)}
                                                                    className="rounded"
                                                                />
                                                            </td>
                                                            <td className="px-3 py-2 font-mono font-bold text-blue-600">{bundle.id}</td>
                                                            <td className="px-3 py-2 text-gray-500">#{bundle.production}</td>
                                                            <td className="px-3 py-2 text-gray-800">{bundle.product}</td>
                                                            <td className="px-3 py-2 text-gray-800">{bundle.color}</td>
                                                            <td className="px-3 py-2 text-center text-gray-800">{bundle.size}</td>
                                                            <td className="px-3 py-2 text-center font-semibold">{bundle.pieces}</td>
                                                            <td className="px-3 py-2 text-center">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${opsCount === 0 ? 'bg-gray-100 text-gray-600' : opsCount >= totalOps - 2 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    {opsCount}/{totalOps}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2 text-center">
                                                                <button
                                                                    onClick={() => setBundleJourneyModal(bundle)}
                                                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                                            <span className="text-xs text-gray-500">
                                                Showing {(currentPage - 1) * bundlesPerPage + 1} - {Math.min(currentPage * bundlesPerPage, availableBundles.length)} of {availableBundles.length}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setCurrentPageLocal(p => Math.max(1, p - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1 border rounded text-xs disabled:opacity-50"
                                                >
                                                    Prev
                                                </button>
                                                <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs">{currentPage}/{totalPages}</span>
                                                <button
                                                    onClick={() => setCurrentPageLocal(p => Math.min(totalPages, p + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1 border rounded text-xs disabled:opacity-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Right Column: My Work + Worker Stats */}
                        <div className="space-y-4">
                            {/* My Current Work */}
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-blue-50">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🔄</span>
                                        <span className="font-semibold text-sm text-blue-800">My Current Work</span>
                                        <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{myCurrentWork.length}</span>
                                    </div>
                                    {myCurrentWork.length > 0 && (
                                        <button
                                            onClick={completeAllMyWork}
                                            className="px-3 py-1 bg-green-600 text-white text-[10px] font-semibold rounded-lg hover:bg-green-700"
                                        >
                                            ✓ Complete All
                                        </button>
                                    )}
                                </div>
                                <div className="p-2 max-h-[200px] overflow-y-auto space-y-2">
                                    {myCurrentWork.length === 0 ? (
                                        <div className="py-6 text-center text-gray-400 text-xs">
                                            <div className="text-2xl mb-1 opacity-50">📭</div>
                                            No work in progress
                                        </div>
                                    ) : (
                                        myCurrentWork.map(bundle => (
                                            <div key={bundle.id} className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex items-center justify-between">
                                                <div>
                                                    <div className="font-mono font-bold text-blue-700 text-sm">{bundle.id}</div>
                                                    <div className="text-[10px] text-gray-600">{bundle.product} • {bundle.color} • {bundle.pieces} pcs</div>
                                                    <div className="text-[10px] text-blue-600 font-medium mt-0.5">→ {bundle.currentOperation}</div>
                                                </div>
                                                <button
                                                    onClick={() => completeMyWork(bundle.id)}
                                                    className="px-2.5 py-1.5 bg-green-600 text-white text-[10px] font-semibold rounded-lg hover:bg-green-700"
                                                >
                                                    ✓ Done
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Worker Workload */}
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <span className="font-semibold text-sm text-gray-800">👥 Today's Workload</span>
                                </div>
                                <div className="p-2 space-y-2 max-h-[200px] overflow-y-auto">
                                    {workers.filter(w => w.status === 'Active').map(worker => {
                                        const workload = getWorkerWorkload(worker.name);
                                        const maxOps = 50; // For progress bar
                                        return (
                                            <div key={worker.id} className={`p-2 rounded-lg border ${activeWorker === worker.id ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                                                            {worker.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-800">{worker.name}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-500">{workload.completedOps} ops done</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all"
                                                            style={{ width: `${Math.min(100, (workload.completedOps / maxOps) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                    {workload.current > 0 && (
                                                        <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">{workload.current} active</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bundle Journey Modal */}
                {bundleJourneyModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-[500px] overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">Bundle Journey: {bundleJourneyModal.id}</h3>
                                    <p className="text-xs text-gray-500">{bundleJourneyModal.product} • {bundleJourneyModal.color} • {bundleJourneyModal.pieces} pieces</p>
                                </div>
                                <button onClick={() => setBundleJourneyModal(null)} className="text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-4 max-h-[400px] overflow-y-auto">
                                <div className="space-y-2">
                                    {Object.keys(operationRates).map((op) => {
                                        const completed = bundleJourneyModal.operationsCompleted[op];
                                        const isCurrent = bundleJourneyModal.currentOperation === op;
                                        return (
                                            <div key={op} className={`flex items-center gap-3 p-3 rounded-lg border ${completed ? 'bg-green-50 border-green-200' : isCurrent ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${completed ? 'bg-green-500 text-white' : isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                    {completed ? '✓' : isCurrent ? '→' : '○'}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-sm font-medium ${completed ? 'text-green-800' : isCurrent ? 'text-blue-800' : 'text-gray-500'}`}>{op}</div>
                                                    {completed ? (
                                                        <div className="text-xs text-green-600">
                                                            {completed.worker} • {completed.time}
                                                        </div>
                                                    ) : isCurrent ? (
                                                        <div className="text-xs text-blue-600">
                                                            {bundleJourneyModal.currentWorker} • In Progress
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-gray-400">Waiting</div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400">₹{operationRates[op]?.toFixed(2)}/pc</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };



    const [completionData, setCompletionData] = useState({});

    const inProgressBundles = bundles.filter(b => b.status === 'In Progress');

    const handleCompletionChange = (bundleId, field, value) => {
        setCompletionData(prev => ({
            ...prev,
            [bundleId]: { ...prev[bundleId], [field]: value }
        }));
    };

    const markComplete = (bundleId, isPartial = false) => {
        const bundle = bundles.find(b => b.id === bundleId);
        const completed = isPartial ? (completionData[bundleId]?.completedPieces || 0) : bundle.pieces;

        setBundles(prev => prev.map(b => {
            if (b.id === bundleId) {
                if (isPartial && completed < b.pieces) {
                    return { ...b, completedPieces: completed, status: 'Partial' };
                }
                return { ...b, completedPieces: b.pieces, status: 'Completed' };
            }
            return b;
        }));
        setCompletionData(prev => ({ ...prev, [bundleId]: {} }));
    };

    const WorkCompletion = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-gray-800">Work Completion</h1>
                <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                        {inProgressBundles.length} In Progress
                    </span>
                </div>
            </div>

            {/* Quick Scan Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Quick Scan Bundle Barcode</label>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Enter or scan bundle barcode..." className="flex-1 px-3 py-2 text-sm border rounded-lg" />
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs rounded-lg flex items-center gap-1"><Barcode size={14} /> Scan</button>
                    </div>
                </div>
            </div>

            {/* Assigned Work List */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">Assigned Work - Pending Completion</h2>

                {inProgressBundles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <CheckCircle size={40} className="mx-auto mb-2 text-green-300" />
                        <p className="text-sm">No pending work! All bundles completed.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {inProgressBundles.map(bundle => (
                            <div key={bundle.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    {/* Bundle Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold text-gray-900">{bundle.id}</span>
                                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">In Progress</span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                            <div><span className="text-gray-500">Product:</span> <span className="font-medium">{bundle.product}</span></div>
                                            <div><span className="text-gray-500">Color:</span> <span className="font-medium">{bundle.color}</span></div>
                                            <div><span className="text-gray-500">Size:</span> <span className="font-medium">{bundle.size}</span></div>
                                            <div><span className="text-gray-500">Total Pieces:</span> <span className="font-bold text-blue-600">{bundle.pieces}</span></div>
                                        </div>
                                        <div className="mt-2 text-xs">
                                            <span className="text-gray-500">Worker:</span> <span className="font-medium text-gray-800">{bundle.worker}</span>
                                        </div>
                                    </div>

                                    {/* Completion Actions */}
                                    <div className="flex flex-col gap-2 min-w-[160px]">
                                        <button
                                            onClick={() => markComplete(bundle.id, false)}
                                            className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 flex items-center justify-center gap-1"
                                        >
                                            <CheckCircle size={14} /> Complete All ({bundle.pieces})
                                        </button>

                                        {/* Partial Completion */}
                                        <div className="flex gap-1">
                                            <input
                                                type="number"
                                                min="1"
                                                max={bundle.pieces}
                                                placeholder="Qty"
                                                value={completionData[bundle.id]?.completedPieces || ''}
                                                onChange={(e) => handleCompletionChange(bundle.id, 'completedPieces', parseInt(e.target.value) || 0)}
                                                className="w-16 px-2 py-1.5 text-xs border rounded-lg text-center"
                                            />
                                            <button
                                                onClick={() => markComplete(bundle.id, true)}
                                                disabled={!completionData[bundle.id]?.completedPieces}
                                                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${completionData[bundle.id]?.completedPieces
                                                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                Partial
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Quality Check */}
                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4">
                                    <span className="text-xs text-gray-600">Quality:</span>
                                    <label className="flex items-center gap-1 cursor-pointer text-xs">
                                        <input type="radio" name={`quality-${bundle.id}`} value="pass" defaultChecked className="w-3 h-3 text-green-600" />
                                        <span className="text-green-700 font-medium">✓ Pass</span>
                                    </label>
                                    <label className="flex items-center gap-1 cursor-pointer text-xs">
                                        <input type="radio" name={`quality-${bundle.id}`} value="fail" className="w-3 h-3 text-red-600" />
                                        <span className="text-red-700 font-medium">✗ Rework</span>
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between text-xs">
                <div className="flex gap-4">
                    <span><span className="text-gray-500">Total In Progress:</span> <b>{inProgressBundles.length}</b> bundles</span>
                    <span><span className="text-gray-500">Total Pieces:</span> <b>{inProgressBundles.reduce((sum, b) => sum + b.pieces, 0)}</b></span>
                </div>
            </div>
        </div>
    );

    const [reportView, setReportView] = useState('daily'); // 'daily' or 'weekly'
    const [workerPayments, setWorkerPayments] = useState({}); // Track paid amounts per worker

    // Calculate wages from completed work
    const completedBundles = bundles.filter(b => b.status === 'Completed' || b.status === 'Partial');

    const getWorkerWages = () => {
        const wages = {};
        workers.forEach(w => {
            wages[w.name] = { bundles: 0, pieces: 0, amount: 0 };
        });

        completedBundles.forEach(bundle => {
            if (bundle.worker && wages[bundle.worker]) {
                const pieces = bundle.completedPieces || bundle.pieces;
                const avgRate = Object.values(operationRates).reduce((a, b) => a + b, 0) / Object.keys(operationRates).length;
                wages[bundle.worker].bundles += 1;
                wages[bundle.worker].pieces += pieces;
                wages[bundle.worker].amount += pieces * avgRate;
            }
        });
        return wages;
    };

    const updatePayment = (workerId, amount) => {
        setWorkerPayments(prev => ({ ...prev, [workerId]: parseFloat(amount) || 0 }));
    };

    const payFullBalance = (workerId, earnings) => {
        setWorkerPayments(prev => ({ ...prev, [workerId]: earnings }));
    };

    const workerWages = getWorkerWages();
    const totalWages = Object.values(workerWages).reduce((sum, w) => sum + w.amount, 0);
    const totalPieces = Object.values(workerWages).reduce((sum, w) => sum + w.pieces, 0);
    const totalPaid = Object.values(workerPayments).reduce((sum, p) => sum + p, 0);
    const totalBalance = totalWages - totalPaid;

    const WageReport = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-gray-800">Wage Report</h1>
                <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-gray-200 rounded-lg p-0.5">
                        <button
                            onClick={() => setReportView('daily')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${reportView === 'daily' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setReportView('weekly')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${reportView === 'weekly' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                        >
                            Weekly
                        </button>
                    </div>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-1.5 text-sm border rounded-lg" />
                    <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg flex items-center gap-1"><Printer size={14} /> Print</button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg flex items-center gap-1"><Download size={14} /> Export</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg shadow p-3">
                    <div className="text-xs text-gray-500">Total Workers</div>
                    <div className="text-xl font-bold text-gray-800">{workers.filter(w => w.status === 'Active').length}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                    <div className="text-xs text-gray-500">Bundles Completed</div>
                    <div className="text-xl font-bold text-blue-600">{completedBundles.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                    <div className="text-xs text-gray-500">Total Pieces</div>
                    <div className="text-xl font-bold text-gray-800">{totalPieces}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-3">
                    <div className="text-xs text-gray-500">Total Wages</div>
                    <div className="text-xl font-bold text-green-600">₹{totalWages.toFixed(2)}</div>
                </div>
            </div>

            {/* Worker-wise Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-3">
                    {reportView === 'daily' ? 'Today\'s Earnings by Worker' : 'Weekly Earnings by Worker'}
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Worker</th>
                                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Attendance</th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Bundles</th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Pieces</th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Earnings</th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Paid</th>
                                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Balance</th>
                                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {workers.filter(w => w.status === 'Active').map(worker => {
                                const wage = workerWages[worker.name] || { bundles: 0, pieces: 0, amount: 0 };
                                const earnings = wage.amount;
                                const paid = workerPayments[worker.id] || 0;
                                const balance = Math.max(0, earnings - paid);

                                return (
                                    <tr key={worker.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                                    {worker.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{worker.name}</div>
                                                    <div className="text-xs text-gray-500">{worker.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${attendance[worker.id] === 'present' ? 'bg-green-100 text-green-700' :
                                                attendance[worker.id] === 'absent' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>
                                                {attendance[worker.id] === 'present' ? 'Present' : attendance[worker.id] === 'absent' ? 'Absent' : '—'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right text-gray-700">{wage.bundles}</td>
                                        <td className="px-3 py-2 text-right text-gray-700">{wage.pieces}</td>
                                        <td className="px-3 py-2 text-right font-bold text-green-600">₹{earnings.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-gray-500">₹</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={earnings}
                                                    step="0.01"
                                                    value={paid || ''}
                                                    onChange={(e) => updatePayment(worker.id, e.target.value)}
                                                    placeholder="0.00"
                                                    className="w-20 px-2 py-1 text-xs border rounded text-right focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-right font-semibold text-orange-600">₹{balance.toFixed(2)}</td>
                                        <td className="px-3 py-2 text-center">
                                            <button
                                                onClick={() => payFullBalance(worker.id, earnings)}
                                                disabled={balance === 0}
                                                className={`px-2 py-1 rounded text-xs font-medium ${balance > 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                            >
                                                {balance > 0 ? 'Pay Balance' : '✓ Paid'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-bold">
                                <td className="px-3 py-2" colSpan={2}>Total</td>
                                <td className="px-3 py-2 text-right">{completedBundles.length}</td>
                                <td className="px-3 py-2 text-right">{totalPieces}</td>
                                <td className="px-3 py-2 text-right text-green-600">₹{totalWages.toFixed(2)}</td>
                                <td className="px-3 py-2 text-right">₹{totalPaid.toFixed(2)}</td>
                                <td className="px-3 py-2 text-right text-orange-600">₹{totalBalance.toFixed(2)}</td>
                                <td className="px-3 py-2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Completed Work Details */}
            {completedBundles.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-sm font-semibold text-gray-800 mb-3">Completed Work Details</h2>
                    <div className="space-y-2">
                        {completedBundles.map(bundle => (
                            <div key={bundle.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-800">{bundle.id}</span>
                                    <span className="text-gray-600">{bundle.product} | {bundle.color} | Size {bundle.size}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-xs ${bundle.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {bundle.status === 'Completed' ? '✓ Complete' : `Partial (${bundle.completedPieces}/${bundle.pieces})`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-600">Worker: <b>{bundle.worker}</b></span>
                                    <span className="font-bold text-green-600">₹{((bundle.completedPieces || bundle.pieces) * 0.30).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {completedBundles.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-sm text-yellow-700">
                    ⚠️ No completed work yet. Complete some bundles in the Work Completion page to see wages here.
                </div>
            )}
        </div>
    );

    // Workers Management with Attendance
    const WorkersManagement = () => (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Workers</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowAttendanceModal(true)} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center gap-1.5 transition-colors">
                        <ClipboardCheck size={14} /> Mark Attendance
                    </button>
                    <button
                        onClick={() => setShowAddWorkerModal(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                    >
                        <Plus size={14} /> Add Worker
                    </button>
                </div>
            </div>

            {/* Add Worker Modal */}
            {showAddWorkerModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[500px] overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Add New Worker</h3>
                                <p className="text-xs text-gray-500">Enter worker details and select their skills</p>
                            </div>
                            <button onClick={() => { setShowAddWorkerModal(false); setNewWorker({ name: '', phone: '', operations: [] }); }} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Worker Name *</label>
                                <input
                                    type="text"
                                    value={newWorker.name}
                                    onChange={(e) => setNewWorker(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter full name..."
                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={newWorker.phone}
                                    onChange={(e) => setNewWorker(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="9876543210"
                                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            {/* Operations/Skills */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Operations / Skills</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.keys(operationRates).map(op => (
                                        <label
                                            key={op}
                                            className={`flex items-center gap-2 p-2.5 border-2 rounded-lg cursor-pointer transition-colors ${newWorker.operations.includes(op)
                                                ? 'bg-blue-50 border-blue-400 text-blue-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newWorker.operations.includes(op)}
                                                onChange={() => toggleNewWorkerOperation(op)}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-xs font-medium">{op}</span>
                                            <span className="text-[10px] text-gray-500 ml-auto">₹{operationRates[op].toFixed(2)}</span>
                                        </label>
                                    ))}
                                </div>
                                {newWorker.operations.length > 0 && (
                                    <div className="mt-2 text-[10px] text-blue-600">
                                        Selected: {newWorker.operations.length} operation(s)
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                            <button
                                onClick={() => { setShowAddWorkerModal(false); setNewWorker({ name: '', phone: '', operations: [] }); }}
                                className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addNewWorker}
                                disabled={!newWorker.name.trim() || !newWorker.phone.trim()}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Worker
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Workers</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{workers.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Present Today</div>
                    <div className="text-xl font-bold text-green-700 mt-1">{Object.values(attendance).filter(a => a === 'present').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-100 bg-red-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-red-600">Absent Today</div>
                    <div className="text-xl font-bold text-red-700 mt-1">{Object.values(attendance).filter(a => a === 'absent').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100 bg-blue-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-blue-600">Active Workers</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">{workers.filter(w => w.status === 'Active').length}</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search workers..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                </div>
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>

            {/* Workers Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">ID</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Name</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Phone</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Operations</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Today</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workers.map(w => (
                            <tr key={w.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-3 font-mono text-blue-600 font-medium">{w.id}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">{w.name.split(' ').map(n => n[0]).join('')}</div>
                                        <span className="font-medium text-gray-900">{w.name}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-gray-600 font-mono">{w.phone}</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {w.operations.slice(0, 2).map((op, i) => (<span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-medium">{op}</span>))}
                                        {w.operations.length > 2 && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-medium">+{w.operations.length - 2}</span>}
                                    </div>
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => toggleAttendance(w.id)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${attendance[w.id] === 'present' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                                            attendance[w.id] === 'absent' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                                                'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        {attendance[w.id] === 'present' ? '✓ Present' : attendance[w.id] === 'absent' ? '✗ Absent' : '— Not Marked'}
                                    </button>
                                </td>
                                <td className="p-3 text-center">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${w.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{w.status}</span>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-1">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View"><Eye size={14} /></button>
                                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Edit"><Edit size={14} /></button>
                                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Table Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Showing {workers.length} workers</span>
                    <div className="flex items-center gap-2">
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Previous</button>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">1</button>
                        <button className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 hover:bg-white">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Tab navigation for embedded mode
    const TabNav = () => (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg mb-4">
            {[
                { icon: Users, label: 'Workers', page: 'workers' },
                { icon: Package, label: 'Work Assignment', page: 'assignment' },
                { icon: CheckCircle, label: 'Work Completion', page: 'completion' },
                { icon: FileText, label: 'Wage Report', page: 'wage-report' },
                { icon: Settings, label: 'Rate Settings', page: 'settings' },
            ].map(item => (
                <button
                    key={item.page}
                    onClick={() => setCurrentPage(item.page)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${currentPage === item.page
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    <item.icon size={14} />
                    {item.label}
                </button>
            ))}
        </div>
    );

    // If embedded in main app, don't show sidebar
    if (embedded) {
        return (
            <div className="text-sm">
                {showAttendanceModal && <AttendanceModal />}
                <TabNav />
                {currentPage === 'workers' && <WorkersManagement />}
                {currentPage === 'assignment' && <WorkAssignment />}
                {currentPage === 'completion' && <WorkCompletion />}
                {currentPage === 'wage-report' && <WageReport />}
                {currentPage === 'settings' && <RateSettings />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex text-sm">
            {showAttendanceModal && <AttendanceModal />}
            <aside className="w-56 bg-white shadow-lg p-4 space-y-1">
                <div className="mb-6">
                    <h2 className="text-base font-bold text-gray-800">Worker Wage</h2>
                    <p className="text-xs text-gray-500">Management System</p>
                </div>
                <NavButton icon={Users} label="Workers" page="workers" />
                <NavButton icon={Package} label="Work Assignment" page="assignment" />
                <NavButton icon={CheckCircle} label="Work Completion" page="completion" />
                <NavButton icon={FileText} label="Wage Report" page="wage-report" />
                <NavButton icon={Settings} label="Rate Settings" page="settings" />
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                {currentPage === 'workers' && <WorkersManagement />}
                {currentPage === 'assignment' && <WorkAssignment />}
                {currentPage === 'completion' && <WorkCompletion />}
                {currentPage === 'wage-report' && <WageReport />}
                {currentPage === 'settings' && <RateSettings />}
            </main>
        </div>
    );
};

export default WorkerWageSystem;
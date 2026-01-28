import React, { useState } from 'react';
import { Printer, ArrowRight, CheckCircle, Search, User, Clock, Package } from 'lucide-react';
import { useBundles } from './contexts/BundleContext';

const PrintingSystem = ({ embedded = false }) => {
    const { bundles, moveBundle } = useBundles();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBundles, setSelectedBundles] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('all');

    // Printing Workers (In-house factory workers)
    const [workers] = useState([
        { id: 'PW-001', name: 'Raju', specialty: 'Screen Printing', status: 'Active' },
        { id: 'PW-002', name: 'Santosh', specialty: 'Transfer Printing', status: 'Active' },
        { id: 'PW-003', name: 'Dinesh', specialty: 'Digital Printing', status: 'Active' },
    ]);

    // Track worker assignments and work status
    const [bundleWorkerMap, setBundleWorkerMap] = useState({});
    const [bundleStatusMap, setBundleStatusMap] = useState({}); // 'assigned', 'in-progress', 'completed'

    // Filter bundles for Printing stage
    const printingBundles = bundles.filter(b => b.stage === 'Printing');

    // Filter by search and worker
    const filteredBundles = printingBundles.filter(b => {
        const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.production.includes(searchTerm);
        const matchesWorker = selectedWorker === 'all' || bundleWorkerMap[b.id] === selectedWorker;
        return matchesSearch && matchesWorker;
    });

    const handleAssignWorker = (bundleId, workerId) => {
        setBundleWorkerMap(prev => ({ ...prev, [bundleId]: workerId }));
        if (workerId) {
            setBundleStatusMap(prev => ({ ...prev, [bundleId]: 'assigned' }));
        }
    };

    const handleStartWork = (bundleId) => {
        setBundleStatusMap(prev => ({ ...prev, [bundleId]: 'in-progress' }));
    };

    const handleCompleteWork = (bundleId) => {
        setBundleStatusMap(prev => ({ ...prev, [bundleId]: 'completed' }));
    };

    const handleSendToSewing = (bundleId) => {
        moveBundle(bundleId, 'Sewing Floor');
        // Clean up maps
        setBundleWorkerMap(prev => {
            const newMap = { ...prev };
            delete newMap[bundleId];
            return newMap;
        });
        setBundleStatusMap(prev => {
            const newMap = { ...prev };
            delete newMap[bundleId];
            return newMap;
        });
    };

    const handleBatchSend = () => {
        selectedBundles.forEach(id => {
            if (bundleStatusMap[id] === 'completed') {
                handleSendToSewing(id);
            }
        });
        setSelectedBundles([]);
    };

    const toggleSelection = (id) => {
        setSelectedBundles(prev =>
            prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
        );
    };

    const getWorkerBundleCount = (workerId) => {
        return Object.values(bundleWorkerMap).filter(w => w === workerId).length;
    };

    const getWorkerName = (workerId) => {
        const worker = workers.find(w => w.id === workerId);
        return worker ? worker.name : '';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'assigned':
                return <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold border border-blue-100">Assigned</span>;
            case 'in-progress':
                return <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-[10px] font-bold border border-amber-100">In Progress</span>;
            case 'completed':
                return <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-[10px] font-bold border border-green-100">Completed</span>;
            default:
                return <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded text-[10px] font-bold border border-gray-100">Pending</span>;
        }
    };

    return (
        <div className={`flex flex-col h-screen bg-slate-50 ${embedded ? '-m-4' : ''}`}>
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">

                        Printing Station
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-amber-50 rounded-lg px-3 py-1.5 flex items-center gap-2 border border-amber-100">
                        <Clock size={14} className="text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700">In Queue:</span>
                        <span className="text-sm font-bold text-amber-800">{printingBundles.length}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
                {/* Printing Workers Cards */}
                <div className="grid grid-cols-3 gap-4">
                    {workers.map(worker => (
                        <div
                            key={worker.id}
                            className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${selectedWorker === worker.id ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200'
                                }`}
                            onClick={() => setSelectedWorker(selectedWorker === worker.id ? 'all' : worker.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="bg-amber-50 p-2 rounded-lg">
                                    <User size={20} className="text-amber-600" />
                                </div>
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {getWorkerBundleCount(worker.id)} Assigned
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-800 text-sm">{worker.name}</h3>
                            <p className="text-xs text-slate-500">{worker.specialty}</p>
                            <div className="mt-2 flex gap-3 text-xs">
                                <span className={`font-medium ${worker.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                                    {worker.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions & Filters */}
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search bundle ID or production #..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
                        />
                    </div>
                    {selectedWorker !== 'all' && (
                        <button
                            onClick={() => setSelectedWorker('all')}
                            className="text-xs text-slate-500 hover:text-slate-700 underline"
                        >
                            Clear Filter
                        </button>
                    )}
                    {selectedBundles.filter(id => bundleStatusMap[id] === 'completed').length > 0 && (
                        <button
                            onClick={handleBatchSend}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Package size={16} />
                            Send {selectedBundles.filter(id => bundleStatusMap[id] === 'completed').length} to Sewing
                        </button>
                    )}
                </div>

                {/* Bundles Grid */}
                {filteredBundles.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Printer size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-medium">No bundles in Printing</h3>
                        <p className="text-slate-500 text-sm mt-1">Bundles will appear here after Cutting stage.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredBundles.map(bundle => {
                            const status = bundleStatusMap[bundle.id];
                            const assignedWorker = bundleWorkerMap[bundle.id];

                            return (
                                <div
                                    key={bundle.id}
                                    className={`bg-white rounded-xl border p-4 transition-all hover:shadow-md ${selectedBundles.includes(bundle.id)
                                        ? 'border-amber-500 ring-1 ring-amber-500 shadow-sm'
                                        : 'border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedBundles.includes(bundle.id)}
                                                onChange={() => toggleSelection(bundle.id)}
                                                className="rounded text-amber-600 focus:ring-amber-500/20"
                                            />
                                            <div>
                                                <span className="block font-mono font-bold text-slate-800">{bundle.id}</span>
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Prod #{bundle.production}</span>
                                            </div>
                                        </div>
                                        {getStatusBadge(status)}
                                    </div>

                                    {/* Worker Assignment */}
                                    <div className="mb-3">
                                        <label className="block text-[10px] text-slate-400 mb-1 uppercase">Assign Worker</label>
                                        <select
                                            value={assignedWorker || ''}
                                            onChange={(e) => handleAssignWorker(bundle.id, e.target.value)}
                                            disabled={status === 'in-progress' || status === 'completed'}
                                            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-amber-500/20 disabled:bg-gray-50"
                                        >
                                            <option value="">-- Select Worker --</option>
                                            {workers.map(w => (
                                                <option key={w.id} value={w.id}>{w.name} ({w.specialty})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="text-slate-400 block text-[9px]">Product</span>
                                            <span className="font-medium text-slate-700">{bundle.product || 'Track Pants'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="text-slate-400 block text-[9px]">Color</span>
                                            <span className="font-medium text-slate-700">{bundle.colour}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="text-slate-400 block text-[9px]">Size</span>
                                            <span className="font-medium text-slate-700">{bundle.size}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="text-slate-400 block text-[9px]">Pieces</span>
                                            <span className="font-medium text-slate-700">{bundle.pieces}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                                        <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                            <span className="text-blue-500 block text-[9px]">Weight</span>
                                            <span className="font-medium text-blue-700">{bundle.nw} kg / {bundle.meters || (bundle.nw * 1.68).toFixed(1)} m</span>
                                        </div>
                                        <div className="bg-purple-50 p-2 rounded border border-purple-100">
                                            <span className="text-purple-500 block text-[9px]">Source Roll</span>
                                            <span className="font-medium text-purple-700 text-[10px]">{bundle.sourceRollId || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons based on status */}
                                    {!assignedWorker && (
                                        <div className="text-center py-2 text-xs text-slate-400">
                                            Assign a worker to start
                                        </div>
                                    )}

                                    {assignedWorker && status === 'assigned' && (
                                        <button
                                            onClick={() => handleStartWork(bundle.id)}
                                            className="w-full py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
                                        >
                                            Start Printing
                                        </button>
                                    )}

                                    {status === 'in-progress' && (
                                        <button
                                            onClick={() => handleCompleteWork(bundle.id)}
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            Mark Printing Complete
                                        </button>
                                    )}

                                    {status === 'completed' && (
                                        <button
                                            onClick={() => handleSendToSewing(bundle.id)}
                                            className="w-full py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>Send to Sewing Floor</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrintingSystem;

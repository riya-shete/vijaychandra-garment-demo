import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, ChevronRight, ChevronLeft, X, Check, Printer, Layers, Scissors, Box, CheckCircle, Clock, ArrowRight, Download, FileText, Upload, Trash2, Filter, BarChart3, AlertCircle } from 'lucide-react';
import { useBundles } from './contexts/BundleContext';

const ProductionSystem = ({ embedded = false }) => {
    const [currentPage, setCurrentPage] = useState('cotton-rolls');
    const [showWizard, setShowWizard] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [selectedProduction, setSelectedProduction] = useState(null);

    // Modal states
    const [showAddRollModal, setShowAddRollModal] = useState(false);
    const [showBulkImportModal, setShowBulkImportModal] = useState(false);
    const [showAddJobOrderModal, setShowAddJobOrderModal] = useState(false);
    const [showNewPallaModal, setShowNewPallaModal] = useState(false);
    const [showPallaModal, setShowPallaModal] = useState(false);

    // Constants
    const STANDARD_SIZES = ['20', '22', '24', '26', '28', '30', '32', '34', '36', '38'];
    const STANDARD_COLORS = ['Black', 'Navy', 'D. Grey', 'L. Grey', 'White', 'Maroon', 'Red', 'Green'];
    const CLOTH_TYPES = ['Terry Cotton', 'Fleece', 'Interlock', 'Rib', '2-Way Zuric'];
    const KG_TO_METER = 50; // 1 kg ≈ 50 meters
    const ROLLS_PER_PAGE = 25;

    // Filter states
    const [rollFilters, setRollFilters] = useState({ search: '', vendor: '', color: '', status: '' });
    const [rollPage, setRollPage] = useState(1);

    // ==================== JOB ORDERS ====================
    const [jobOrders, setJobOrders] = useState([
        {
            id: 'JO2228',
            date: '19-12-2025',
            partyName: 'Direct',
            styleName: 'RAFTAAR KIDS',
            remarks: '2 WAY ZURIC',
            items: STANDARD_COLORS.slice(0, 3).flatMap(color =>
                STANDARD_SIZES.map(size => ({ color, size, qty: 50 }))
            ),
            grandTotal: 1500,
            status: 'In Progress',
            linkedCuttingSheet: '7507'
        },
        {
            id: 'JO2229',
            date: '20-01-2026',
            partyName: 'Speedo Sports',
            styleName: 'SPEEDO TRACK',
            remarks: 'Premium Quality',
            items: STANDARD_COLORS.slice(0, 2).flatMap(color =>
                STANDARD_SIZES.slice(0, 5).map(size => ({ color, size, qty: 40 }))
            ),
            grandTotal: 400,
            status: 'Pending',
            linkedCuttingSheet: null
        }
    ]);

    const [newJobOrder, setNewJobOrder] = useState({
        partyName: '',
        styleName: '',
        remarks: '',
        colors: [],
        qtyPerSize: 50
    });

    // ==================== COTTON ROLLS (Scalable for 100+) ====================
    const generateSampleRolls = () => {
        const vendors = ['ABC Textiles', 'XYZ Mills', 'PQR Fabrics', 'RST Cotton', 'Sunrise Mills'];
        const clothTypes = ['Terry Cotton', 'Fleece', '2-Way Zuric', 'Interlock', 'Rib'];
        const rolls = [];

        for (let i = 1; i <= 50; i++) {
            const weight = 40 + Math.floor(Math.random() * 30);
            const used = Math.floor(Math.random() * weight);
            rolls.push({
                id: `CR-202601${String(Math.floor(i / 10) + 15).padStart(2, '0')}-${String(i).padStart(3, '0')}`,
                barcode: `8901234${String(567890 + i)}`,
                receiptDate: `${15 + (i % 7)}-Jan-2026`,
                vendor: vendors[i % vendors.length],
                invoiceNo: `INV-${10000 + i}`,
                clothType: clothTypes[i % clothTypes.length],
                color: STANDARD_COLORS[i % STANDARD_COLORS.length],
                gsm: 250 + (i % 5) * 20,
                width: 72,
                weight: weight,
                remaining: weight - used,
                rate: 380 + (i % 3) * 50,
                status: used >= weight ? 'Depleted' : used > 0 ? 'In Use' : 'Available',
                usedInCuttingSheets: used > 0 ? [`750${i % 8}`] : []
            });
        }
        return rolls;
    };


    const [cottonRolls, setCottonRolls] = useState(() => generateSampleRolls());

    const [newRoll, setNewRoll] = useState({
        vendor: '',
        invoiceNo: '',
        clothType: 'Terry Cotton',
        color: 'Black',
        gsm: 280,
        width: 72,
        weight: 50,
        rate: 450
    });

    const [bulkImportText, setBulkImportText] = useState('');
    const [bulkImportPreview, setBulkImportPreview] = useState([]);

    // ==================== OPERATORS (Configurable) ====================
    const OPERATORS = ['Ramesh', 'Suresh', 'Ganesh', 'Mahesh', 'Pravin'];

    // Handler to update table status
    const updateTableStatus = (tableId, newStatus) => {
        setCuttingTables(prev => prev.map(t =>
            t.id === tableId ? { ...t, status: newStatus } : t
        ));
    };

    const startCuttingOnTable = (tableId) => {
        updateTableStatus(tableId, 'Cutting');
    };

    // ==================== 3-TABLE PALLA SYSTEM ====================
    const [cuttingTables, setCuttingTables] = useState([
        {
            id: 1,
            name: 'Table 1',
            status: 'Cutting', // Available | Layering | Cutting | Maintenance
            currentRollId: 'CR-20260115-001',
            currentColor: 'Navy',
            pallaCount: 100,
            operator: 'Ramesh',
            startTime: '10:00 AM',
            linkedProduction: '7507'
        },
        {
            id: 2,
            name: 'Table 2',
            status: 'Layering',
            currentRollId: 'CR-20260115-003',
            currentColor: 'Black',
            pallaCount: 80,
            operator: 'Suresh',
            startTime: '11:30 AM',
            linkedProduction: null
        },
        {
            id: 3,
            name: 'Table 3',
            status: 'Available',
            currentRollId: null,
            currentColor: null,
            pallaCount: 0,
            operator: null,
            startTime: null,
            linkedProduction: null
        }
    ]);

    const [pallaHistory, setPallaHistory] = useState([
        { id: 'PL-001', tableId: 1, cottonRollId: 'CR-20260115-001', color: 'Navy', layers: 100, operator: 'Ramesh', date: '15-Jan-2026', status: 'Completed', cuttingSheetId: '7507' },
        { id: 'PL-002', tableId: 2, cottonRollId: 'CR-20260115-002', color: 'D. Grey', layers: 80, operator: 'Suresh', date: '15-Jan-2026', status: 'Completed', cuttingSheetId: '7507' },
    ]);

    // ==================== CUTTING SHEETS / PRODUCTIONS ====================
    const [productions, setProductions] = useState([
        {
            id: '7507',
            date: '18-12-2025',
            tableNo: '1',
            styleName: 'Raftaar Kids Cutting',
            jobOrderId: 'JO2228',
            average: 6, // pieces per bundle
            sizeBreakdown: STANDARD_SIZES.reduce((acc, s) => ({ ...acc, [s]: 1 }), {}),
            master: 'Rajesh',
            approvalStatus: 'Approved',
            computerEntry: true,
            // Lots with auto-calculated BAL. METER
            lots: [
                { srNo: 1, colour: 'D. Grey', sourceRollId: 'CR-20260115-005', nw: 22.1, palla: 11, total: 11, balWt: 1.940, balMeter: 97.0 },
                { srNo: 2, colour: 'Navy', sourceRollId: 'CR-20260115-002', nw: 17.150, palla: 12, total: 23, balWt: 8.405, balMeter: 420.25 },
                { srNo: 3, colour: 'Black', sourceRollId: 'CR-20260115-003', nw: 15.95, palla: 10, total: 33, balWt: 0.819, balMeter: 40.95 },
                { srNo: 4, colour: 'D. Grey', sourceRollId: 'CR-20260115-005', nw: 11.31, palla: 6, total: 39, balWt: null, balMeter: null },
                { srNo: 5, colour: 'Black', sourceRollId: 'CR-20260115-006', nw: 78.47, palla: 4, total: 43, balWt: 1.127, balMeter: 56.35 },
                { srNo: 6, colour: 'Navy', sourceRollId: 'CR-20260115-002', nw: 18.69, palla: 11, total: 54, balWt: null, balMeter: null },
                { srNo: 7, colour: 'Black', sourceRollId: 'CR-20260115-007', nw: 16.640, palla: 7, total: 61, balWt: 1.680, balMeter: 84.0 },
                { srNo: 8, colour: 'D. Grey', sourceRollId: 'CR-20260115-008', nw: 22.1, palla: 11, total: 72, balWt: null, balMeter: null },
                { srNo: 9, colour: 'Navy', sourceRollId: 'CR-20260115-009', nw: 15.250, palla: 12, total: 84, balWt: 1.585, balMeter: 79.25 },
                { srNo: 10, colour: 'Black', sourceRollId: 'CR-20260115-010', nw: 11.33, palla: 7, total: 91, balWt: null, balMeter: null },
                { srNo: 11, colour: 'D. Grey', sourceRollId: 'CR-20260115-011', nw: 26.870, palla: 14, total: 105, balWt: 0.730, balMeter: 36.5 },
                { srNo: 12, colour: 'Black', sourceRollId: 'CR-20260115-012', nw: 26.960, palla: 14, total: 119, balWt: 0.436, balMeter: 21.8 },
                { srNo: 13, colour: 'Navy', sourceRollId: 'CR-20260115-013', nw: 29.020, palla: 15, total: 134, balWt: null, balMeter: null },
                { srNo: 14, colour: 'D. Grey', sourceRollId: 'CR-20260115-014', nw: 25.800, palla: 8, total: 142, balWt: null, balMeter: null },
                { srNo: 15, colour: 'Black', sourceRollId: 'CR-20260115-015', nw: 27.700, palla: 8, total: 150, balWt: null, balMeter: null },
            ],
            // Color-wise summary
            colorSummary: {
                'Black': { totalWt: 150.0, consumedWt: 142.5, balanceWt: 7.5 },
                'D. Grey': { totalWt: 110.0, consumedWt: 105.0, balanceWt: 5.0 },
                'Navy': { totalWt: 80.0, consumedWt: 78.5, balanceWt: 1.5 }
            },
            grandTotal: 1500, // 150 pallas × 10 sizes
            status: 'Completed'
        }
    ]);

    // ==================== BUNDLES FROM SHARED CONTEXT ====================
    const { bundles, setBundles, addBundles, BUNDLE_STAGES, moveBundle } = useBundles();
    const WIP_LIMITS = { 'Cutting': 100, 'Printing': 20, 'Sewing Floor': 40, 'Ironing': 15, 'Packaging': 20, 'Complete': 1000 };

    // Kanban UI state
    const [draggedBundle, setDraggedBundle] = useState(null);
    const [dragOverStage, setDragOverStage] = useState(null);
    const [bundleSearchQuery, setBundleSearchQuery] = useState('');
    const [bundleProductionFilter, setBundleProductionFilter] = useState('all');

    // ==================== WIZARD STATE ====================
    const [newProduction, setNewProduction] = useState({
        productionNo: '7508',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        tableNo: '',
        styleName: '',
        jobOrderId: '',
        average: 6,
        selectedRolls: [], // Multi-select cotton rolls
        lots: []
    });

    const [newLotEntry, setNewLotEntry] = useState({
        colour: 'D. Grey',
        sourceRollId: '', // Auto-populated from selection
        nw: 0,
        palla: 1,
        balWt: null
    });

    // ==================== HELPER FUNCTIONS ====================

    // Add new cotton roll
    const addCottonRoll = () => {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const newId = `CR-${dateStr}-${String(cottonRolls.length + 1).padStart(3, '0')}`;

        setCottonRolls(prev => [...prev, {
            id: newId,
            barcode: '',
            receiptDate: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            ...newRoll,
            remaining: newRoll.weight,
            status: 'Available',
            usedInCuttingSheets: []
        }]);

        // Reset form and close modal
        setNewRoll({
            vendor: '',
            invoiceNo: '',
            clothType: 'Terry Cotton',
            color: 'Black',
            gsm: 280,
            width: 72,
            weight: 50,
            rate: 450
        });

        // Clear filters and go to last page to see the new roll
        setRollFilters({ search: '', vendor: '', color: '', status: '' });
        setRollPage(Math.ceil((cottonRolls.length + 1) / ROLLS_PER_PAGE));

        setShowAddRollModal(false);
    };

    // Parse bulk import text
    const parseBulkImport = (text) => {
        const lines = text.trim().split('\n');
        const parsed = lines.map((line, idx) => {
            const parts = line.split('\t').map(p => p.trim());
            if (parts.length >= 4) {
                return {
                    valid: true,
                    vendor: parts[0],
                    color: parts[1],
                    clothType: parts[2],
                    weight: parseFloat(parts[3]) || 0,
                    rate: parseFloat(parts[4]) || 450
                };
            }
            return { valid: false, raw: line, error: 'Invalid format' };
        });
        setBulkImportPreview(parsed);
    };

    // Execute bulk import
    const executeBulkImport = () => {
        const validRows = bulkImportPreview.filter(r => r.valid);
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

        const newRolls = validRows.map((row, idx) => ({
            id: `CR-${dateStr}-${String(cottonRolls.length + idx + 1).padStart(3, '0')}`,
            barcode: '',
            receiptDate: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            vendor: row.vendor,
            invoiceNo: '',
            clothType: row.clothType,
            color: row.color,
            gsm: 280,
            width: 72,
            weight: row.weight,
            remaining: row.weight,
            rate: row.rate,
            status: 'Available',
            usedInCuttingSheets: []
        }));

        setCottonRolls(prev => [...prev, ...newRolls]);
        setBulkImportText('');
        setBulkImportPreview([]);
        setShowBulkImportModal(false);
    };

    // Filter cotton rolls
    const getFilteredRolls = () => {
        return cottonRolls.filter(roll => {
            if (rollFilters.search && !roll.id.toLowerCase().includes(rollFilters.search.toLowerCase()) &&
                !roll.vendor.toLowerCase().includes(rollFilters.search.toLowerCase())) return false;
            if (rollFilters.vendor && roll.vendor !== rollFilters.vendor) return false;
            if (rollFilters.color && roll.color !== rollFilters.color) return false;
            if (rollFilters.status && roll.status !== rollFilters.status) return false;
            return true;
        });
    };

    // Get paginated rolls
    const getPaginatedRolls = () => {
        const filtered = getFilteredRolls();
        const start = (rollPage - 1) * ROLLS_PER_PAGE;
        return filtered.slice(start, start + ROLLS_PER_PAGE);
    };

    // Get unique vendors for filter dropdown
    const getUniqueVendors = () => [...new Set(cottonRolls.map(r => r.vendor))];

    // Lot helpers
    const addLotEntry = () => {
        const roll = cottonRolls.find(r => r.id === newLotEntry.sourceRollId);
        const balMeter = newLotEntry.balWt ? (newLotEntry.balWt * KG_TO_METER) : null;

        const newLot = {
            srNo: newProduction.lots.length + 1,
            colour: newLotEntry.colour,
            sourceRollId: newLotEntry.sourceRollId,
            nw: parseFloat(newLotEntry.nw),
            palla: parseInt(newLotEntry.palla),
            total: (newProduction.lots.length > 0 ? newProduction.lots[newProduction.lots.length - 1].total : 0) + parseInt(newLotEntry.palla),
            balWt: newLotEntry.balWt ? parseFloat(newLotEntry.balWt) : null,
            balMeter: balMeter
        };

        setNewProduction({ ...newProduction, lots: [...newProduction.lots, newLot] });
        setNewLotEntry({ colour: roll?.color || 'D. Grey', sourceRollId: '', nw: 0, palla: 1, balWt: null });
    };

    const removeLot = (srNo) => {
        const updatedLots = newProduction.lots.filter(l => l.srNo !== srNo).map((l, idx) => {
            const prevTotal = idx > 0 ? newProduction.lots[idx - 1].total : 0;
            return { ...l, srNo: idx + 1, total: prevTotal + l.palla };
        });
        setNewProduction({ ...newProduction, lots: updatedLots });
    };

    // Calculation helpers
    const getTotalPalla = (lots) => lots.reduce((sum, l) => sum + (l.palla || 0), 0);
    const getTotalNW = (lots) => lots.reduce((sum, l) => sum + (l.nw || 0), 0);
    const getTotalBalWt = (lots) => lots.reduce((sum, l) => sum + (l.balWt || 0), 0);
    const getGrandTotal = (prod) => {
        const totalPalla = getTotalPalla(prod.lots);
        return totalPalla * STANDARD_SIZES.length; // Total Palla × 10 sizes
    };

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

    // Stage badge colors
    const getStageBadge = (stage) => {
        const stages = {
            'Cutting': 'bg-gray-100 text-gray-700',
            'Printing': 'bg-yellow-50 text-yellow-700',
            'Stitching': 'bg-blue-50 text-blue-700',
            'Ironing': 'bg-indigo-50 text-indigo-700',
            'Packaging': 'bg-teal-50 text-teal-700',
            'Complete': 'bg-green-100 text-green-800',
        };
        return stages[stage] || 'bg-gray-100 text-gray-600';
    };

    // Cotton Rolls Page - Scalable for 100+ Rolls
    const renderCottonRollsPage = () => {
        const filteredRolls = getFilteredRolls();
        const paginatedRolls = getPaginatedRolls();
        const totalPages = Math.ceil(filteredRolls.length / ROLLS_PER_PAGE);

        return (
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900"> Cotton Rolls</h2>
                        <p className="text-xs text-gray-500">Manage fabric inventory - 1 kg ≈ {KG_TO_METER} meters</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowBulkImportModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
                        >
                            <Upload size={14} /> Bulk Import
                        </button>
                        <button
                            onClick={() => setShowAddRollModal(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                        >
                            <Plus size={14} /> Add Roll
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                        <div className="text-[10px] text-gray-500 uppercase">Total Rolls</div>
                        <div className="text-xl font-bold text-gray-900">{cottonRolls.length}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                        <div className="text-[10px] text-green-600 uppercase">Available</div>
                        <div className="text-xl font-bold text-green-700">{cottonRolls.filter(r => r.status === 'Available').length}</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <div className="text-[10px] text-blue-600 uppercase">In Use</div>
                        <div className="text-xl font-bold text-blue-700">{cottonRolls.filter(r => r.status === 'In Use').length}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="text-[10px] text-gray-500 uppercase">Depleted</div>
                        <div className="text-xl font-bold text-gray-500">{cottonRolls.filter(r => r.status === 'Depleted').length}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="text-[10px] text-purple-600 uppercase">Total Remaining</div>
                        <div className="text-xl font-bold text-purple-700">{cottonRolls.reduce((sum, r) => sum + r.remaining, 0).toLocaleString()} kg</div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Roll ID or Vendor..."
                            value={rollFilters.search}
                            onChange={(e) => { setRollFilters(f => ({ ...f, search: e.target.value })); setRollPage(1); }}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                        />
                    </div>
                    <select
                        value={rollFilters.vendor}
                        onChange={(e) => { setRollFilters(f => ({ ...f, vendor: e.target.value })); setRollPage(1); }}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                    >
                        <option value="">All Vendors</option>
                        {getUniqueVendors().map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <select
                        value={rollFilters.color}
                        onChange={(e) => { setRollFilters(f => ({ ...f, color: e.target.value })); setRollPage(1); }}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                    >
                        <option value="">All Colors</option>
                        {STANDARD_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={rollFilters.status}
                        onChange={(e) => { setRollFilters(f => ({ ...f, status: e.target.value })); setRollPage(1); }}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white"
                    >
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Depleted">Depleted</option>
                    </select>
                    {(rollFilters.search || rollFilters.vendor || rollFilters.color || rollFilters.status) && (
                        <button
                            onClick={() => setRollFilters({ search: '', vendor: '', color: '', status: '' })}
                            className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                <tr>
                                    <th className="text-left p-2.5 font-semibold text-gray-600">Roll ID</th>
                                    <th className="text-left p-2.5 font-semibold text-gray-600">Date</th>
                                    <th className="text-left p-2.5 font-semibold text-gray-600">Vendor</th>
                                    <th className="text-left p-2.5 font-semibold text-gray-600">Cloth Type</th>
                                    <th className="text-left p-2.5 font-semibold text-gray-600">Color</th>
                                    <th className="text-center p-2.5 font-semibold text-gray-600">Weight</th>
                                    <th className="text-center p-2.5 font-semibold text-gray-600">Remaining</th>
                                    <th className="text-center p-2.5 font-semibold text-gray-600">Rate</th>
                                    <th className="text-center p-2.5 font-semibold text-gray-600">Status</th>
                                    <th className="text-center p-2.5 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRolls.map((roll) => (
                                    <tr key={roll.id} className="border-b border-gray-100 hover:bg-blue-50/30">
                                        <td className="p-2.5 font-mono text-blue-600 font-medium text-[10px]">{roll.id}</td>
                                        <td className="p-2.5 text-gray-600">{roll.receiptDate}</td>
                                        <td className="p-2.5 font-medium text-gray-900">{roll.vendor}</td>
                                        <td className="p-2.5 text-gray-600">{roll.clothType}</td>
                                        <td className="p-2.5">
                                            <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{roll.color}</span>
                                        </td>
                                        <td className="p-2.5 text-center text-gray-600">{roll.weight} kg</td>
                                        <td className="p-2.5 text-center font-semibold">{roll.remaining} kg</td>
                                        <td className="p-2.5 text-center text-gray-600">₹{roll.rate}</td>
                                        <td className="p-2.5 text-center">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${roll.status === 'Available' ? 'bg-green-100 text-green-700' :
                                                roll.status === 'In Use' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>{roll.status}</span>
                                        </td>
                                        <td className="p-2.5 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View">
                                                    <Eye size={12} />
                                                </button>
                                                <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Edit">
                                                    <Edit size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Showing {((rollPage - 1) * ROLLS_PER_PAGE) + 1}-{Math.min(rollPage * ROLLS_PER_PAGE, filteredRolls.length)} of {filteredRolls.length} rolls
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setRollPage(p => Math.max(1, p - 1))}
                                disabled={rollPage === 1}
                                className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-white disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setRollPage(pageNum)}
                                        className={`px-2 py-1 rounded text-xs ${rollPage === pageNum ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-white'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {totalPages > 5 && <span className="text-gray-400">...</span>}
                            <button
                                onClick={() => setRollPage(p => Math.min(totalPages, p + 1))}
                                disabled={rollPage === totalPages}
                                className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-white disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3-Table Dashboard */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Scissors size={16} /> Cutting Tables (3)
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {cuttingTables.map(table => (
                            <div key={table.id} className={`rounded-xl border-2 overflow-hidden ${table.status === 'Cutting' ? 'border-green-400 bg-green-50' :
                                table.status === 'Layering' ? 'border-yellow-400 bg-yellow-50' :
                                    table.status === 'Maintenance' ? 'border-red-400 bg-red-50' :
                                        'border-gray-200 bg-gray-50'
                                }`}>
                                <div className={`px-3 py-2 ${table.status === 'Cutting' ? 'bg-green-500 text-white' :
                                    table.status === 'Layering' ? 'bg-yellow-500 text-white' :
                                        table.status === 'Maintenance' ? 'bg-red-500 text-white' :
                                            'bg-gray-200 text-gray-700'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-sm">{table.name}</span>
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{table.status}</span>
                                    </div>
                                </div>
                                <div className="p-3 space-y-2">
                                    {table.status === 'Available' ? (
                                        <div className="text-center py-4">
                                            <Layers size={24} className="mx-auto mb-2 text-gray-400" />
                                            <p className="text-xs text-gray-500 mb-2">Table is available</p>
                                            <button
                                                onClick={() => setShowPallaModal(true)}
                                                className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                                            >
                                                Start Palla
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Roll:</span>
                                                <span className="font-mono text-blue-600">{table.currentRollId}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Color:</span>
                                                <span className="font-medium">{table.currentColor}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Palla Count:</span>
                                                <span className="font-bold text-lg">{table.pallaCount}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Operator:</span>
                                                <span>{table.operator}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">Started:</span>
                                                <span>{table.startTime}</span>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {table.status === 'Layering' && (
                                                    <button
                                                        onClick={() => startCuttingOnTable(table.id)}
                                                        className="flex-1 px-2 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                                                    >
                                                        → Start Cutting
                                                    </button>
                                                )}
                                                {table.status === 'Cutting' && (
                                                    <button
                                                        onClick={() => { setShowWizard(true); setWizardStep(1); }}
                                                        className="flex-1 px-2 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                                                    >
                                                        → Create Cutting Sheet
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Job Orders Page - Clean Table UI
    const renderJobOrdersPage = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Job Orders</h2>
                    <p className="text-xs text-gray-500">Production targets and requirements</p>
                </div>
                <button
                    onClick={() => setShowAddJobOrderModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                >
                    <Plus size={14} /> New Job Order
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-[10px] text-gray-500 uppercase">Total Orders</div>
                    <div className="text-xl font-bold text-gray-900">{jobOrders.length}</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="text-[10px] text-yellow-600 uppercase">Pending</div>
                    <div className="text-xl font-bold text-yellow-700">{jobOrders.filter(j => j.status === 'Pending').length}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-[10px] text-blue-600 uppercase">In Progress</div>
                    <div className="text-xl font-bold text-blue-700">{jobOrders.filter(j => j.status === 'In Progress').length}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-[10px] text-green-600 uppercase">Total Pieces</div>
                    <div className="text-xl font-bold text-green-700">{jobOrders.reduce((sum, j) => sum + j.grandTotal, 0).toLocaleString()}</div>
                </div>
            </div>

            {/* Job Orders Cards */}
            <div className="grid grid-cols-2 gap-4">
                {jobOrders.map(order => (
                    <div key={order.id} className={`bg-white rounded-xl border-2 overflow-hidden ${order.status === 'Completed' ? 'border-green-300' :
                        order.status === 'In Progress' ? 'border-blue-300' :
                            'border-yellow-300'
                        }`}>
                        <div className={`px-4 py-2.5 flex items-center justify-between ${order.status === 'Completed' ? 'bg-green-50' :
                            order.status === 'In Progress' ? 'bg-blue-50' :
                                'bg-yellow-50'
                            }`}>
                            <div>
                                <span className="font-mono font-bold text-gray-800">{order.id}</span>
                                <span className="ml-2 text-xs text-gray-500">{order.date}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${order.status === 'Completed' ? 'bg-green-200 text-green-700' :
                                order.status === 'In Progress' ? 'bg-blue-200 text-blue-700' :
                                    'bg-yellow-200 text-yellow-700'
                                }`}>{order.status}</span>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <div className="text-base font-bold text-gray-900">{order.styleName}</div>
                                <div className="text-xs text-gray-500">{order.partyName}</div>
                                {order.remarks && <div className="text-xs text-blue-600 mt-1 flex items-center gap-1"><FileText size={10} /> {order.remarks}</div>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Colors */}
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase mb-1">Colors</div>
                                    <div className="flex flex-wrap gap-1">
                                        {[...new Set(order.items.map(i => i.color))].map(color => (
                                            <span key={color} className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium">{color}</span>
                                        ))}
                                    </div>
                                </div>
                                {/* Sizes */}
                                <div>
                                    <div className="text-[10px] text-gray-500 uppercase mb-1">Sizes</div>
                                    <div className="flex flex-wrap gap-1">
                                        {[...new Set(order.items.map(i => i.size))].slice(0, 5).map(size => (
                                            <span key={size} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px]">{size}</span>
                                        ))}
                                        {[...new Set(order.items.map(i => i.size))].length > 5 && (
                                            <span className="text-[10px] text-gray-400">+{[...new Set(order.items.map(i => i.size))].length - 5}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div>
                                    <div className="text-xl font-bold text-gray-900">{order.grandTotal.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-500">TOTAL PIECES</div>
                                </div>
                                <div className="flex gap-2">
                                    {order.linkedCuttingSheet ? (
                                        <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                                            Linked #{order.linkedCuttingSheet}
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => { setShowWizard(true); setWizardStep(1); setNewProduction(p => ({ ...p, jobOrderId: order.id, styleName: order.styleName })); }}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                                        >
                                            Start Cutting
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Job Order Modal */}
            {showAddJobOrderModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[550px] shadow-2xl">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">New Job Order</h3>
                                <p className="text-xs text-gray-500">Create production target</p>
                            </div>
                            <button onClick={() => setShowAddJobOrderModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                        </div>
                        <div className="p-5 space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-500 mb-1">Order ID</label>
                                    <input type="text" defaultValue={`JO-${Date.now().toString().slice(-6)}`} className="w-full px-3 py-2 border rounded-lg font-mono" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">Date</label>
                                    <input type="text" defaultValue={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} className="w-full px-3 py-2 border rounded-lg bg-gray-50" readOnly />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-500 mb-1">Style Name</label>
                                    <input type="text" placeholder="e.g. Track Pants Regular" className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">Party Name</label>
                                    <input type="text" placeholder="e.g. ABC Traders" className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">Colors Required</label>
                                <div className="flex flex-wrap gap-2">
                                    {STANDARD_COLORS.map(color => (
                                        <label key={color} className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded border cursor-pointer hover:bg-gray-100">
                                            <input type="checkbox" className="w-3 h-3" />
                                            <span>{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">Sizes & Quantity per Size</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {STANDARD_SIZES.map(size => (
                                        <div key={size} className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded border hover:bg-gray-100">
                                            <label className="flex items-center gap-1 cursor-pointer">
                                                <input type="checkbox" className="w-3.5 h-3.5" defaultChecked />
                                                <span className="font-medium">{size}</span>
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue={100}
                                                className="w-full px-1.5 py-1 border rounded text-center text-[11px]"
                                                placeholder="Qty"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">Remarks (Optional)</label>
                                <textarea placeholder="Any special instructions..." className="w-full px-3 py-2 border rounded-lg" rows={2}></textarea>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-end gap-2">
                            <button onClick={() => setShowAddJobOrderModal(false)} className="px-4 py-2 border rounded-lg text-xs font-medium">Cancel</button>
                            <button onClick={() => setShowAddJobOrderModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium">Create Job Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Cutting Sheets Page - SHOW ALL FIELDS
    const renderCuttingSheetsPage = () => (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Cutting Sheets</h2>
                <button
                    onClick={() => { setShowWizard(true); setWizardStep(1); setNewProduction({ ...newProduction, lots: [] }); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus size={14} /> New Production
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-6 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Productions</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{productions.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Completed</div>
                    <div className="text-xl font-bold text-green-700 mt-1">{productions.filter(p => p.status === 'Completed').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100 bg-blue-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-blue-600">Total Palla</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">{productions.reduce((sum, p) => sum + getTotalPalla(p.lots), 0)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Grand Total (All)</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{productions.reduce((sum, p) => sum + getGrandTotal(p), 0).toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-purple-100 bg-purple-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-purple-600">Total N.W. (kg)</div>
                    <div className="text-xl font-bold text-purple-700 mt-1">{productions.reduce((sum, p) => sum + getTotalNW(p.lots), 0).toFixed(2)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-yellow-100 bg-yellow-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-yellow-600">Total Bal Wt (kg)</div>
                    <div className="text-xl font-bold text-yellow-700 mt-1">{productions.reduce((sum, p) => sum + p.lots.reduce((lSum, l) => lSum + (l.balWt || 0), 0), 0).toFixed(2)}</div>
                </div>
            </div>

            {/* Productions Table - ACTUAL COLUMNS FROM PHYSICAL SHEET */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-2 font-semibold text-gray-600 whitespace-nowrap">Prod No</th>
                                <th className="text-left p-2 font-semibold text-gray-600 whitespace-nowrap">Date</th>
                                <th className="text-center p-2 font-semibold text-gray-600">Table</th>
                                <th className="text-left p-2 font-semibold text-gray-600 whitespace-nowrap">Style Name</th>
                                <th className="text-center p-2 font-semibold text-gray-600">Avg</th>
                                <th className="text-center p-2 font-semibold text-gray-600">Lots</th>
                                <th className="text-center p-2 font-semibold text-gray-600 bg-blue-50">Palla</th>
                                <th className="text-center p-2 font-semibold text-gray-600 bg-green-50">Total</th>
                                <th className="text-center p-2 font-semibold text-gray-600 bg-purple-50">N.W.</th>
                                <th className="text-center p-2 font-semibold text-gray-600 bg-yellow-50">Bal Wt</th>
                                <th className="text-left p-2 font-semibold text-gray-600">Master</th>
                                <th className="text-center p-2 font-semibold text-gray-600">OK</th>
                                <th className="text-center p-2 font-semibold text-gray-600">Entry</th>
                                <th className="text-center p-2 font-semibold text-gray-600">Status</th>
                                <th className="text-center p-2 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productions.map((prod) => (
                                <tr key={prod.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                    <td className="p-2 font-mono text-blue-600 font-bold">{prod.id}</td>
                                    <td className="p-2 text-gray-600 whitespace-nowrap">{prod.date}</td>
                                    <td className="p-2 text-center text-gray-600">{prod.tableNo || '-'}</td>
                                    <td className="p-2 font-medium text-gray-900">{prod.styleName || '-'}</td>
                                    <td className="p-2 text-center text-gray-600">{prod.average || '-'}</td>
                                    <td className="p-2 text-center">{prod.lots.length}</td>
                                    <td className="p-2 text-center font-semibold bg-blue-50/30">{getTotalPalla(prod.lots)}</td>
                                    <td className="p-2 text-center font-bold text-green-700 bg-green-50/30">{getGrandTotal(prod)}</td>
                                    <td className="p-2 text-center font-semibold text-purple-700 bg-purple-50/30">{getTotalNW(prod.lots).toFixed(2)}</td>
                                    <td className="p-2 text-center font-semibold text-yellow-700 bg-yellow-50/30">{prod.lots.reduce((sum, l) => sum + (l.balWt || 0), 0).toFixed(3)}</td>
                                    <td className="p-2 text-gray-600">{prod.master || '-'}</td>
                                    <td className="p-2 text-center">
                                        <span className={`text-lg ${prod.approvalStatus === 'Approved' ? 'text-green-600' : 'text-yellow-500'}`}>
                                            {prod.approvalStatus === 'Approved' ? 'Y' : '-'}
                                        </span>
                                    </td>
                                    <td className="p-2 text-center">
                                        <span className={`text-lg ${prod.computerEntry ? 'text-green-600' : 'text-gray-400'}`}>
                                            {prod.computerEntry ? 'Y' : '-'}
                                        </span>
                                    </td>
                                    <td className="p-2 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${prod.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{prod.status}</span>
                                    </td>
                                    <td className="p-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() => { setSelectedProduction(prod); setShowPrintPreview(true); }}
                                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Sheet"
                                            ><Eye size={13} /></button>
                                            <button
                                                onClick={() => { setSelectedProduction(prod); setShowPrintPreview(true); }}
                                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Print"
                                            ><Printer size={13} /></button>
                                            <button className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors" title="Download"><Download size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Column Legend */}
            <div className="text-[10px] text-gray-500 flex flex-wrap gap-4">
                <span><strong>Table</strong> = Table No (Cutting Table)</span>
                <span><strong>Avg</strong> = Average</span>
                <span className="bg-blue-100 px-1 rounded"><strong>Palla</strong> = Total Palla/Layers</span>
                <span className="bg-green-100 px-1 rounded"><strong>Total</strong> = Grand Total Pieces</span>
                <span className="bg-purple-100 px-1 rounded"><strong>N.W.</strong> = Net Weight (kg)</span>
                <span className="bg-yellow-100 px-1 rounded"><strong>Bal Wt</strong> = Total Balance Weight (kg)</span>
                <span><strong>OK</strong> = Approval Status</span>
                <span><strong>Entry</strong> = Computer Data Entry</span>
            </div>
        </div>
    );

    // Bundles Tracking Page - KANBAN BOARD
    const renderBundlesPage = () => {
        // Use top-level bundles state (not local)
        const stages = BUNDLE_STAGES;

        // Filter bundles using top-level state
        const filteredBundles = bundles.filter(b => {
            const matchesSearch = bundleSearchQuery === '' || b.id.toLowerCase().includes(bundleSearchQuery.toLowerCase());
            const matchesProduction = bundleProductionFilter === 'all' || b.production === bundleProductionFilter;
            return matchesSearch && matchesProduction;
        });

        // Get bundles by stage
        const getBundlesByStage = (stage) => filteredBundles.filter(b => b.stage === stage);

        // Drag handlers
        const handleDragStart = (e, bundle) => {
            setDraggedBundle(bundle);
            e.dataTransfer.effectAllowed = 'move';
        };

        const handleDragOver = (e, stage) => {
            e.preventDefault();
            setDragOverStage(stage);
        };

        const handleDragLeave = () => {
            setDragOverStage(null);
        };

        const handleDrop = (e, targetStage) => {
            e.preventDefault();
            if (draggedBundle && draggedBundle.stage !== targetStage) {
                setBundles(prev => prev.map(b =>
                    b.id === draggedBundle.id ? { ...b, stage: targetStage } : b
                ));
            }
            setDraggedBundle(null);
            setDragOverStage(null);
        };

        // Move to next stage
        const moveToNextStage = (bundle) => {
            const currentIdx = stages.indexOf(bundle.stage);
            if (currentIdx < stages.length - 1) {
                const nextStage = stages[currentIdx + 1];
                setBundles(prev => prev.map(b =>
                    b.id === bundle.id ? { ...b, stage: nextStage } : b
                ));
            }
        };

        // Stage column colors - No emojis, use Lucide icons
        const getStageStyles = (stage) => {
            const styles = {
                'Cutting': { bg: 'bg-gradient-to-b from-slate-50 to-slate-100', border: 'border-slate-200', header: 'bg-slate-600', Icon: Scissors },
                'Printing': { bg: 'bg-gradient-to-b from-amber-50 to-amber-100', border: 'border-amber-200', header: 'bg-amber-500', Icon: Printer },
                'Sewing Floor': { bg: 'bg-gradient-to-b from-blue-50 to-blue-100', border: 'border-blue-200', header: 'bg-blue-600', Icon: Layers },
                'Ironing': { bg: 'bg-gradient-to-b from-purple-50 to-purple-100', border: 'border-purple-200', header: 'bg-purple-600', Icon: Clock },
                'Packaging': { bg: 'bg-gradient-to-b from-teal-50 to-teal-100', border: 'border-teal-200', header: 'bg-teal-600', Icon: Box },
                'Complete': { bg: 'bg-gradient-to-b from-green-50 to-green-100', border: 'border-green-200', header: 'bg-green-600', Icon: CheckCircle },
            };
            return styles[stage];
        };

        // Bundle card color based on color name
        const getColorBadge = (color) => {
            const colors = {
                'D. Grey': 'bg-gray-500',
                'Black': 'bg-gray-900',
                'Navy': 'bg-blue-900',
                'White': 'bg-white border border-gray-300',
                'Red': 'bg-red-500',
            };
            return colors[color] || 'bg-gray-400';
        };

        return (
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">

                            Production Kanban Board
                        </h2>

                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-xs">
                            <span className="text-blue-600">Total Bundles:</span>
                            <span className="font-bold text-blue-800 ml-1">{bundles.length}</span>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs">
                            <span className="text-green-600">Completed:</span>
                            <span className="font-bold text-green-800 ml-1">{bundles.filter(b => b.stage === 'Complete').length}</span>
                        </div>
                    </div>
                </div>



                {/* Filters */}
                <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Bundle ID (e.g., 7507-5)..."
                            value={bundleSearchQuery}
                            onChange={(e) => setBundleSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <select
                        value={bundleProductionFilter}
                        onChange={(e) => setBundleProductionFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Productions</option>
                        {productions.map(p => <option key={p.id} value={p.id}>Prod #{p.id}</option>)}
                    </select>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: '500px' }}>
                    {stages.map((stage) => {
                        const stageStyles = getStageStyles(stage);
                        const stageBundles = getBundlesByStage(stage);
                        const isDropTarget = dragOverStage === stage;

                        return (
                            <div
                                key={stage}
                                className={`flex-shrink-0 w-56 rounded-xl ${stageStyles.bg} ${stageStyles.border} border-2 transition-all duration-200 ${isDropTarget ? 'ring-2 ring-blue-400 ring-offset-2 scale-[1.02]' : ''}`}
                                onDragOver={(e) => handleDragOver(e, stage)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, stage)}
                            >
                                {/* Column Header - Industry Style */}
                                <div className={`${stageStyles.header} text-white rounded-t-lg px-3 py-2.5`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <stageStyles.Icon size={14} />
                                            <span className="font-semibold text-xs uppercase tracking-wider">{stage}</span>
                                        </div>
                                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                                            {stageBundles.length} / {WIP_LIMITS[stage] || '∞'}
                                        </span>
                                    </div>
                                    {/* Stage Ops Subtitle */}
                                    <div className="text-[9px] opacity-80 pl-6">
                                        {stage === 'Sewing Floor' ? 'Work Allocation & Production' :
                                            stage === 'Cutting' ? 'Material Preparation' :
                                                stage === 'Printing' ? 'Value Addition' :
                                                    stage === 'Complete' ? 'Finished Goods' : 'Processing'}
                                    </div>
                                </div>

                                {/* Cards Container */}
                                <div className="p-2 space-y-2 max-h-[420px] overflow-y-auto bg-slate-50/50">
                                    {stageBundles.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-lg m-1">
                                            <Box size={24} className="mx-auto mb-2 opacity-30" />
                                            <span className="opacity-50">Empty Station</span>
                                        </div>
                                    ) : (
                                        stageBundles.map((bundle) => {
                                            // Calculate progress based on operations
                                            const totalOps = 5; // Simplified total ops
                                            const completedOps = Object.keys(bundle.operationsCompleted || {}).length;
                                            const progress = (completedOps / totalOps) * 100;
                                            const isUrgent = bundle.colour === 'Black' || bundle.priority === 'High'; // Mock priority logic

                                            return (
                                                <div
                                                    key={bundle.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, bundle)}
                                                    className={`bg-white rounded border-l-4 p-3 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md group ${draggedBundle?.id === bundle.id ? 'opacity-50 scale-95' : ''
                                                        } ${isUrgent ? 'border-red-500' : 'border-blue-500'
                                                        }`}
                                                    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                                                >
                                                    {/* Card Header: ID & Priority */}
                                                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                                                        <div className="flex flex-col">
                                                            <span className="font-mono text-xs font-bold text-gray-800 tracking-tight">
                                                                {bundle.id}
                                                            </span>
                                                            <span className="text-[9px] text-gray-500">Prod #{bundle.production}</span>
                                                        </div>
                                                        {isUrgent && (
                                                            <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold uppercase rounded border border-red-100 animate-pulse">
                                                                Urgent
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Card Details Grid */}
                                                    <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] text-gray-600 mb-2">
                                                        <div className="flex items-center gap-1">
                                                            <div className={`w-2 h-2 rounded-full ${getColorBadge(bundle.colour)}`}></div>
                                                            <span className="font-medium text-gray-900">{bundle.colour}</span>
                                                        </div>
                                                        <div className="text-right text-gray-500">
                                                            Size: <strong className="text-gray-800">{bundle.size}</strong>
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {bundle.pieces} pcs
                                                        </div>
                                                        <div className="text-right text-gray-500">
                                                            {bundle.nw?.toFixed(2)} kg
                                                        </div>
                                                    </div>

                                                    {/* Assignment / Progress Status (Crucial for Industry View) */}
                                                    {stage === 'Sewing Floor' && (
                                                        <div className="mb-2 bg-gray-50 rounded p-1.5 border border-gray-100">
                                                            {bundle.currentWorker ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-700 text-[9px] font-bold">
                                                                        {bundle.currentWorker.charAt(0)}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="text-[9px] font-bold text-gray-800 truncate">{bundle.currentWorker}</div>
                                                                        <div className="text-[8px] text-blue-600 truncate">{bundle.currentOperation}</div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 text-amber-600">
                                                                    <AlertCircle size={10} />
                                                                    <span className="text-[9px] font-bold">Unassigned</span>
                                                                </div>
                                                            )}
                                                            {/* Progress Bar */}
                                                            <div className="mt-1.5 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Footer: Aging & Actions */}
                                                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                                                        <div className="flex items-center gap-1 text-[9px] text-gray-400" title="Time in stage">
                                                            <Clock size={10} />
                                                            <span>4h 20m</span>
                                                        </div>

                                                        {stage !== 'Complete' ? (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); moveToNextStage(bundle); }}
                                                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600 transition-colors"
                                                                title="Move to next stage"
                                                            >
                                                                <ArrowRight size={14} />
                                                            </button>
                                                        ) : (
                                                            <CheckCircle size={14} className="text-green-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Summary */}
                <div className="bg-white rounded-xl p-4 border border-gray-100" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Production Progress</h3>
                        <span className="text-xs text-gray-500">{Math.round((bundles.filter(b => b.stage === 'Complete').length / bundles.length) * 100)}% Complete</span>
                    </div>
                    <div className="flex rounded-full overflow-hidden h-3 bg-gray-100">
                        {stages.map((stage) => {
                            const count = bundles.filter(b => b.stage === stage).length;
                            const percent = (count / bundles.length) * 100;
                            const stageStyles = getStageStyles(stage);
                            return (
                                <div
                                    key={stage}
                                    className={`${stageStyles.header} transition-all duration-500`}
                                    style={{ width: `${percent}%` }}
                                    title={`${stage}: ${count} bundles (${Math.round(percent)}%)`}
                                ></div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px]">
                        {stages.map((stage) => {
                            const count = bundles.filter(b => b.stage === stage).length;
                            return (
                                <div key={stage} className="text-center">
                                    <div className="font-bold text-gray-800">{count}</div>
                                    <div className="text-gray-500">{stage}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // Print Preview Modal - MATCHES ACTUAL PHYSICAL CUTTING SHEET
    const PrintPreviewModal = () => {
        if (!selectedProduction) return null;
        const prod = selectedProduction;

        const totalPalla = getTotalPalla(prod.lots);
        const totalNW = getTotalNW(prod.lots);
        const grandTotal = getGrandTotal(prod);

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl w-[850px] max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Cutting Sheet - Production {prod.id}</h3>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-gray-50">
                                <Download size={14} /> Download
                            </button>
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-blue-700">
                                <Printer size={14} /> Print
                            </button>
                            <button onClick={() => setShowPrintPreview(false)} className="text-gray-400 hover:text-gray-600 ml-2"><X size={20} /></button>
                        </div>
                    </div>

                    {/* Printable Content - MATCHES ACTUAL PHYSICAL DOCUMENT */}
                    <div className="p-6 flex-1 overflow-auto bg-gray-50">
                        <div className="bg-white border-2 border-gray-800 p-4 max-w-[750px] mx-auto text-[11px]" style={{ fontFamily: 'monospace' }}>
                            {/* Header Row - ACTUAL FORMAT */}
                            <div className="grid grid-cols-4 border-b-2 border-gray-800 pb-2 mb-2">
                                <div className="border border-gray-400 p-1 text-center">
                                    <div className="text-[9px] text-gray-500">TABLE NO.</div>
                                    <div className="font-bold">{prod.tableNo || '-'}</div>
                                </div>
                                <div className="border border-gray-400 p-1 text-center col-span-2">
                                    <div className="text-[9px] text-gray-500">STYLE NAME</div>
                                    <div className="font-bold text-blue-600">{prod.styleName || '-'}</div>
                                </div>
                                <div className="text-right text-[10px]">
                                    <div><strong>DATE:</strong> {prod.date}</div>
                                    <div><strong>AVERAGE:</strong> {prod.average || '-'}</div>
                                </div>
                            </div>

                            {/* Size Breakdown Row - ACTUAL FORMAT */}
                            {prod.sizeBreakdown && (
                                <div className="border border-gray-400 mb-2 p-1">
                                    <div className="grid grid-cols-10 gap-1 text-center text-[9px]">
                                        <div className="font-semibold">SIZE:</div>
                                        {Object.keys(prod.sizeBreakdown).map(size => (
                                            <div key={size} className="border-b border-gray-300 font-mono">{size}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-10 gap-1 text-center text-[9px] mt-1">
                                        <div className="font-semibold">PCS:</div>
                                        {Object.values(prod.sizeBreakdown).map((pcs, i) => (
                                            <div key={i} className="font-mono">{pcs}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Lots Table - ACTUAL COLUMNS: Sr No, COLOUR, N.W., PALLA, TOTAL, BAL. WT., BAL. METER, PANNA */}
                            <table className="w-full border-collapse text-[10px]">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-400 p-1 text-center w-10">Sr. No.</th>
                                        <th className="border border-gray-400 p-1 text-left">COLOUR</th>
                                        <th className="border border-gray-400 p-1 text-center">N.W.</th>
                                        <th className="border border-gray-400 p-1 text-center">PALLA</th>
                                        <th className="border border-gray-400 p-1 text-center">TOTAL</th>
                                        <th className="border border-gray-400 p-1 text-center bg-yellow-100">BAL. WT.</th>
                                        <th className="border border-gray-400 p-1 text-center">BAL. METER</th>
                                        <th className="border border-gray-400 p-1 text-center">PANNA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prod.lots.map(lot => (
                                        <tr key={lot.srNo}>
                                            <td className="border border-gray-400 p-1 text-center font-bold">{lot.srNo}</td>
                                            <td className="border border-gray-400 p-1">{lot.colour}</td>
                                            <td className="border border-gray-400 p-1 text-center">{lot.nw?.toFixed(2) || '-'}</td>
                                            <td className="border border-gray-400 p-1 text-center">{lot.palla}</td>
                                            <td className="border border-gray-400 p-1 text-center font-semibold">{lot.total}</td>
                                            <td className="border border-gray-400 p-1 text-center bg-yellow-50 font-semibold text-yellow-800">{lot.balWt?.toFixed(3) || '-'}</td>
                                            <td className="border border-gray-400 p-1 text-center">{lot.balMeter || '-'}</td>
                                            <td className="border border-gray-400 p-1 text-center">{lot.panna || '-'}</td>
                                        </tr>
                                    ))}
                                    {/* Empty rows for manual entries (up to 17 rows like physical sheet) */}
                                    {[...Array(Math.max(0, 17 - prod.lots.length))].map((_, i) => (
                                        <tr key={`empty-${i}`}>
                                            <td className="border border-gray-400 p-1 h-5 text-center text-gray-300">{prod.lots.length + i + 1}</td>
                                            <td className="border border-gray-400 p-1"></td>
                                            <td className="border border-gray-400 p-1"></td>
                                            <td className="border border-gray-400 p-1"></td>
                                            <td className="border border-gray-400 p-1"></td>
                                            <td className="border border-gray-400 p-1 bg-yellow-50"></td>
                                            <td className="border border-gray-400 p-1"></td>
                                            <td className="border border-gray-400 p-1"></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-200 font-bold">
                                        <td className="border border-gray-400 p-1 text-center" colSpan={2}>TOTAL</td>
                                        <td className="border border-gray-400 p-1 text-center">{totalNW.toFixed(2)}</td>
                                        <td className="border border-gray-400 p-1 text-center">{totalPalla}</td>
                                        <td className="border border-gray-400 p-1 text-center text-lg text-green-700">{grandTotal}</td>
                                        <td className="border border-gray-400 p-1 bg-yellow-100" colSpan={3}></td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* Bottom Section - x16 and Grand Total like physical sheet */}
                            <div className="mt-2 flex justify-between items-center border-t-2 border-gray-800 pt-2">
                                <div className="text-sm">
                                    <span className="text-gray-500">x</span>
                                    <span className="font-bold text-lg">16</span>
                                    <span className="text-gray-500 text-xs ml-2">(sizes multiplier)</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-500">Grand Total: </span>
                                    <span className="font-bold text-xl text-blue-700">{grandTotal}</span>
                                </div>
                            </div>

                            {/* Approval Section */}
                            <div className="mt-3 grid grid-cols-3 gap-4 text-[10px]">
                                <div className="border border-gray-400 p-2">
                                    <div className="text-gray-500">BY OPERATOR/MASTER</div>
                                    <div className="font-bold mt-1">{prod.master || '____________'}</div>
                                </div>
                                <div className="border border-gray-400 p-2 text-center">
                                    <div className="text-gray-500">OK/NOT</div>
                                    <div className={`font-bold mt-1 ${prod.approvalStatus === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {prod.approvalStatus || '____________'}
                                    </div>
                                </div>
                                <div className="border border-gray-400 p-2 text-right">
                                    <div className="text-gray-500">COMPUTER DATA ENTRY</div>
                                    <div className="font-bold mt-1">{prod.computerEntry ? 'Done' : 'Pending'}</div>
                                </div>
                            </div>

                            {/* Generated Timestamp */}
                            <div className="mt-3 pt-2 border-t border-gray-300 text-[9px] text-gray-400 flex justify-between">
                                <span>Generated: {new Date().toLocaleString()}</span>
                                <span>Page 1 of 1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Finish Wizard & Generate Bundles
    const handleFinishWizard = () => {
        const generatedBundles = [];
        let bundleCounter = 1;

        newProduction.lots.forEach(lot => {
            // Find source roll details for traceability
            const sourceRoll = cottonRolls.find(r => r.id === lot.sourceRollId);

            // Calculate weight per bundle (Distribute lot weight across sizes)
            // Assuming the lot covers all standard sizes
            const weightPerBundle = (lot.nw / STANDARD_SIZES.length);

            STANDARD_SIZES.forEach(size => {
                generatedBundles.push({
                    id: `${newProduction.productionNo}-${bundleCounter++}`,
                    production: newProduction.productionNo,
                    colour: lot.colour,
                    nw: parseFloat(weightPerBundle.toFixed(2)),
                    meters: parseFloat((weightPerBundle * 1.68).toFixed(1)), // 1.68 shrinkage factor
                    size: size,
                    pieces: newProduction.piecesPerBundle || 10,
                    product: newProduction.product || 'Track Pants',
                    sourceRollId: lot.sourceRollId || 'N/A',
                    sourceRollColor: sourceRoll?.color || lot.colour,
                    stage: 'Cutting',
                    currentWorker: null,
                    currentOperation: null,
                    operationsCompleted: {}
                });
            });
        });

        // Add to shared context
        addBundles(generatedBundles);

        // Reset and close
        setShowWizard(false);
        // Optional: Switch to bundles view to show result
        setCurrentPage('bundles');
    };

    // Production Wizard Modal
    const ProductionWizard = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            {wizardStep === 1 ? 'Create New Production' : wizardStep === 2 ? 'Add Lots (Color/Size/Bundles)' : 'Review & Generate'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Step {wizardStep} of 3</p>
                    </div>
                    <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                {/* Step Indicator */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${wizardStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {wizardStep > step ? <Check size={14} /> : step}
                                </div>
                                {step < 3 && <div className={`w-12 h-0.5 mx-1 ${wizardStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-auto">
                    {wizardStep === 1 && (
                        <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-500 mb-1">Production Number</label>
                                    <input type="text" value={newProduction.productionNo} onChange={(e) => setNewProduction({ ...newProduction, productionNo: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-blue-600" />
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">Date</label>
                                    <input type="text" value={newProduction.date} className="w-full px-3 py-2 border rounded-lg bg-gray-50" readOnly />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-500 mb-1">Cloth Type</label>
                                    <select value={newProduction.clothType} onChange={(e) => setNewProduction({ ...newProduction, clothType: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                        <option>Terry Cotton</option>
                                        <option>Fleece</option>
                                        <option>Polyester</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-500 mb-1">Product Type</label>
                                    <select value={newProduction.product} onChange={(e) => setNewProduction({ ...newProduction, product: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                        <option>Track Pants</option>
                                        <option>Shirts</option>
                                        <option>Jackets</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">Pieces per Bundle</label>
                                <input type="number" value={newProduction.piecesPerBundle} onChange={(e) => setNewProduction({ ...newProduction, piecesPerBundle: parseInt(e.target.value) })} className="w-32 px-3 py-2 border rounded-lg" />
                                <span className="text-gray-400 ml-2">pieces in each bundle</span>
                            </div>
                        </div>
                    )}

                    {wizardStep === 2 && (
                        <div className="space-y-4 text-xs">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                                <strong>Production {newProduction.productionNo}</strong> | Style: {newProduction.styleName || 'N/A'} | Average: {newProduction.average} pcs/bundle
                            </div>

                            {/* Quick Add Lot Entry - matches actual cutting sheet columns */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="font-medium text-gray-700 mb-2">Add Lot Entry (Each row = 1 cutting lot)</div>
                                <div className="grid grid-cols-6 gap-2 items-end">
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Source Roll</label>
                                        <select
                                            value={newLotEntry.sourceRollId}
                                            onChange={(e) => {
                                                const roll = cottonRolls.find(r => r.id === e.target.value);
                                                setNewLotEntry({ ...newLotEntry, sourceRollId: e.target.value, colour: roll?.color || newLotEntry.colour });
                                            }}
                                            className="w-full px-2 py-1.5 border rounded-lg text-xs"
                                        >
                                            <option value="">Select Roll</option>
                                            {cottonRolls.filter(r => r.status !== 'Depleted').map(roll => (
                                                <option key={roll.id} value={roll.id}>{roll.id.slice(-7)} - {roll.color} ({roll.remaining}kg)</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">COLOUR</label>
                                        <select value={newLotEntry.colour} onChange={(e) => setNewLotEntry({ ...newLotEntry, colour: e.target.value })} className="w-full px-2 py-1.5 border rounded-lg text-xs">
                                            {STANDARD_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">N.W. (kg)</label>
                                        <input type="number" step="0.1" value={newLotEntry.nw} onChange={(e) => setNewLotEntry({ ...newLotEntry, nw: parseFloat(e.target.value) || 0 })} placeholder="22.1" className="w-full px-2 py-1.5 border rounded-lg text-xs" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">PALLA</label>
                                        <input type="number" value={newLotEntry.palla} onChange={(e) => setNewLotEntry({ ...newLotEntry, palla: parseInt(e.target.value) || 1 })} placeholder="11" className="w-full px-2 py-1.5 border rounded-lg text-xs" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">BAL. WT.</label>
                                        <input type="number" step="0.01" value={newLotEntry.balWt || ''} onChange={(e) => setNewLotEntry({ ...newLotEntry, balWt: parseFloat(e.target.value) || null })} placeholder="1.94" className="w-full px-2 py-1.5 border rounded-lg text-xs" />
                                    </div>
                                    <div>
                                        <button onClick={addLotEntry} className="w-full px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">+ Add</button>
                                    </div>
                                </div>
                            </div>

                            {/* Lots Table - matches actual cutting sheet */}
                            {newProduction.lots.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-2 font-semibold text-gray-600">Sr.No</th>
                                                <th className="text-left p-2 font-semibold text-gray-600">COLOUR</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">N.W.</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">PALLA</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">TOTAL</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">BAL.WT.</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">BAL.METER</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newProduction.lots.map(lot => (
                                                <tr key={lot.srNo} className="border-t">
                                                    <td className="p-2 font-bold">{lot.srNo}</td>
                                                    <td className="p-2">{lot.colour}</td>
                                                    <td className="p-2 text-center">{lot.nw?.toFixed(2)}</td>
                                                    <td className="p-2 text-center font-semibold">{lot.palla}</td>
                                                    <td className="p-2 text-center font-bold text-blue-600">{lot.total}</td>
                                                    <td className="p-2 text-center">{lot.balWt?.toFixed(3) || '-'}</td>
                                                    <td className="p-2 text-center text-gray-500">{lot.balMeter?.toFixed(1) || '-'}</td>
                                                    <td className="p-2 text-center">
                                                        <button onClick={() => removeLot(lot.srNo)} className="p-1 text-red-500 hover:text-red-700"><X size={14} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    No lots added yet. Add cutting records above.
                                </div>
                            )}

                            <div className="bg-gray-100 rounded-lg p-3 flex justify-between items-center font-semibold">
                                <span>Total: {newProduction.lots.length} Lots | {getTotalPalla(newProduction.lots)} Pallas | {getTotalNW(newProduction.lots).toFixed(2)} kg</span>
                                <span className="text-lg text-blue-600">Grand Total: {getTotalPalla(newProduction.lots) * STANDARD_SIZES.length} pcs</span>
                            </div>
                        </div>
                    )}

                    {wizardStep === 3 && (
                        <div className="space-y-4 text-xs">
                            {/* Preview matches physical cutting sheet */}
                            <div className="bg-white border-2 border-gray-200 rounded-lg p-4" style={{ fontFamily: 'monospace' }}>
                                <div className="text-center font-semibold text-gray-700 mb-3 border-b pb-2">CUTTING SHEET PREVIEW</div>
                                <div className="grid grid-cols-2 gap-2 text-gray-600 mb-3">
                                    <div><span className="text-gray-400">Production No:</span> <span className="font-bold text-blue-600 text-lg">{newProduction.productionNo}</span></div>
                                    <div><span className="text-gray-400">Date:</span> {newProduction.date}</div>
                                    <div><span className="text-gray-400">Style:</span> {newProduction.styleName || 'N/A'}</div>
                                    <div><span className="text-gray-400">Average:</span> {newProduction.average} pcs/bundle</div>
                                </div>
                                <table className="w-full border text-[10px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border p-1.5 text-left">Sr.No</th>
                                            <th className="border p-1.5 text-left">COLOUR</th>
                                            <th className="border p-1.5 text-center">N.W.</th>
                                            <th className="border p-1.5 text-center">PALLA</th>
                                            <th className="border p-1.5 text-center">TOTAL</th>
                                            <th className="border p-1.5 text-center">BAL.WT.</th>
                                            <th className="border p-1.5 text-center">BAL.METER</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newProduction.lots.map(lot => (
                                            <tr key={lot.srNo}>
                                                <td className="border p-1.5 font-bold">{lot.srNo}</td>
                                                <td className="border p-1.5">{lot.colour}</td>
                                                <td className="border p-1.5 text-center">{lot.nw?.toFixed(2)}</td>
                                                <td className="border p-1.5 text-center">{lot.palla}</td>
                                                <td className="border p-1.5 text-center font-bold">{lot.total}</td>
                                                <td className="border p-1.5 text-center">{lot.balWt?.toFixed(3) || '-'}</td>
                                                <td className="border p-1.5 text-center">{lot.balMeter?.toFixed(1) || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-3 text-center font-semibold bg-blue-50 p-2 rounded">
                                    TOTAL: {newProduction.lots.length} Lots | {getTotalPalla(newProduction.lots)} Pallas | <span className="text-blue-600 text-base">{getTotalPalla(newProduction.lots) * STANDARD_SIZES.length} Pieces</span>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="font-medium text-green-700 mb-2">On Confirm, system will:</div>
                                <div className="space-y-1 text-green-600">
                                    <div className="flex items-center gap-2"><CheckCircle size={12} /> Generate {getTotalPalla(newProduction.lots)} Bundles ({newProduction.productionNo}-1 to {newProduction.productionNo}-{getTotalPalla(newProduction.lots)})</div>
                                    <div className="flex items-center gap-2"><CheckCircle size={12} /> Create printable cutting sheet</div>
                                    <div className="flex items-center gap-2"><CheckCircle size={12} /> Update cotton roll remaining weights</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-between">
                    <button
                        onClick={() => wizardStep > 1 ? setWizardStep(wizardStep - 1) : setShowWizard(false)}
                        className="px-4 py-2 border rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1"
                    >
                        <ChevronLeft size={14} /> {wizardStep === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button
                        onClick={() => wizardStep < 3 ? setWizardStep(wizardStep + 1) : handleFinishWizard()}
                        disabled={wizardStep === 2 && newProduction.lots.length === 0}
                        className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1 ${wizardStep === 2 && newProduction.lots.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {wizardStep === 3 ? (<><Check size={14} /> Confirm & Generate</>) : (<>Next <ChevronRight size={14} /></>)}
                    </button>
                </div>
            </div>
        </div>
    );

    // Palla Modal State
    const [pallaFormData, setPallaFormData] = useState({
        rollId: '',
        tableId: 3,
        layers: 100,
        operator: OPERATORS[0]
    });

    // Start Palla Handler
    const handleStartPalla = () => {
        const selectedRoll = cottonRolls.find(r => r.id === pallaFormData.rollId);
        if (!selectedRoll) return;

        // Update cutting table with the new palla info
        setCuttingTables(prev => prev.map(t =>
            t.id === pallaFormData.tableId ? {
                ...t,
                status: 'Layering',
                currentRollId: pallaFormData.rollId,
                currentColor: selectedRoll.color,
                pallaCount: pallaFormData.layers,
                operator: pallaFormData.operator,
                startTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
            } : t
        ));

        // Update cotton roll status to In-Use
        setCottonRolls(prev => prev.map(r =>
            r.id === pallaFormData.rollId ? { ...r, status: 'In Use' } : r
        ));

        setShowPallaModal(false);
    };

    // Palla Modal
    const PallaModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[500px] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Start Palla (Layering)</h3>
                    <button onClick={() => setShowPallaModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4 text-xs">
                    <div>
                        <label className="block text-gray-500 mb-1">Cotton Roll *</label>
                        <select
                            value={pallaFormData.rollId}
                            onChange={(e) => setPallaFormData({ ...pallaFormData, rollId: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            <option value="">Select a roll</option>
                            {cottonRolls.filter(r => r.status === 'Available').map(roll => (
                                <option key={roll.id} value={roll.id}>{roll.id} - {roll.vendor} - {roll.color} ({roll.remaining} kg)</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Layering Table *</label>
                            <select
                                value={pallaFormData.tableId}
                                onChange={(e) => setPallaFormData({ ...pallaFormData, tableId: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                {cuttingTables.filter(t => t.status === 'Available').map(table => (
                                    <option key={table.id} value={table.id}>{table.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Number of Layers</label>
                            <input
                                type="number"
                                value={pallaFormData.layers}
                                onChange={(e) => setPallaFormData({ ...pallaFormData, layers: parseInt(e.target.value) || 100 })}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500 mb-1">Operator</label>
                        <select
                            value={pallaFormData.operator}
                            onChange={(e) => setPallaFormData({ ...pallaFormData, operator: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        >
                            {OPERATORS.map(op => (
                                <option key={op} value={op}>{op}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                    <button onClick={() => setShowPallaModal(false)} className="px-4 py-2 border rounded-lg text-xs font-medium">Cancel</button>
                    <button
                        onClick={handleStartPalla}
                        disabled={!pallaFormData.rollId}
                        className={`px-4 py-2 rounded-lg text-xs font-medium ${pallaFormData.rollId ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        Start Palla
                    </button>
                </div>
            </div>
        </div>
    );

    // Tab Navigation
    const TabNav = () => (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg mb-4">
            <NavButton icon={FileText} label="Job Orders" page="job-orders" />
            <NavButton icon={Layers} label="Cotton Rolls & Palla" page="cotton-rolls" />
            <NavButton icon={Scissors} label="Cutting Sheets" page="cutting-sheets" />
            <NavButton icon={Box} label="Kanban View" page="bundles" />
        </div>
    );

    // Render
    if (embedded) {
        return (
            <div className="text-sm">
                {showWizard && <ProductionWizard />}
                {showPrintPreview && <PrintPreviewModal />}
                {showPallaModal && <PallaModal />}

                {/* Add Roll Modal - render in embedded mode */}
                {showAddRollModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-[500px] shadow-2xl">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">Add New Cotton Roll</h3>
                                    <p className="text-xs text-gray-500">Roll ID will be auto-generated</p>
                                </div>
                                <button onClick={() => setShowAddRollModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Vendor *</label>
                                        <input
                                            type="text"
                                            value={newRoll.vendor}
                                            onChange={(e) => setNewRoll(r => ({ ...r, vendor: e.target.value }))}
                                            placeholder="e.g., XYZ Mills"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Cloth Type</label>
                                        <select
                                            value={newRoll.clothType}
                                            onChange={(e) => setNewRoll(r => ({ ...r, clothType: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        >
                                            {CLOTH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                                        <select
                                            value={newRoll.color}
                                            onChange={(e) => setNewRoll(r => ({ ...r, color: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        >
                                            {STANDARD_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            value={newRoll.weight}
                                            onChange={(e) => setNewRoll(r => ({ ...r, weight: parseFloat(e.target.value) }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Rate (₹/kg)</label>
                                        <input
                                            type="number"
                                            value={newRoll.rate}
                                            onChange={(e) => setNewRoll(r => ({ ...r, rate: parseFloat(e.target.value) }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => setShowAddRollModal(false)} className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    onClick={addCottonRoll}
                                    disabled={!newRoll.vendor}
                                    className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Plus size={14} className="inline mr-1" /> Add Roll
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bulk Import Modal - render in embedded mode */}
                {showBulkImportModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-[600px] max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-green-50">
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800">Bulk Import Cotton Rolls</h3>
                                    <p className="text-xs text-gray-500">Paste data from Excel or enter manually</p>
                                </div>
                                <button onClick={() => { setShowBulkImportModal(false); setBulkImportText(''); setBulkImportPreview([]); }} className="text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-4 flex-1 overflow-auto space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                        Paste data (Format: Vendor, ClothType, Color, Weight, Rate - one per line)
                                    </label>
                                    <textarea
                                        value={bulkImportText}
                                        onChange={(e) => { setBulkImportText(e.target.value); parseBulkImport(e.target.value); }}
                                        placeholder="XYZ Mills, Terry Cotton, Black, 45, 430
PQR Fabrics, Fleece, Navy, 60, 450"
                                        className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
                                    />
                                </div>
                                {bulkImportPreview.length > 0 && (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 border-b">
                                            Preview: {bulkImportPreview.filter(r => r.valid).length} valid, {bulkImportPreview.filter(r => !r.valid).length} errors
                                        </div>
                                        <div className="max-h-48 overflow-auto">
                                            {bulkImportPreview.map((row, idx) => (
                                                <div key={idx} className={`px-3 py-2 text-xs flex items-center gap-2 ${row.valid ? 'bg-green-50' : 'bg-red-50'} border-b last:border-b-0`}>
                                                    {row.valid ? (
                                                        <>
                                                            <Check size={12} className="text-green-600" />
                                                            <span className="font-medium">{row.vendor}</span>
                                                            <span className="text-gray-400">|</span>
                                                            <span>{row.clothType}</span>
                                                            <span className="text-gray-400">|</span>
                                                            <span>{row.color}</span>
                                                            <span className="text-gray-400">|</span>
                                                            <span>{row.weight} kg</span>
                                                            <span className="text-gray-400">|</span>
                                                            <span>₹{row.rate}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X size={12} className="text-red-600" />
                                                            <span className="text-red-600">{row.error}: {row.raw}</span>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => { setShowBulkImportModal(false); setBulkImportText(''); setBulkImportPreview([]); }} className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                                    Cancel
                                </button>
                                <button
                                    onClick={executeBulkImport}
                                    disabled={bulkImportPreview.filter(r => r.valid).length === 0}
                                    className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    Import {bulkImportPreview.filter(r => r.valid).length} Rolls
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <TabNav />
                {currentPage === 'job-orders' && renderJobOrdersPage()}
                {currentPage === 'cotton-rolls' && renderCottonRollsPage()}
                {currentPage === 'cutting-sheets' && renderCuttingSheetsPage()}
                {currentPage === 'bundles' && renderBundlesPage()}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex text-sm">
            {showWizard && <ProductionWizard />}
            {showPrintPreview && <PrintPreviewModal />}
            {showPallaModal && <PallaModal />}

            {/* Add Roll Modal - Moved to top level to fix input focus issue */}
            {showAddRollModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[500px] shadow-2xl">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-50">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Add New Cotton Roll</h3>
                                <p className="text-xs text-gray-500">Roll ID will be auto-generated</p>
                            </div>
                            <button onClick={() => setShowAddRollModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Vendor *</label>
                                    <input
                                        type="text"
                                        value={newRoll.vendor}
                                        onChange={(e) => setNewRoll(r => ({ ...r, vendor: e.target.value }))}
                                        placeholder="ABC Textiles"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Invoice No</label>
                                    <input
                                        type="text"
                                        value={newRoll.invoiceNo}
                                        onChange={(e) => setNewRoll(r => ({ ...r, invoiceNo: e.target.value }))}
                                        placeholder="INV-12345"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Cloth Type</label>
                                    <select
                                        value={newRoll.clothType}
                                        onChange={(e) => setNewRoll(r => ({ ...r, clothType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option>Terry Cotton</option>
                                        <option>Fleece</option>
                                        <option>2-Way Zuric</option>
                                        <option>Interlock</option>
                                        <option>Rib</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                                    <select
                                        value={newRoll.color}
                                        onChange={(e) => setNewRoll(r => ({ ...r, color: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        {STANDARD_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">GSM</label>
                                    <input
                                        type="number"
                                        value={newRoll.gsm}
                                        onChange={(e) => setNewRoll(r => ({ ...r, gsm: parseInt(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Width (in)</label>
                                    <input
                                        type="number"
                                        value={newRoll.width}
                                        onChange={(e) => setNewRoll(r => ({ ...r, width: parseInt(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        value={newRoll.weight}
                                        onChange={(e) => setNewRoll(r => ({ ...r, weight: parseFloat(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Rate (₹/kg)</label>
                                    <input
                                        type="number"
                                        value={newRoll.rate}
                                        onChange={(e) => setNewRoll(r => ({ ...r, rate: parseFloat(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => setShowAddRollModal(false)} className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={addCottonRoll}
                                disabled={!newRoll.vendor}
                                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Plus size={14} className="inline mr-1" /> Add Roll
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Import Modal - Moved to top level */}
            {showBulkImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[600px] max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-green-50">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Bulk Import Cotton Rolls</h3>
                                <p className="text-xs text-gray-500">Paste from Excel or upload CSV</p>
                            </div>
                            <button onClick={() => setShowBulkImportModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Paste rows (Tab-separated: Vendor | Color | ClothType | Weight | Rate)
                                </label>
                                <textarea
                                    value={bulkImportText}
                                    onChange={(e) => { setBulkImportText(e.target.value); parseBulkImport(e.target.value); }}
                                    placeholder="ABC Textiles	Navy	Terry Cotton	50	450
XYZ Mills	Black	Fleece	45	380"
                                    className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono"
                                />
                            </div>

                            {bulkImportPreview.length > 0 && (
                                <div>
                                    <div className="text-xs font-medium text-gray-600 mb-2">
                                        Preview: {bulkImportPreview.filter(r => r.valid).length} valid, {bulkImportPreview.filter(r => !r.valid).length} errors
                                    </div>
                                    <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                                        {bulkImportPreview.map((row, idx) => (
                                            <div key={idx} className={`px-3 py-2 text-xs flex items-center gap-2 border-b border-gray-100 last:border-0 ${row.valid ? 'bg-green-50' : 'bg-red-50'}`}>
                                                {row.valid ? (
                                                    <>
                                                        <Check size={12} className="text-green-600" />
                                                        <span>{row.vendor}</span>
                                                        <span className="text-gray-400">|</span>
                                                        <span>{row.color}</span>
                                                        <span className="text-gray-400">|</span>
                                                        <span>{row.clothType}</span>
                                                        <span className="text-gray-400">|</span>
                                                        <span>{row.weight} kg</span>
                                                        <span className="text-gray-400">|</span>
                                                        <span>₹{row.rate}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <X size={12} className="text-red-600" />
                                                        <span className="text-red-600">{row.error}: {row.raw}</span>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => { setShowBulkImportModal(false); setBulkImportText(''); setBulkImportPreview([]); }} className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button
                                onClick={executeBulkImport}
                                disabled={bulkImportPreview.filter(r => r.valid).length === 0}
                                className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                                Import {bulkImportPreview.filter(r => r.valid).length} Rolls
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <aside className="w-56 bg-white shadow-lg p-4 space-y-1">
                <div className="mb-6">
                    <h2 className="text-base font-bold text-gray-800">Production</h2>
                    <p className="text-xs text-gray-500">Manufacturing Flow</p>
                </div>
                <NavButton icon={Layers} label="Cotton Rolls & Palla" page="cotton-rolls" />
                <NavButton icon={Scissors} label="Cutting Sheets" page="cutting-sheets" />
                <NavButton icon={Box} label="Bundles" page="bundles" />
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                {currentPage === 'job-orders' && renderJobOrdersPage()}
                {currentPage === 'cotton-rolls' && renderCottonRollsPage()}
                {currentPage === 'cutting-sheets' && renderCuttingSheetsPage()}
                {currentPage === 'bundles' && renderBundlesPage()}
            </main>
        </div>
    );
};

export default ProductionSystem;

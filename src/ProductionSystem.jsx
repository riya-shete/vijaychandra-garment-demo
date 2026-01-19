import React, { useState } from 'react';
import { Plus, Search, Edit, Eye, ChevronRight, ChevronLeft, X, Check, Printer, Layers, Scissors, Box, CheckCircle, Clock, ArrowRight, Download, FileText } from 'lucide-react';

const ProductionSystem = ({ embedded = false }) => {
    const [currentPage, setCurrentPage] = useState('cotton-rolls');
    const [showWizard, setShowWizard] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [selectedProduction, setSelectedProduction] = useState(null);
    const [showPallaModal, setShowPallaModal] = useState(false);

    // Sample Data - Cotton Rolls
    const [cottonRolls] = useState([
        { id: 'CR-20260115-001', date: '15-Jan-2026', vendor: 'ABC Textiles', clothType: 'Terry Cotton', weight: 50, remaining: 45, color: 'Grey', grade: 'A', status: 'Available' },
        { id: 'CR-20260115-002', date: '15-Jan-2026', vendor: 'XYZ Mills', clothType: 'Fleece', weight: 45, remaining: 20, color: 'Navy', grade: 'A', status: 'In Use' },
        { id: 'CR-20260114-001', date: '14-Jan-2026', vendor: 'PQR Fabrics', clothType: 'Terry Cotton', weight: 60, remaining: 0, color: 'Black', grade: 'B', status: 'Depleted' },
    ]);

    // Sample Data - Palla (Layering) Records
    const [pallaRecords] = useState([
        { id: 'PL-001', cottonRoll: 'CR-20260115-001', table: 'Table 1', layers: 100, operator: 'Ramesh', startTime: '10:00 AM', status: 'Completed', date: '15-Jan-2026' },
        { id: 'PL-002', cottonRoll: 'CR-20260115-002', table: 'Table 2', layers: 80, operator: 'Suresh', startTime: '11:00 AM', status: 'In Progress', date: '15-Jan-2026' },
    ]);

    // Sample Data - Productions/Cutting Sheets 
    // NOTE: This document is created AFTER cutting happens - it records what was actually cut
    // Columns from ACTUAL physical sheet: Sr No, COLOUR, N.W., PALLA, TOTAL, BAL. WT., BAL. METER, PANNA
    const [productions] = useState([
        {
            id: '7507',
            date: '18-12-2025',
            tableNo: '1',
            styleName: 'Raftaar Kids Cutting',
            average: 6,
            // Size breakdown - pieces per bundle for each size
            sizeBreakdown: {
                '20': 1, '22': 1, '24': 1, '26': 1, '28': 1, '30': 1, '32': 1, '34': 1, '36': 1
            },
            // Source tracking
            sourceCottonRoll: 'CR-20260115-001',
            master: 'Rajesh',
            approvalStatus: 'Approved',
            computerEntry: true,
            // Lots - ACTUAL columns: Sr No, COLOUR, N.W., PALLA, TOTAL, BAL. WT., BAL. METER, PANNA
            lots: [
                { srNo: 1, colour: 'D. Grey', nw: 2.21, palla: 11, total: 11, balWt: 1.940, balMeter: null, panna: null },
                { srNo: 2, colour: 'Navy', nw: 17.150, palla: 12, total: 23, balWt: 8.405, balMeter: null, panna: null },
                { srNo: 3, colour: 'Black', nw: 15.95, palla: 10, total: 33, balWt: 0.819, balMeter: null, panna: null },
                { srNo: 4, colour: 'D. Grey', nw: 11.31, palla: 6, total: 39, balWt: null, balMeter: null, panna: null },
                { srNo: 5, colour: 'Black', nw: 78.47, palla: 4, total: 43, balWt: 1.127, balMeter: null, panna: null },
                { srNo: 6, colour: 'Navy', nw: 18.69, palla: 11, total: 54, balWt: null, balMeter: null, panna: null },
                { srNo: 7, colour: 'Black', nw: 16.640, palla: 7, total: 61, balWt: 1.680, balMeter: null, panna: null },
                { srNo: 8, colour: 'D. Grey', nw: 22.1, palla: 11, total: 72, balWt: null, balMeter: null, panna: null },
                { srNo: 9, colour: 'Navy', nw: 15.250, palla: 12, total: 84, balWt: 1.585, balMeter: null, panna: null },
                { srNo: 10, colour: 'Black', nw: 11.33, palla: 7, total: 91, balWt: null, balMeter: null, panna: null },
                { srNo: 11, colour: 'D. Grey', nw: 26.870, palla: 141, total: 105, balWt: 0.730, balMeter: null, panna: null },
                { srNo: 12, colour: 'Black', nw: 26.960, palla: 14, total: 119, balWt: 0.436, balMeter: null, panna: null },
                { srNo: 13, colour: 'Navy', nw: 29.020, palla: 15, total: 134, balWt: null, balMeter: null, panna: null },
                { srNo: 14, colour: 'D. Grey', nw: 25.800, palla: 8, total: 142, balWt: null, balMeter: null, panna: null },
                { srNo: 15, colour: 'Black', nw: 27.700, palla: 8, total: 150, balWt: null, balMeter: null, panna: null },
            ],
            // Row 16: x16 (multiply by 16?)
            // Row 17: 1500 total
            grandTotal: 1500,
            status: 'Completed'
        },
        {
            id: '7506',
            date: '14-Jan-2026',
            tableNo: '2',
            styleName: 'Speedo Track Pants',
            average: 5.5,
            sizeBreakdown: {
                '20': 1, '22': 1, '24': 1, '26': 1, '28': 1, '30': 1, '32': 1, '34': 1, '36': 1
            },
            sourceCottonRoll: 'CR-20260114-001',
            master: 'Sunil',
            approvalStatus: 'Pending',
            computerEntry: false,
            lots: [
                { srNo: 1, colour: 'D. Grey', nw: 22.1, palla: 11, total: 11, balWt: 1.940, balMeter: null, panna: null },
                { srNo: 2, colour: 'Black', nw: 17.50, palla: 12, total: 23, balWt: 0.800, balMeter: null, panna: null },
                { srNo: 3, colour: 'Navy', nw: 15.95, palla: 10, total: 33, balWt: 0.650, balMeter: null, panna: null },
            ],
            grandTotal: 264,
            status: 'In Progress'
        },
    ]);

    // Generate bundles from production lots - using new column names
    const generateBundles = (production) => {
        let bundles = [];
        let bundleCounter = 1;
        production.lots.forEach(lot => {
            // Use palla as the number of bundles
            const numBundles = lot.palla || 1;
            for (let i = 0; i < numBundles; i++) {
                bundles.push({
                    id: `${production.id}-${bundleCounter}`,
                    production: production.id,
                    srNo: lot.srNo,
                    colour: lot.colour,
                    nw: lot.nw,
                    stage: bundleCounter <= 10 ? 'Stitching' : bundleCounter <= 20 ? 'Ironing' : 'Cutting',
                    worker: bundleCounter % 3 === 0 ? 'Ramesh Kumar' : null
                });
                bundleCounter++;
            }
        });
        return bundles;
    };

    // Wizard State - updated for new structure
    const [newProduction, setNewProduction] = useState({
        productionNo: '7508',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        tableNo: '',
        styleName: '',
        average: 6,
        lots: []
    });

    const [newLotEntry, setNewLotEntry] = useState({ colour: 'D. Grey', nw: 0, palla: 1 });

    const addLotEntry = () => {
        const newLot = {
            srNo: newProduction.lots.length + 1,
            colour: newLotEntry.colour,
            nw: parseFloat(newLotEntry.nw),
            palla: parseInt(newLotEntry.palla),
            total: (newProduction.lots.length > 0 ? newProduction.lots[newProduction.lots.length - 1].total : 0) + parseInt(newLotEntry.palla),
            balWt: null,
            balMeter: null,
            panna: null
        };
        setNewProduction({ ...newProduction, lots: [...newProduction.lots, newLot] });
        setNewLotEntry({ colour: 'D. Grey', nw: 0, palla: 1 });
    };

    const removeLot = (srNo) => {
        const updatedLots = newProduction.lots.filter(l => l.srNo !== srNo).map((l, idx) => ({ ...l, srNo: idx + 1 }));
        setNewProduction({ ...newProduction, lots: updatedLots });
    };

    // Updated helper functions using new column names
    const getTotalPalla = (lots) => lots.reduce((sum, l) => sum + (l.palla || 0), 0);
    const getTotalNW = (lots) => lots.reduce((sum, l) => sum + (l.nw || 0), 0);
    const getGrandTotal = (prod) => prod.grandTotal || (prod.lots.length > 0 ? prod.lots[prod.lots.length - 1].total : 0);

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

    // Cotton Rolls Page
    const CottonRollsPage = () => (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Cotton Rolls</h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                    <Plus size={14} /> Add Roll Receipt
                </button>
            </div>

            {/* Info Card - Weight Conversion */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                <strong>Weight Conversion:</strong> 1 kg ≈ 50 meters | For reference, 1500 meters ≈ 30 kg
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Rolls</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{cottonRolls.length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100 bg-green-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-green-600">Available</div>
                    <div className="text-xl font-bold text-green-700 mt-1">{cottonRolls.filter(r => r.status === 'Available').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-100 bg-blue-50/30" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-blue-600">In Use</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">{cottonRolls.filter(r => r.status === 'In Use').length}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="text-xs text-gray-500">Total Remaining (kg)</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{cottonRolls.reduce((sum, r) => sum + r.remaining, 0)}</div>
                </div>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left p-3 font-semibold text-gray-600">Roll ID</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Date</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Vendor</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Cloth</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Color</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Weight</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Remaining</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cottonRolls.map((roll) => (
                            <tr key={roll.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                <td className="p-3 font-mono text-blue-600 font-medium">{roll.id}</td>
                                <td className="p-3 text-gray-600">{roll.date}</td>
                                <td className="p-3 font-medium text-gray-900">{roll.vendor}</td>
                                <td className="p-3 text-gray-600">{roll.clothType}</td>
                                <td className="p-3 text-gray-600">{roll.color}</td>
                                <td className="p-3 text-center text-gray-600">{roll.weight} kg</td>
                                <td className="p-3 text-center font-semibold text-gray-800">{roll.remaining} kg</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-semibold ${roll.status === 'Available' ? 'bg-green-50 text-green-700' : roll.status === 'In Use' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{roll.status}</span>
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => setShowPallaModal(true)}
                                        className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-medium hover:bg-blue-700"
                                    >
                                        → Palla
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Palla Records */}
            <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Palla (Layering) Records</h3>
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
                    <table className="w-full text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left p-3 font-semibold text-gray-600">Palla ID</th>
                                <th className="text-left p-3 font-semibold text-gray-600">Cotton Roll</th>
                                <th className="text-left p-3 font-semibold text-gray-600">Table</th>
                                <th className="text-center p-3 font-semibold text-gray-600">Layers</th>
                                <th className="text-left p-3 font-semibold text-gray-600">Operator</th>
                                <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                                <th className="text-center p-3 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pallaRecords.map((palla) => (
                                <tr key={palla.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                    <td className="p-3 font-mono text-blue-600 font-medium">{palla.id}</td>
                                    <td className="p-3 text-gray-600">{palla.cottonRoll}</td>
                                    <td className="p-3 text-gray-600">{palla.table}</td>
                                    <td className="p-3 text-center font-semibold">{palla.layers}</td>
                                    <td className="p-3 text-gray-600">{palla.operator}</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-semibold ${palla.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{palla.status}</span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => { setShowWizard(true); setWizardStep(1); }}
                                            className="px-2 py-1 bg-green-600 text-white rounded text-[10px] font-medium hover:bg-green-700"
                                        >
                                            → Cut
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // Cutting Sheets Page - SHOW ALL FIELDS
    const CuttingSheetsPage = () => (
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
                                            {prod.approvalStatus === 'Approved' ? '✓' : '○'}
                                        </span>
                                    </td>
                                    <td className="p-2 text-center">
                                        <span className={`text-lg ${prod.computerEntry ? 'text-green-600' : 'text-gray-400'}`}>
                                            {prod.computerEntry ? '✓' : '○'}
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
    const BundlesPage = () => {
        const allBundles = productions.flatMap(p => generateBundles(p)).slice(0, 30);
        const stages = ['Cutting', 'Printing', 'Stitching', 'Ironing', 'Packaging', 'Complete'];

        // State for drag and drop
        const [bundles, setBundles] = useState(allBundles);
        const [draggedBundle, setDraggedBundle] = useState(null);
        const [dragOverStage, setDragOverStage] = useState(null);
        const [searchQuery, setSearchQuery] = useState('');
        const [selectedProduction, setSelectedProductionFilter] = useState('all');

        // Filter bundles
        const filteredBundles = bundles.filter(b => {
            const matchesSearch = searchQuery === '' || b.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesProduction = selectedProduction === 'all' || b.production === selectedProduction;
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

        // Stage column colors
        const getStageStyles = (stage) => {
            const styles = {
                'Cutting': { bg: 'bg-gradient-to-b from-slate-50 to-slate-100', border: 'border-slate-200', header: 'bg-slate-600', icon: '✂️' },
                'Printing': { bg: 'bg-gradient-to-b from-amber-50 to-amber-100', border: 'border-amber-200', header: 'bg-amber-500', icon: '🖨️' },
                'Stitching': { bg: 'bg-gradient-to-b from-blue-50 to-blue-100', border: 'border-blue-200', header: 'bg-blue-600', icon: '🧵' },
                'Ironing': { bg: 'bg-gradient-to-b from-purple-50 to-purple-100', border: 'border-purple-200', header: 'bg-purple-600', icon: '🔥' },
                'Packaging': { bg: 'bg-gradient-to-b from-teal-50 to-teal-100', border: 'border-teal-200', header: 'bg-teal-600', icon: '📦' },
                'Complete': { bg: 'bg-gradient-to-b from-green-50 to-green-100', border: 'border-green-200', header: 'bg-green-600', icon: '✅' },
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
                            📋 Production Kanban Board
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">Drag and drop bundles to move through production stages</p>
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

                {/* Info Card */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-3 text-xs flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-lg">💡</div>
                    <div>
                        <strong className="text-indigo-700">Tip:</strong>
                        <span className="text-indigo-600 ml-1">Drag bundle cards between columns to update their stage, or click the arrow button to move to the next stage.</span>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Bundle ID (e.g., 7507-5)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <select
                        value={selectedProduction}
                        onChange={(e) => setSelectedProductionFilter(e.target.value)}
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
                                {/* Column Header */}
                                <div className={`${stageStyles.header} text-white rounded-t-lg px-3 py-2.5 flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">{stageStyles.icon}</span>
                                        <span className="font-semibold text-xs">{stage}</span>
                                    </div>
                                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        {stageBundles.length}
                                    </span>
                                </div>

                                {/* Cards Container */}
                                <div className="p-2 space-y-2 max-h-[420px] overflow-y-auto">
                                    {stageBundles.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-xs">
                                            <div className="text-2xl mb-2 opacity-50">📭</div>
                                            No bundles
                                        </div>
                                    ) : (
                                        stageBundles.map((bundle) => (
                                            <div
                                                key={bundle.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, bundle)}
                                                className={`bg-white rounded-lg p-2.5 border border-gray-200 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${draggedBundle?.id === bundle.id ? 'opacity-50 scale-95' : ''}`}
                                                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                                            >
                                                {/* Card Header */}
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-xs font-bold text-blue-600">
                                                        {bundle.id}
                                                    </span>
                                                    <div className={`w-3 h-3 rounded-full ${getColorBadge(bundle.colour)}`} title={bundle.colour}></div>
                                                </div>

                                                {/* Card Details */}
                                                <div className="space-y-1 text-[10px] text-gray-600">
                                                    <div className="flex justify-between">
                                                        <span>Production:</span>
                                                        <span className="font-medium text-gray-800">{bundle.production}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Color:</span>
                                                        <span className="font-medium text-gray-800">{bundle.colour}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>N.W.:</span>
                                                        <span className="font-medium text-gray-800">{bundle.nw?.toFixed(2) || '-'} kg</span>
                                                    </div>
                                                    {bundle.worker && (
                                                        <div className="flex justify-between">
                                                            <span>Worker:</span>
                                                            <span className="font-medium text-gray-800">{bundle.worker}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Move Button */}
                                                {stage !== 'Complete' && (
                                                    <button
                                                        onClick={() => moveToNextStage(bundle)}
                                                        className="w-full mt-2 px-2 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-[10px] font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-1"
                                                    >
                                                        Move to {stages[stages.indexOf(stage) + 1]}
                                                        <ChevronRight size={12} />
                                                    </button>
                                                )}

                                                {stage === 'Complete' && (
                                                    <div className="w-full mt-2 px-2 py-1.5 bg-green-100 text-green-700 rounded-md text-[10px] font-semibold text-center flex items-center justify-center gap-1">
                                                        <CheckCircle size={12} />
                                                        Completed
                                                    </div>
                                                )}
                                            </div>
                                        ))
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
                        <h3 className="text-lg font-semibold">📄 Cutting Sheet - Production {prod.id}</h3>
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
                                    <div className="font-bold mt-1">{prod.computerEntry ? '✓ Done' : '○ Pending'}</div>
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

    // Production Wizard Modal
    const ProductionWizard = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            📋 {wizardStep === 1 ? 'Create New Production' : wizardStep === 2 ? 'Add Lots (Color/Size/Bundles)' : 'Review & Generate'}
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
                                <strong>Production {newProduction.productionNo}</strong> | {newProduction.clothType} | {newProduction.product} | {newProduction.piecesPerBundle} pcs/bundle
                            </div>

                            {/* Quick Add Entry */}
                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <div className="font-medium text-gray-700 mb-2">Add Lot Entry:</div>
                                <div className="flex items-center gap-2">
                                    <select value={newLotEntry.color} onChange={(e) => setNewLotEntry({ ...newLotEntry, color: e.target.value })} className="px-3 py-2 border rounded-lg flex-1">
                                        <option>D. Grey</option>
                                        <option>Black</option>
                                        <option>Navy</option>
                                        <option>White</option>
                                        <option>Red</option>
                                    </select>
                                    <select value={newLotEntry.size} onChange={(e) => setNewLotEntry({ ...newLotEntry, size: e.target.value })} className="px-3 py-2 border rounded-lg">
                                        <option>20</option>
                                        <option>22</option>
                                        <option>24</option>
                                        <option>26</option>
                                        <option>28</option>
                                    </select>
                                    <input type="number" value={newLotEntry.bundles} onChange={(e) => setNewLotEntry({ ...newLotEntry, bundles: e.target.value })} placeholder="Bundles" className="w-20 px-3 py-2 border rounded-lg" />
                                    <button onClick={addLotEntry} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">+ Add</button>
                                </div>
                            </div>

                            {/* Lots Table */}
                            {newProduction.lots.length > 0 ? (
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left p-2 font-semibold text-gray-600">Lot</th>
                                                <th className="text-left p-2 font-semibold text-gray-600">Color</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">Size</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">Bundles</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">Pieces</th>
                                                <th className="text-center p-2 font-semibold text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newProduction.lots.map(lot => (
                                                <tr key={lot.lotNo} className="border-t">
                                                    <td className="p-2 font-bold">{lot.lotNo}</td>
                                                    <td className="p-2">{lot.color}</td>
                                                    <td className="p-2 text-center">{lot.size}</td>
                                                    <td className="p-2 text-center font-semibold">{lot.bundles}</td>
                                                    <td className="p-2 text-center">{lot.bundles * newProduction.piecesPerBundle}</td>
                                                    <td className="p-2 text-center">
                                                        <button onClick={() => removeLot(lot.lotNo)} className="p-1 text-red-500 hover:text-red-700"><X size={14} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    No lots added yet. Add color/size combinations above.
                                </div>
                            )}

                            <div className="bg-gray-100 rounded-lg p-3 text-center font-semibold">
                                Total: {newProduction.lots.length} Lots | {getTotalBundles(newProduction.lots)} Bundles | {getTotalPieces(newProduction.lots, newProduction.piecesPerBundle)} Pieces
                            </div>
                        </div>
                    )}

                    {wizardStep === 3 && (
                        <div className="space-y-4 text-xs">
                            {/* Preview matches physical document */}
                            <div className="bg-white border-2 border-gray-200 rounded-lg p-4" style={{ fontFamily: 'monospace' }}>
                                <div className="text-center font-semibold text-gray-700 mb-3 border-b pb-2">CUTTING SHEET PREVIEW</div>
                                <div className="grid grid-cols-2 gap-2 text-gray-600 mb-3">
                                    <div><span className="text-gray-400">Production No:</span> <span className="font-bold text-blue-600 text-lg">{newProduction.productionNo}</span></div>
                                    <div><span className="text-gray-400">Date:</span> {newProduction.date}</div>
                                    <div><span className="text-gray-400">Product:</span> {newProduction.product}</div>
                                    <div><span className="text-gray-400">Pieces/Bundle:</span> {newProduction.piecesPerBundle}</div>
                                </div>
                                <table className="w-full border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border p-2 text-left">Lot</th>
                                            <th className="border p-2 text-left">Color</th>
                                            <th className="border p-2 text-center">Size</th>
                                            <th className="border p-2 text-center">Bundles</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newProduction.lots.map(lot => (
                                            <tr key={lot.lotNo}>
                                                <td className="border p-2 font-bold">{lot.lotNo}</td>
                                                <td className="border p-2">{lot.color}</td>
                                                <td className="border p-2 text-center">{lot.size}</td>
                                                <td className="border p-2 text-center">{lot.bundles}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="mt-3 text-center font-semibold bg-gray-50 p-2 rounded">
                                    TOTAL: {newProduction.lots.length} Lots | {getTotalBundles(newProduction.lots)} Bundles | {getTotalPieces(newProduction.lots, newProduction.piecesPerBundle)} Pieces
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="font-medium text-green-700 mb-2">On Confirm, system will:</div>
                                <div className="space-y-1 text-green-600">
                                    <div className="flex items-center gap-2"><CheckCircle size={12} /> Generate {getTotalBundles(newProduction.lots)} Bundle IDs ({newProduction.productionNo}-1 to {newProduction.productionNo}-{getTotalBundles(newProduction.lots)})</div>
                                    <div className="flex items-center gap-2"><CheckCircle size={12} /> Create printable cutting sheet</div>
                                    <div className="flex items-center gap-2"><CheckCircle size={12} /> Mark bundles as ready for operations</div>
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
                        onClick={() => wizardStep < 3 ? setWizardStep(wizardStep + 1) : setShowWizard(false)}
                        disabled={wizardStep === 2 && newProduction.lots.length === 0}
                        className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1 ${wizardStep === 2 && newProduction.lots.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {wizardStep === 3 ? (<>✓ Confirm & Generate</>) : (<>Next <ChevronRight size={14} /></>)}
                    </button>
                </div>
            </div>
        </div>
    );

    // Palla Modal
    const PallaModal = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-[500px] overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">🧵 Start Palla (Layering)</h3>
                    <button onClick={() => setShowPallaModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4 text-xs">
                    <div>
                        <label className="block text-gray-500 mb-1">Cotton Roll</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                            {cottonRolls.filter(r => r.status === 'Available').map(roll => (
                                <option key={roll.id} value={roll.id}>{roll.id} - {roll.clothType} ({roll.remaining} kg)</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-500 mb-1">Layering Table</label>
                            <select className="w-full px-3 py-2 border rounded-lg">
                                <option>Table 1</option>
                                <option>Table 2</option>
                                <option>Table 3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-500 mb-1">Number of Layers</label>
                            <input type="number" defaultValue={100} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-500 mb-1">Operator</label>
                        <select className="w-full px-3 py-2 border rounded-lg">
                            <option>Ramesh</option>
                            <option>Suresh</option>
                            <option>Ganesh</option>
                        </select>
                    </div>
                </div>
                <div className="p-4 border-t flex justify-end gap-2">
                    <button onClick={() => setShowPallaModal(false)} className="px-4 py-2 border rounded-lg text-xs font-medium">Cancel</button>
                    <button onClick={() => setShowPallaModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium">Start Palla</button>
                </div>
            </div>
        </div>
    );

    // Tab Navigation
    const TabNav = () => (
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg mb-4">
            <NavButton icon={Layers} label="Cotton Rolls & Palla" page="cotton-rolls" />
            <NavButton icon={Scissors} label="Cutting Sheets" page="cutting-sheets" />
            <NavButton icon={Box} label="Bundles" page="bundles" />
        </div>
    );

    // Render
    if (embedded) {
        return (
            <div className="text-sm">
                {showWizard && <ProductionWizard />}
                {showPrintPreview && <PrintPreviewModal />}
                {showPallaModal && <PallaModal />}
                <TabNav />
                {currentPage === 'cotton-rolls' && <CottonRollsPage />}
                {currentPage === 'cutting-sheets' && <CuttingSheetsPage />}
                {currentPage === 'bundles' && <BundlesPage />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex text-sm">
            {showWizard && <ProductionWizard />}
            {showPrintPreview && <PrintPreviewModal />}
            {showPallaModal && <PallaModal />}
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
                {currentPage === 'cotton-rolls' && <CottonRollsPage />}
                {currentPage === 'cutting-sheets' && <CuttingSheetsPage />}
                {currentPage === 'bundles' && <BundlesPage />}
            </main>
        </div>
    );
};

export default ProductionSystem;

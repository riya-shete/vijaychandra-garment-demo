import React, { createContext, useContext, useState } from 'react';

// Bundle stages for production flow
const BUNDLE_STAGES = ['Cutting', 'Printing', 'Sewing Floor', 'Ironing', 'Packaging', 'Complete'];

// Operations for worker assignment (during Sewing Floor stage)
const STITCHING_OPERATIONS = [
    'Bottom Stitch',
    'Pocket Stitch',
    'Collar Stitch',
    'Elastic Stitch',
    'Zip Attach',
    'Side Stitch',
    'Button Attach'
];

// Create the context
const BundleContext = createContext(null);

// Provider component
export const BundleProvider = ({ children }) => {
    // Formula: meters = (weight_kg * 1000) / (gsm * width_in_meters)
    // For 280 GSM, 72 inch (1.83m) width: meters ≈ weight_kg * 1.95
    // With ~14% shrinkage factor: effective_meters ≈ weight_kg * 1.68
    const KG_TO_METERS_FACTOR = 1.68; // After shrinkage

    // Unified bundle state - shared between Production and Worker Wages
    const [bundles, setBundles] = useState([
        // Sample bundles from production 7507 - Traceable to source roll CR-20260115-001
        {
            id: '7507-1', production: '7507', colour: 'Black',
            nw: 4.2, meters: 7.1, // nw in kg, meters calculated
            size: '20', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-001', sourceRollColor: 'Black',
            stage: 'Cutting', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7507-2', production: '7507', colour: 'Black',
            nw: 4.2, meters: 7.1,
            size: '22', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-001', sourceRollColor: 'Black',
            stage: 'Cutting', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7507-3', production: '7507', colour: 'Black',
            nw: 4.2, meters: 7.1,
            size: '24', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-001', sourceRollColor: 'Black',
            stage: 'Printing', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7507-4', production: '7507', colour: 'D. Grey',
            nw: 3.8, meters: 6.4,
            size: '20', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-005', sourceRollColor: 'D. Grey',
            stage: 'Printing', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7507-5', production: '7507', colour: 'D. Grey',
            nw: 3.8, meters: 6.4,
            size: '22', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-005', sourceRollColor: 'D. Grey',
            stage: 'Sewing Floor', currentWorker: 'Ramesh Kumar', currentOperation: 'Bottom Stitch',
            operationsCompleted: {}
        },
        {
            id: '7507-6', production: '7507', colour: 'Navy',
            nw: 4.0, meters: 6.7,
            size: '20', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-008', sourceRollColor: 'Navy',
            stage: 'Sewing Floor', currentWorker: 'Suresh Patil', currentOperation: 'Pocket Stitch',
            operationsCompleted: {
                'Bottom Stitch': { done: true, worker: 'Ramesh Kumar', time: '10:30 AM' }
            }
        },
        {
            id: '7507-7', production: '7507', colour: 'Navy',
            nw: 4.0, meters: 6.7,
            size: '22', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-008', sourceRollColor: 'Navy',
            stage: 'Sewing Floor', currentWorker: null, currentOperation: null,
            operationsCompleted: {
                'Bottom Stitch': { done: true, worker: 'Mohan Singh', time: '10:45 AM' },
                'Pocket Stitch': { done: true, worker: 'Suresh Patil', time: '11:00 AM' }
            }
        },
        {
            id: '7507-8', production: '7507', colour: 'Black',
            nw: 4.2, meters: 7.1,
            size: '26', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-001', sourceRollColor: 'Black',
            stage: 'Ironing', currentWorker: null, currentOperation: null,
            operationsCompleted: {
                'Bottom Stitch': { done: true, worker: 'Ramesh Kumar', time: '09:30 AM' },
                'Pocket Stitch': { done: true, worker: 'Suresh Patil', time: '10:00 AM' },
                'Side Stitch': { done: true, worker: 'Ramesh Kumar', time: '10:30 AM' }
            }
        },
        {
            id: '7507-9', production: '7507', colour: 'D. Grey',
            nw: 3.8, meters: 6.4,
            size: '24', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-005', sourceRollColor: 'D. Grey',
            stage: 'Packaging', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7507-10', production: '7507', colour: 'Navy',
            nw: 4.0, meters: 6.7,
            size: '24', pieces: 6, product: 'Raftaar Kids',
            sourceRollId: 'CR-20260115-008', sourceRollColor: 'Navy',
            stage: 'Complete', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        // Sample bundles from production 7506 - Traceable to source roll CR-20260115-002
        {
            id: '7506-1', production: '7506', colour: 'Black',
            nw: 4.5, meters: 7.6,
            size: '28', pieces: 6, product: 'Speedo Pro',
            sourceRollId: 'CR-20260115-002', sourceRollColor: 'Black',
            stage: 'Cutting', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7506-2', production: '7506', colour: 'Black',
            nw: 4.5, meters: 7.6,
            size: '30', pieces: 6, product: 'Speedo Pro',
            sourceRollId: 'CR-20260115-002', sourceRollColor: 'Black',
            stage: 'Sewing Floor', currentWorker: 'Mohan Singh', currentOperation: 'Elastic Stitch',
            operationsCompleted: {
                'Bottom Stitch': { done: true, worker: 'Ramesh Kumar', time: '11:15 AM' }
            }
        },
        {
            id: '7506-3', production: '7506', colour: 'D. Grey',
            nw: 4.1, meters: 6.9,
            size: '28', pieces: 6, product: 'Speedo Pro',
            sourceRollId: 'CR-20260115-006', sourceRollColor: 'D. Grey',
            stage: 'Sewing Floor', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7506-4', production: '7506', colour: 'Navy',
            nw: 4.3, meters: 7.2,
            size: '28', pieces: 6, product: 'Speedo Pro',
            sourceRollId: 'CR-20260115-009', sourceRollColor: 'Navy',
            stage: 'Complete', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
        {
            id: '7506-5', production: '7506', colour: 'Navy',
            nw: 4.3, meters: 7.2,
            size: '30', pieces: 6, product: 'Speedo Pro',
            sourceRollId: 'CR-20260115-009', sourceRollColor: 'Navy',
            stage: 'Complete', currentWorker: null, currentOperation: null,
            operationsCompleted: {}
        },
    ]);

    // Move bundle to a new stage (Kanban drag/drop)
    const moveBundle = (bundleId, newStage) => {
        setBundles(prev => prev.map(b =>
            b.id === bundleId ? { ...b, stage: newStage } : b
        ));
    };

    // Assign worker to bundle for an operation
    const assignWorker = (bundleId, workerName, operation) => {
        setBundles(prev => prev.map(b =>
            b.id === bundleId ? {
                ...b,
                currentWorker: workerName,
                currentOperation: operation
            } : b
        ));
    };

    // Complete an operation on a bundle
    const completeOperation = (bundleId, operation, workerName) => {
        const timeNow = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        setBundles(prev => prev.map(b => {
            if (b.id !== bundleId) return b;
            return {
                ...b,
                currentWorker: null,
                currentOperation: null,
                operationsCompleted: {
                    ...b.operationsCompleted,
                    [operation]: { done: true, worker: workerName, time: timeNow }
                }
            };
        }));
    };

    // Release bundle (worker done, bundle goes back to available pool)
    const releaseBundle = (bundleId) => {
        setBundles(prev => prev.map(b =>
            b.id === bundleId ? { ...b, currentWorker: null, currentOperation: null } : b
        ));
    };

    // Get bundles by stage
    const getBundlesByStage = (stage) => bundles.filter(b => b.stage === stage);

    // Get bundles available for a specific operation (in Sewing Floor stage, no current worker)
    const getAvailableBundlesForOperation = (operation) => {
        return bundles.filter(b =>
            b.stage === 'Sewing Floor' &&
            !b.currentWorker &&
            !b.operationsCompleted[operation]?.done
        );
    };

    // Get bundles currently being worked on by a specific worker
    const getWorkerCurrentBundles = (workerName) => {
        return bundles.filter(b => b.currentWorker === workerName);
    };

    // Add new bundles (when cutting sheet is created)
    const addBundles = (newBundles) => {
        setBundles(prev => [...prev, ...newBundles]);
    };

    const value = {
        bundles,
        setBundles,
        BUNDLE_STAGES,
        STITCHING_OPERATIONS,
        moveBundle,
        assignWorker,
        completeOperation,
        releaseBundle,
        getBundlesByStage,
        getAvailableBundlesForOperation,
        getWorkerCurrentBundles,
        addBundles
    };

    return (
        <BundleContext.Provider value={value}>
            {children}
        </BundleContext.Provider>
    );
};

// Hook to use the bundle context
export const useBundles = () => {
    const context = useContext(BundleContext);
    if (!context) {
        throw new Error('useBundles must be used within a BundleProvider');
    }
    return context;
};

export default BundleContext;

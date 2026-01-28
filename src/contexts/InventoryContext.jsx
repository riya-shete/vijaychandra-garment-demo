import React, { createContext, useContext, useState } from 'react';

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
    // Initial Mock Inventory
    const [inventory, setInventory] = useState([
        { id: 'SKU-001', sku: 'SKU-001', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Navy', size: '20', stock: 45, qty: 45, minStock: 20, maxStock: 100, rate: 420, shelf: 'A-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-002', sku: 'SKU-002', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Navy', size: '22', stock: 38, qty: 38, minStock: 20, maxStock: 100, rate: 430, shelf: 'A-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-003', sku: 'SKU-003', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Navy', size: '24', stock: 18, qty: 18, minStock: 20, maxStock: 100, rate: 450, shelf: 'A-3', hsn: '6103', lastUpdated: '14-Jan-2026' },
        { id: 'SKU-004', sku: 'SKU-004', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Black', size: '22', stock: 52, qty: 52, minStock: 20, maxStock: 100, rate: 430, shelf: 'A-2', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-005', sku: 'SKU-005', product: 'Speedo Pro', category: 'Sports Track Pants', color: 'Black', size: '22', stock: 20, qty: 20, minStock: 15, maxStock: 80, rate: 520, shelf: 'B-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-006', sku: 'SKU-006', product: 'Speedo Pro', category: 'Sports Track Pants', color: 'Navy', size: '24', stock: 8, qty: 8, minStock: 15, maxStock: 80, rate: 540, shelf: 'B-2', hsn: '6103', lastUpdated: '13-Jan-2026' },
        { id: 'SKU-007', sku: 'SKU-007', product: 'Champion', category: 'Sports Track Pants', color: 'Grey', size: '20', stock: 5, qty: 5, minStock: 15, maxStock: 80, rate: 380, shelf: 'B-5', hsn: '6103', lastUpdated: '12-Jan-2026' },
        { id: 'SKU-008', sku: 'SKU-008', product: 'Turbo', category: 'Premium Track Pants', color: 'Maroon', size: '26', stock: 30, qty: 30, minStock: 10, maxStock: 50, rate: 680, shelf: 'C-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-009', sku: 'SKU-009', product: 'Sprint', category: 'Budget Track Pants', color: 'Black', size: '24', stock: 75, qty: 75, minStock: 30, maxStock: 150, rate: 320, shelf: 'D-1', hsn: '6103', lastUpdated: '15-Jan-2026' },
        { id: 'SKU-010', sku: 'SKU-010', product: 'Raftaar Kids', category: 'Kids Track Pants', color: 'Grey', size: '26', stock: 0, qty: 0, minStock: 15, maxStock: 80, rate: 460, shelf: 'A-4', hsn: '6103', lastUpdated: '10-Jan-2026' },
    ]);

    // Add Bundle to Inventory
    const addBundleToStock = (bundle) => {
        setInventory(prev => {
            const sku = `${bundle.production}-${bundle.colour.substring(0, 3).toUpperCase()}-${bundle.size}`;
            const existingItemIndex = prev.findIndex(item => item.sku === sku);

            if (existingItemIndex >= 0) {
                // Update existing stock
                const updated = [...prev];
                updated[existingItemIndex] = {
                    ...updated[existingItemIndex],
                    stock: updated[existingItemIndex].stock + bundle.pieces
                };
                return updated;
            } else {
                // Add new SKU
                return [...prev, {
                    sku,
                    style: bundle.production,
                    color: bundle.colour,
                    size: bundle.size,
                    stock: bundle.pieces,
                    location: 'TBD' // To be defined
                }];
            }
        });
    };

    const value = {
        inventory,
        setInventory,
        addBundleToStock
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};

export default InventoryContext;

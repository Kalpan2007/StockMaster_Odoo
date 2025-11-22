import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Receipt, Delivery, StockMovement } from '../../types';

interface OperationState {
  receipts: Receipt[];
  deliveries: Delivery[];
  movements: StockMovement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OperationState = {
  receipts: [
    {
      id: '1',
      reference: 'RCP-001',
      supplier: 'Steel Corp Ltd',
      status: 'waiting',
      date: '2025-01-15',
      totalQuantity: 100,
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Steel Rods',
          productSku: 'STL-001',
          quantityOrdered: 100,
          quantityReceived: 0,
          unitCost: 25.50
        }
      ]
    }
  ],
  deliveries: [
    {
      id: '1',
      reference: 'DEL-001',
      customer: 'ABC Manufacturing',
      status: 'ready',
      date: '2025-01-16',
      totalQuantity: 10,
      items: [
        {
          id: '1',
          productId: '2',
          productName: 'Office Chairs',
          productSku: 'CHR-001',
          quantityDemand: 10,
          quantityDone: 0
        }
      ]
    }
  ],
  movements: [
    {
      id: '1',
      type: 'receipt',
      productId: '1',
      productName: 'Steel Rods',
      productSku: 'STL-001',
      quantity: 50,
      toLocation: 'Main Warehouse',
      reference: 'RCP-001',
      status: 'done',
      date: '2025-01-14',
      supplier: 'Steel Corp Ltd'
    }
  ],
  isLoading: false,
  error: null,
};

const operationSlice = createSlice({
  name: 'operations',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setReceipts: (state, action: PayloadAction<Receipt[]>) => {
      state.receipts = action.payload;
    },
    addReceipt: (state, action: PayloadAction<Receipt>) => {
      state.receipts.push(action.payload);
    },
    updateReceipt: (state, action: PayloadAction<Receipt>) => {
      const index = state.receipts.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.receipts[index] = action.payload;
      }
    },
    setDeliveries: (state, action: PayloadAction<Delivery[]>) => {
      state.deliveries = action.payload;
    },
    addDelivery: (state, action: PayloadAction<Delivery>) => {
      state.deliveries.push(action.payload);
    },
    updateDelivery: (state, action: PayloadAction<Delivery>) => {
      const index = state.deliveries.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.deliveries[index] = action.payload;
      }
    },
    addMovement: (state, action: PayloadAction<StockMovement>) => {
      state.movements.unshift(action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setReceipts,
  addReceipt,
  updateReceipt,
  setDeliveries,
  addDelivery,
  updateDelivery,
  addMovement,
} = operationSlice.actions;

export default operationSlice.reducer;
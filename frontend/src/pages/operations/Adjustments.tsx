import React, { useEffect, useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchProducts } from '../../store/slices/productSlice';
import operationService from '../../services/operationService';

export const Adjustments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products } = useTypedSelector((state) => state.products);
  const { warehouses } = useTypedSelector((state) => state.warehouses);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    productId: '',
    currentStock: 0,
    countedQuantity: 0,
    reason: 'counting_error',
    reasonDescription: '',
    warehouse: '',
    location: '',
  });

  useEffect(() => {
    const fetchAdjustments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await operationService.getAdjustments({ page: 1, limit: 50 });
        const list = (response.data || []).map((adj: any) => ({
          id: adj._id,
          reference: adj.reference,
          productName: adj.items?.[0]?.product?.name || '—',
          productSku: adj.items?.[0]?.product?.sku || '—',
          quantity: adj.items?.[0]?.difference ?? 0,
          date: adj.adjustmentDate || adj.createdAt,
          notes: adj.reasonDescription || adj.reason,
        }));
        setAdjustments(list);
      } catch (err: any) {
        setError(err.message || 'Failed to load adjustments');
      } finally {
        setLoading(false);
      }
    };
    fetchAdjustments();
  }, []);

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        ...formData,
        productId,
        currentStock: product.currentStock,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const product = products.find(p => p.id === formData.productId);
      if (!product) return;

      const payload = {
        warehouse: formData.warehouse,
        location: formData.location,
        reason: formData.reason,
        reasonDescription: formData.reasonDescription || undefined,
        items: [
          {
            product: formData.productId,
            currentStock: formData.currentStock,
            countedQuantity: formData.countedQuantity,
          },
        ],
      };

      const created = await operationService.createAdjustment(payload);
      const createdId = created?.data?._id || created?._id;
      if (createdId) {
        await operationService.processAdjustment(createdId, []);
      }

      // Refresh adjustments and products
      const response = await operationService.getAdjustments({ page: 1, limit: 50 });
      const list = (response.data || []).map((adj: any) => ({
        id: adj._id,
        reference: adj.reference,
        productName: adj.items?.[0]?.product?.name || '—',
        productSku: adj.items?.[0]?.product?.sku || '—',
        quantity: adj.items?.[0]?.difference ?? 0,
        date: adj.adjustmentDate || adj.createdAt,
        notes: adj.reasonDescription || adj.reason,
      }));
      setAdjustments(list);
      dispatch(fetchProducts({}));

      setShowModal(false);
      setFormData({
        productId: '',
        currentStock: 0,
        countedQuantity: 0,
        reason: 'counting_error',
        reasonDescription: '',
        warehouse: '',
        location: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create adjustment');
    } finally {
      setLoading(false);
    }
  };

  const CreateAdjustmentModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Adjustment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              value={formData.productId}
              onChange={(e) => handleProductSelect(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku}) - Current: {product.currentStock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse</label>
            <select
              value={formData.warehouse}
              onChange={(e) => setFormData({ ...formData, warehouse: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Warehouse</option>
              {(warehouses as any[]).map((w: any) => (
                <option key={w._id || w.id} value={w._id || w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Aisle 3 - Shelf B"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Stock</label>
              <input
                type="number"
                value={formData.currentStock}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Counted Quantity</label>
              <input
                type="number"
                value={formData.countedQuantity}
                onChange={(e) => setFormData({ ...formData, countedQuantity: parseInt(e.target.value) || 0 })}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {formData.productId && (
            <div className="bg-gray-50 p-3 rounded-md">
              <span className="text-sm font-medium text-gray-700">Adjustment:</span>
              <span className={`ml-2 font-bold ${
                formData.countedQuantity - formData.currentStock > 0 ? 'text-green-600' : 
                formData.countedQuantity - formData.currentStock < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {formData.countedQuantity - formData.currentStock > 0 ? '+' : ''}
                {formData.countedQuantity - formData.currentStock}
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value as any })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="counting_error">Counting Error</option>
              <option value="damaged">Damaged</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
              <option value="expired">Expired</option>
              <option value="theft">Theft</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              value={formData.reasonDescription}
              onChange={(e) => setFormData({ ...formData, reasonDescription: e.target.value })}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Explain the reason for this adjustment..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? 'Applying...' : 'Apply Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Adjustments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Adjustment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adjustment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-600">Loading adjustments...</td>
                </tr>
              ) : adjustments.length > 0 ? (
                adjustments.map((adjustment) => (
                  <tr key={adjustment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {adjustment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{adjustment.productName}</div>
                        <div className="text-sm text-gray-500">{adjustment.productSku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-bold ${
                        adjustment.quantity > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(adjustment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {adjustment.notes}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <RotateCcw className="w-12 h-12 text-gray-300 mb-4" />
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No adjustments found</h3>
                      <p className="text-sm text-gray-500">Create your first inventory adjustment to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <CreateAdjustmentModal />}
    </div>
  );
};
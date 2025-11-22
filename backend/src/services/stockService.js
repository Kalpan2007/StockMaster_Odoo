const Product = require('../models/Product');
const MovementHistory = require('../models/MovementHistory');
const { emitStockUpdate, emitLowStockAlert } = require('../utils/socketEvents');

class StockService {
  // Update stock and create movement history
  static async updateStock(productId, quantity, movementData, io) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Check for negative stock in case of outgoing movements
      if (quantity < 0 && product.currentStock + quantity < 0) {
        throw new Error(`Insufficient stock. Available: ${product.currentStock}, Required: ${Math.abs(quantity)}`);
      }

      // Update product stock
      const newStock = product.currentStock + quantity;
      await Product.findByIdAndUpdate(productId, { currentStock: newStock });

      // Create movement history
      const movement = new MovementHistory({
        ...movementData,
        product: productId,
        quantity: quantity
      });
      await movement.save();

      // Emit real-time updates
      if (io) {
        emitStockUpdate(io, productId, newStock);
        
        // Check for low stock alert
        if (newStock <= product.minStock && newStock > 0) {
          emitLowStockAlert(io, { ...product.toObject(), currentStock: newStock });
        }
      }

      return { success: true, newStock, movement };
    } catch (error) {
      throw error;
    }
  }

  // Bulk stock update for multiple products
  static async bulkUpdateStock(updates, movementData, io) {
    const results = [];
    
    for (const update of updates) {
      try {
        const result = await this.updateStock(
          update.productId,
          update.quantity,
          {
            ...movementData,
            notes: update.notes || movementData.notes
          },
          io
        );
        results.push({ productId: update.productId, ...result });
      } catch (error) {
        results.push({ 
          productId: update.productId, 
          success: false, 
          error: error.message 
        });
      }
    }
    
    return results;
  }

  // Get stock levels for dashboard
  static async getStockLevels() {
    try {
      const products = await Product.find({ isActive: true });
      
      const stats = {
        totalProducts: products.length,
        inStock: products.filter(p => p.currentStock > p.minStock).length,
        lowStock: products.filter(p => p.currentStock <= p.minStock && p.currentStock > 0).length,
        outOfStock: products.filter(p => p.currentStock === 0).length
      };

      return stats;
    } catch (error) {
      throw error;
    }
  }

  // Get products with low stock
  static async getLowStockProducts() {
    try {
      const lowStockProducts = await Product.find({
        isActive: true,
        $expr: { $lte: ['$currentStock', '$minStock'] },
        currentStock: { $gt: 0 }
      }).populate('warehouse', 'name code');

      return lowStockProducts;
    } catch (error) {
      throw error;
    }
  }

  // Get out of stock products
  static async getOutOfStockProducts() {
    try {
      const outOfStockProducts = await Product.find({
        isActive: true,
        currentStock: 0
      }).populate('warehouse', 'name code');

      return outOfStockProducts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StockService;
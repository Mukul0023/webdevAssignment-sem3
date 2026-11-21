const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStockProducts,
  getCategorySummary,
} = require('../controllers/productController');

// Aggregation / Report Routes (Must be above /:id)
router.get('/low-stock', getLowStockProducts);
router.get('/summary', getCategorySummary);

// Standard CRUD Routes
router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

// Stock Adjustment Route
router.patch('/:id/stock', adjustStock);

module.exports = router; 
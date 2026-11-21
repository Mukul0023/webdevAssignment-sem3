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


router.get('/low-stock', getLowStockProducts);
router.get('/summary', getCategorySummary);


router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);


router.patch('/:id/stock', adjustStock);

module.exports = router; 
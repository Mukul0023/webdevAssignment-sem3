const Product = require('../models/Product');

// @desc    Create new product
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (Filtering, Sorting, Pagination)
// @route   GET /api/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, supplier, search, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    // 1. Filtering
    const filter = {};
    if (category) filter.category = category;
    if (supplier) filter.supplier = { $regex: supplier, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 2. Sorting
    let sortOption = '-createdAt'; // Default newest first
    if (sort) {
      sortOption = sort.split(',').join(' ');
    }

    // 3. Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Safe stock adjustment (Restock / Sale)
// @route   PATCH /api/products/:id/stock
exports.adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;

    if (typeof change !== 'number' || isNaN(change)) {
      res.status(400);
      throw new Error('Please provide a valid numeric "change" value');
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const newQuantity = product.quantity + change;
    if (newQuantity < 0) {
      res.status(400);
      throw new Error(`Insufficient stock. Current stock is ${product.quantity}`);
    }

    product.quantity = newQuantity;
    await product.save();

    res.status(200).json({
      message: 'Stock updated',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      message: 'Product deleted',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Low-Stock Alert Report (quantity <= reorderLevel)
// @route   GET /api/products/low-stock
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const items = await Product.aggregate([
      {
        $match: {
          $expr: { $lte: ['$quantity', '$reorderLevel'] },
        },
      },
      {
        $addFields: {
          stockValue: { $multiply: ['$price', '$quantity'] },
          id: { $toString: '$_id' },
        },
      },
    ]);

    res.status(200).json({
      count: items.length,
      lowStockItems: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Category-wise Inventory Summary (Aggregation)
// @route   GET /api/products/summary
exports.getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $project: {
          _id: 1,
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
        },
      },
      {
        $sort: { totalStockValue: -1 },
      },
    ]);

    res.status(200).json({
      categories: summary.length,
      summary,
    });
  } catch (error) {
    next(error);
  }
};
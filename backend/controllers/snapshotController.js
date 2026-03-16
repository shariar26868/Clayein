const Snapshot      = require('../models/Snapshot');
const Product       = require('../models/Product');
const ProductAccess = require('../models/ProductAccess');
const { calcMetrics } = require('../utils/calcEngine');

// POST /api/snapshots/:productId — save current state as monthly snapshot
exports.save = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) return res.status(400).json({ error: 'month and year required' });

    const product   = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const investors = await ProductAccess.find({ product: product._id })
      .select('investorName investedAmount profitSharePct');

    const metrics = calcMetrics({ ...product.toObject(), investors });

    const snapshot = await Snapshot.findOneAndUpdate(
      { product: product._id, month, year },
      { product: product._id, month, year, data: metrics },
      { upsert: true, new: true }
    );

    res.json(snapshot);
  } catch (err) { next(err); }
};

// GET /api/snapshots/:productId — fetch all snapshots for a product
exports.getByProduct = async (req, res, next) => {
  try {
    const snapshots = await Snapshot.find({ product: req.params.productId })
      .sort({ year: 1, month: 1 });
    res.json(snapshots);
  } catch (err) { next(err); }
};
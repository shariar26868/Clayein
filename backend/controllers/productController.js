// const Product       = require('../models/Product');
// const ProductAccess = require('../models/ProductAccess');
// const { calcMetrics } = require('../utils/calcEngine');

// // GET /api/products — all products with calculated metrics
// exports.getAll = async (req, res, next) => {
//   try {
//     const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });

//     const result = await Promise.all(products.map(async (p) => {
//       const investors = await ProductAccess.find({ product: p._id })
//         .select('investorName investedAmount profitSharePct');
//       const metrics = calcMetrics({ ...p.toObject(), investors });
//       return { ...p.toObject(), metrics, investors };
//     }));

//     res.json(result);
//   } catch (err) { next(err); }
// };

// // GET /api/products/:id — single product with full analysis
// exports.getOne = async (req, res, next) => {
//   try {
//     const product   = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ error: 'Product not found' });

//     const investors = await ProductAccess.find({ product: product._id })
//       .select('investorName investedAmount profitSharePct username lastLogin');
//     const metrics   = calcMetrics({ ...product.toObject(), investors });

//     res.json({ ...product.toObject(), metrics, investors });
//   } catch (err) { next(err); }
// };

// // POST /api/products — create new product
// exports.create = async (req, res, next) => {
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json(product);
//   } catch (err) { next(err); }
// };

// // PUT /api/products/:id — update product figures
// exports.update = async (req, res, next) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!product) return res.status(404).json({ error: 'Product not found' });

//     const investors = await ProductAccess.find({ product: product._id })
//       .select('investorName investedAmount profitSharePct');
//     const metrics   = calcMetrics({ ...product.toObject(), investors });

//     res.json({ ...product.toObject(), metrics, investors });
//   } catch (err) { next(err); }
// };

// // DELETE /api/products/:id — soft delete
// exports.remove = async (req, res, next) => {
//   try {
//     await Product.findByIdAndUpdate(req.params.id, { isActive: false });
//     res.json({ message: 'Product removed' });
//   } catch (err) { next(err); }
// };

// // POST /api/products/:id/investors — add investor access to a product
// exports.addInvestor = async (req, res, next) => {
//   try {
//     const { username, password, investorName, investedAmount, profitSharePct } = req.body;

//     // Validate total profit share won't exceed 100%
//     const existing = await ProductAccess.find({ product: req.params.id });
//     const usedPct  = existing.reduce((s, i) => s + i.profitSharePct, 0);
//     if (usedPct + profitSharePct > 100) {
//       return res.status(400).json({
//         error: `Total profit share exceeds 100%. Available: ${100 - usedPct}%`
//       });
//     }

//     const access = await ProductAccess.create({
//       product:        req.params.id,
//       username,
//       passwordHash:   password,   // model pre-save will hash this
//       investorName,
//       investedAmount,
//       profitSharePct,
//     });

//     res.status(201).json({
//       _id:            access._id,
//       username:       access.username,
//       investorName:   access.investorName,
//       investedAmount: access.investedAmount,
//       profitSharePct: access.profitSharePct,
//     });
//   } catch (err) {
//     if (err.code === 11000) return res.status(400).json({ error: 'Username already taken' });
//     next(err);
//   }
// };

// // DELETE /api/products/:id/investors/:accessId — remove investor
// exports.removeInvestor = async (req, res, next) => {
//   try {
//     await ProductAccess.findByIdAndDelete(req.params.accessId);
//     res.json({ message: 'Investor removed' });
//   } catch (err) { next(err); }
// };




const Product       = require('../models/Product');
const ProductAccess = require('../models/ProductAccess');
const { calcMetrics, getTierPct } = require('../utils/calcEngine');

// helper: recalculate stock value from qty x price
function autoStock(body, existing) {
  const qty   = body.stockQty   !== undefined ? parseFloat(body.stockQty)   : (existing ? existing.stockQty   : 0);
  const price = body.stockPrice !== undefined ? parseFloat(body.stockPrice) : (existing ? existing.stockPrice : 0);
  return { ...body, stock: (qty || 0) * (price || 0) };
}

// GET /api/products
exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    const result = await Promise.all(products.map(async (p) => {
      const investors = await ProductAccess.find({ product: p._id })
        .select('investorName investedAmount profitSharePct');
      const metrics = calcMetrics({ ...p.toObject(), investors });
      return { ...p.toObject(), metrics, investors };
    }));
    res.json(result);
  } catch (err) { next(err); }
};

// GET /api/products/:id
exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const investors = await ProductAccess.find({ product: product._id })
      .select('investorName investedAmount profitSharePct username lastLogin');
    const metrics = calcMetrics({ ...product.toObject(), investors });
    res.json({ ...product.toObject(), metrics, investors });
  } catch (err) { next(err); }
};

// POST /api/products
exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(autoStock(req.body, null));
    res.status(201).json(product);
  } catch (err) { next(err); }
};

// PUT /api/products/:id
exports.update = async (req, res, next) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      autoStock(req.body, existing),
      { new: true, runValidators: true }
    );

    const investors = await ProductAccess.find({ product: product._id })
      .select('investorName investedAmount profitSharePct');
    const metrics = calcMetrics({ ...product.toObject(), investors });
    res.json({ ...product.toObject(), metrics, investors });
  } catch (err) { next(err); }
};

// DELETE /api/products/:id
exports.remove = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err) { next(err); }
};

// POST /api/products/:id/investors
exports.addInvestor = async (req, res, next) => {
  try {
    const { username, password, investorName, investedAmount } = req.body;

    // Auto-calculate tier % from invested amount
    const profitSharePct = getTierPct(Number(investedAmount));

    const access = await ProductAccess.create({
      product:        req.params.id,
      username,
      passwordHash:   password,
      investorName,
      investedAmount: Number(investedAmount),
      profitSharePct,
    });

    res.status(201).json({
      _id:            access._id,
      username:       access.username,
      investorName:   access.investorName,
      investedAmount: access.investedAmount,
      profitSharePct: access.profitSharePct,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Username already taken' });
    next(err);
  }
};

// DELETE /api/products/:id/investors/:accessId
exports.removeInvestor = async (req, res, next) => {
  try {
    await ProductAccess.findByIdAndDelete(req.params.accessId);
    res.json({ message: 'Investor removed' });
  } catch (err) { next(err); }
};
const jwt           = require('jsonwebtoken');
const ProductAccess = require('../models/ProductAccess');
const Product       = require('../models/Product');
const { calcMetrics } = require('../utils/calcEngine');

// POST /api/investor/login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const access = await ProductAccess.findOne({ username: username.toLowerCase() });
    if (!access) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await access.matchPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // Update last login
    access.lastLogin = new Date();
    await access.save({ validateBeforeSave: false });

    const token = jwt.sign(
      {
        accessId:       access._id,
        productId:      access.product,
        investorName:   access.investorName,
        profitSharePct: access.profitSharePct,
        investedAmount: access.investedAmount,
      },
      process.env.INVESTOR_JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      investorName:   access.investorName,
      productId:      access.product,
      profitSharePct: access.profitSharePct,
      investedAmount: access.investedAmount,
    });
  } catch (err) { next(err); }
};

// GET /api/investor/me — investor sees ONLY their product data
exports.getMyProduct = async (req, res, next) => {
  try {
    // req.investor is set by investorAuth middleware
    const { productId, accessId, profitSharePct, investedAmount } = req.investor;

    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return res.status(404).json({ error: 'Product not found' });

    // Get all investors for equity calculation (but hide other investors' credentials)
    const allInvestors = await ProductAccess.find({ product: productId })
      .select('investorName investedAmount profitSharePct');

    const metrics = calcMetrics({ ...product.toObject(), investors: allInvestors });

    // Find this investor's specific share
    const myShare = metrics.investorShares.find(
      i => i.investorName === req.investor.investorName
    );

    res.json({
      product: {
        name:     product.name,
        category: product.category,
        notes:    product.notes,
      },
      metrics,
      myShare: {
        investorName:   req.investor.investorName,
        investedAmount: investedAmount,
        profitSharePct: profitSharePct,
        profitAmount:   myShare?.profitAmount || 0,
        equityPct:      myShare?.equityPct    || 0,
      },
    });
  } catch (err) { next(err); }
};
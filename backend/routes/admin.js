const router    = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const Product       = require('../models/Product');
const ProductAccess = require('../models/ProductAccess');
const { calcMetrics } = require('../utils/calcEngine');

router.use(adminAuth);

// GET /api/admin/summary
router.get('/summary', async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true });

    let totalRevenue = 0, totalExpenses = 0;
    let totalStock   = 0, totalWithdrawn = 0, totalCapital = 0;
    const productSummaries = [];

    for (const p of products) {
      const investors = await ProductAccess.find({ product: p._id })
        .select('investorName investedAmount profitSharePct');
      const m = calcMetrics({ ...p.toObject(), investors });

      totalRevenue   += p.revenue;
      totalExpenses  += p.expenses;
      totalStock     += p.stock;
      totalWithdrawn += p.withdrawn;
      totalCapital   += m.totalCapital;

      productSummaries.push({
        _id: p._id, name: p.name, category: p.category,
        revenue: p.revenue, expenses: p.expenses,
        profit: m.profit, margin: m.margin, companyValue: m.companyValue,
      });
    }

    const totalProfit       = totalRevenue - totalExpenses;
    const totalMargin       = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const totalAssets       = totalProfit + totalStock;
    const totalCompanyValue = totalCapital + totalAssets;

    res.json({
      summary: {
        totalRevenue, totalExpenses, totalProfit,
        totalMargin, totalStock, totalWithdrawn,
        totalCapital, totalAssets, totalCompanyValue,
      },
      products: productSummaries,
    });
  } catch (err) { next(err); }
});

module.exports = router;
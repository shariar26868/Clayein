const Product       = require('../models/Product');
const ProductAccess = require('../models/ProductAccess');
const Snapshot      = require('../models/Snapshot');
const { calcMetrics } = require('../utils/calcEngine');

function getOpenAI() {
  const OpenAI = require('openai');
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// POST /api/ai/report/:productId
exports.generateReport = async (req, res, next) => {
  try {
    const { language = 'english' } = req.body;
    const product   = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const investors = await ProductAccess.find({ product: product._id })
      .select('investorName investedAmount profitSharePct');
    const metrics   = calcMetrics({ ...product.toObject(), investors });

    const isBangla = language === 'bangla';

    const systemPrompt = isBangla
      ? 'তুমি একজন expert financial analyst। তুমি বাংলায় professional business report লেখো। সব সংখ্যা টাকা (৳) দিয়ে দেখাও।'
      : 'You are an expert financial analyst. Write a professional business report in English. Show all amounts with ৳ symbol.';

    const dataText = `
Product: ${product.name}
Category: ${product.category}
Revenue: ৳${product.revenue}
Expenses: ৳${product.expenses}
Profit: ৳${metrics.profit}
Profit Margin: ${metrics.margin.toFixed(1)}%
Expense Ratio: ${metrics.expRatio.toFixed(1)}%
Stock Value: ৳${product.stock} (${product.stockQty} units @ ৳${product.stockPrice})
Units Sold: ${product.stockSold}
Cash Withdrawn: ৳${product.withdrawn}
Company Capital: ৳${product.companyContribution}
Total Investor Capital: ৳${metrics.totalInvestorAmount}
Total Capital: ৳${metrics.totalCapital}
Company Equity: ${metrics.companyEquityPct.toFixed(1)}%
Investor Equity: ${metrics.investorEquityPct.toFixed(1)}%
Company Profit Share: ৳${metrics.companyProfitShare} (${metrics.companyProfitSharePct.toFixed(1)}%)
ROI: ${metrics.roi.toFixed(1)}%
Total Company Value: ৳${metrics.companyValue}
Investors: ${investors.map(i => `${i.investorName} (invested ৳${i.investedAmount}, profit share ${i.profitSharePct}%)`).join(', ') || 'None'}
Notes: ${product.notes || 'None'}
    `.trim();

    const userPrompt = isBangla
      ? `নিচের business data দিয়ে একটি professional financial report তৈরি করো। Report এ থাকবে: ১) Executive Summary, ২) Revenue & Profit Analysis, ৩) Inventory Status, ৪) Capital & Equity Breakdown, ৫) Investor Returns, ৬) Key Observations, ৭) Recommendations।\n\n${dataText}`
      : `Generate a professional financial report using the data below. Include: 1) Executive Summary, 2) Revenue & Profit Analysis, 3) Inventory Status, 4) Capital & Equity Breakdown, 5) Investor Returns, 6) Key Observations, 7) Recommendations.\n\n${dataText}`;

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      max_tokens: 1500,
    });

    const report = completion.choices[0].message.content;
    res.json({ report, language, productName: product.name });
  } catch (err) { next(err); }
};

// POST /api/ai/forecast/:productId
exports.generateForecast = async (req, res, next) => {
  try {
    const { language = 'english' } = req.body;
    const product   = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const snapshots = await Snapshot.find({ product: product._id })
      .sort({ year: 1, month: 1 })
      .limit(6);

    const investors = await ProductAccess.find({ product: product._id })
      .select('investorName investedAmount profitSharePct');
    const metrics   = calcMetrics({ ...product.toObject(), investors });

    const isBangla = language === 'bangla';

    const systemPrompt = isBangla
      ? 'তুমি একজন expert financial forecaster। তুমি বাংলায় data-driven predictions দাও। সংখ্যা ৳ দিয়ে দেখাও।'
      : 'You are an expert financial forecaster. Give data-driven predictions in English. Show amounts with ৳ symbol.';

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const historyText = snapshots.length > 0
      ? snapshots.map(s => `${MONTHS[s.month-1]} ${s.year}: Revenue ৳${s.data.revenue}, Profit ৳${s.data.profit}, Margin ${s.data.margin?.toFixed(1)}%`).join('\n')
      : 'No historical data available yet.';

    const currentText = `
Current Period:
Revenue: ৳${product.revenue}, Expenses: ৳${product.expenses}
Profit: ৳${metrics.profit}, Margin: ${metrics.margin.toFixed(1)}%
Stock: ${product.stockQty} units @ ৳${product.stockPrice} = ৳${product.stock}
Units Sold: ${product.stockSold}
ROI: ${metrics.roi.toFixed(1)}%
    `.trim();

    const userPrompt = isBangla
      ? `নিচের historical data আর current figures দেখে আগামী মাসের জন্য forecast দাও। অন্তর্ভুক্ত করো: ১) Revenue Forecast, ২) Profit Forecast, ৩) Inventory Projection, ৪) Risk Factors, ৫) Growth Opportunities, ৬) Specific Action Items।\n\nHistorical Data:\n${historyText}\n\n${currentText}`
      : `Based on the historical data and current figures below, provide a forecast for next month. Include: 1) Revenue Forecast, 2) Profit Forecast, 3) Inventory Projection, 4) Risk Factors, 5) Growth Opportunities, 6) Specific Action Items.\n\nHistorical Data:\n${historyText}\n\n${currentText}`;

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      max_tokens: 1200,
    });

    const forecast = completion.choices[0].message.content;
    res.json({ forecast, language, productName: product.name, hasHistory: snapshots.length > 0 });
  } catch (err) { next(err); }
};
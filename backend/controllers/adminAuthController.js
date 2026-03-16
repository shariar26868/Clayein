const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const nodemailer = require('nodemailer');
const Admin      = require('../models/Admin');

// email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/auth/setup — first-time admin create (run once)
exports.setup = async (req, res, next) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) return res.status(403).json({ error: 'Admin already exists' });
    const { email, password } = req.body;
    const admin = await Admin.create({ email, passwordHash: password });
    res.status(201).json({ message: 'Admin created', email: admin.email });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await admin.matchPassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.ADMIN_JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, email: admin.email });
  } catch (err) { next(err); }
};

// POST /api/auth/forgot
exports.forgot = async (req, res, next) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email?.toLowerCase() });

    // Always respond success (don't reveal if email exists)
    if (!admin) return res.json({ message: 'If that email exists, a reset link was sent.' });

    const token   = crypto.randomBytes(32).toString('hex');
    admin.resetToken   = token;
    admin.resetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await admin.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/admin/reset-password/${token}`;

    await transporter.sendMail({
      from:    `"BizTrack" <${process.env.EMAIL_USER}>`,
      to:      admin.email,
      subject: 'BizTrack — Password Reset',
      html: `
        <div style="font-family:monospace;max-width:480px;margin:0 auto;padding:32px;background:#0f0f1a;color:#e4e4f0;border-radius:12px;">
          <h2 style="color:#7c6dfa;margin-bottom:16px;">Password Reset</h2>
          <p style="margin-bottom:24px;color:#8888a8;">Click the button below to reset your BizTrack admin password. This link expires in 1 hour.</p>
          <a href="${resetURL}" style="display:inline-block;background:#7c6dfa;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
            Reset Password
          </a>
          <p style="margin-top:24px;color:#5a5a72;font-size:12px;">If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'If that email exists, a reset link was sent.' });
  } catch (err) { next(err); }
};

// POST /api/auth/reset/:token
exports.reset = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      resetToken:   req.params.token,
      resetExpires: { $gt: Date.now() },
    });

    if (!admin) return res.status(400).json({ error: 'Reset link is invalid or expired' });

    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    admin.passwordHash = password;
    admin.resetToken   = undefined;
    admin.resetExpires = undefined;
    await admin.save();

    res.json({ message: 'Password reset successful. Please login.' });
  } catch (err) { next(err); }
};
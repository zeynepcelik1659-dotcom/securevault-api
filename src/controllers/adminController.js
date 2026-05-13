const User = require('../models/User');
const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const auditLogger = require('../utils/auditLogger');
const bcrypt = require('bcryptjs');

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDocuments = await Document.countDocuments();
    const totalLogs = await AuditLog.countDocuments();
    const failedLogins = await AuditLog.countDocuments({ action: 'LOGIN_FAILED' });
    const rejectedTokens = await AuditLog.countDocuments({ action: 'TOKEN_REJECTED' });
    const adminAccessDenied = await AuditLog.countDocuments({ action: 'ADMIN_ACCESS_DENIED' });

    await auditLogger({
      userId: req.user.id,
      action: 'ADMIN_ACCESS_GRANTED',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(200).json({
      metrics: {
        totalUsers,
        totalDocuments,
        totalLogs,
        failedLogins,
        rejectedTokens,
        adminAccessDenied
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role: role || 'user' });

    res.status(201).json({ message: 'Kullanıcı oluşturuldu', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.status(200).json({ message: 'Rol güncellendi', user });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = { getDashboard, getLogs, getAllUsers, createUser, getAllDocuments, updateUserRole };
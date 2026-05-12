const jwt = require('jsonwebtoken');
const auditLogger = require('../utils/auditLogger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      await auditLogger({
        action: 'TOKEN_REJECTED',
        status: 'FAILED',
        ipAddress: req.ip,
        endpoint: req.originalUrl
      });
      return res.status(401).json({ message: 'Token bulunamadı' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    await auditLogger({
      action: 'TOKEN_REJECTED',
      status: 'FAILED',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });
    return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
};

const authorizeAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    await auditLogger({
      userId: req.user.id,
      action: 'ADMIN_ACCESS_DENIED',
      status: 'FAILED',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });
    return res.status(403).json({ message: 'Bu alana erişim yetkiniz yok' });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
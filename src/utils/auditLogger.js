const AuditLog = require('../models/AuditLog');

const auditLogger = async ({ userId, action, status, ipAddress, endpoint }) => {
  try {
    await AuditLog.create({
      userId: userId || null,
      action,
      status,
      ipAddress: ipAddress || null,
      endpoint: endpoint || null
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

module.exports = auditLogger;
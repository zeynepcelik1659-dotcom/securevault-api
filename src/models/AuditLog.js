const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  action: {
    type: String,
    required: true,
    enum: [
      'REGISTER',
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'TOKEN_REJECTED',
      'TOKEN_REFRESHED',
      'ADMIN_ACCESS_DENIED',
      'ADMIN_ACCESS_GRANTED',
      'DOCUMENT_ACCESSED'
    ]
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  endpoint: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
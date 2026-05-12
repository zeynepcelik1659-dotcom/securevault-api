const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: 'Çok fazla başarısız giriş denemesi. 15 dakika sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: 'Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { loginLimiter, generalLimiter };
const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Giriş yapan kullanıcının bilgileri
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri döner
 *       401:
 *         description: Token bulunamadı
 */
router.get('/me', authenticate, getMe);

module.exports = router;
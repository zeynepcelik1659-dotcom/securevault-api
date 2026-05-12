const express = require('express');
const router = express.Router();
const { getDashboard, getLogs } = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Admin dashboard metrikleri
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrikler döner
 *       403:
 *         description: Yetkisiz erişim
 */
router.get('/dashboard', authenticate, authorizeAdmin, getDashboard);

/**
 * @swagger
 * /api/admin/logs:
 *   get:
 *     summary: Güvenlik logları
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loglar döner
 *       403:
 *         description: Yetkisiz erişim
 */
router.get('/logs', authenticate, authorizeAdmin, getLogs);

module.exports = router;
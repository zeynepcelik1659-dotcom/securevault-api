const express = require('express');
const router = express.Router();
const { getDashboard, getLogs, getAllUsers, createUser, getAllDocuments, updateUserRole } = require('../controllers/adminController');
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
 */
router.get('/logs', authenticate, authorizeAdmin, getLogs);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Tüm kullanıcılar
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcılar döner
 */
router.get('/users', authenticate, authorizeAdmin, getAllUsers);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Yeni kullanıcı oluştur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu
 */
router.post('/users', authenticate, authorizeAdmin, createUser);

/**
 * @swagger
 * /api/admin/documents:
 *   get:
 *     summary: Tüm dokümanlar
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tüm dokümanlar döner
 */
router.get('/documents', authenticate, authorizeAdmin, getAllDocuments);

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   patch:
 *     summary: Kullanıcı rolünü güncelle
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Rol güncellendi
 */
router.patch('/users/:id/role', authenticate, authorizeAdmin, updateUserRole);

module.exports = router;
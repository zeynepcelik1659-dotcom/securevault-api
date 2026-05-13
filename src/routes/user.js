const express = require('express');
const router = express.Router();
const { getMe, updateProfile, updatePassword } = require('../controllers/userController');
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

/**
 * @swagger
 * /api/users/profile:
 *   patch:
 *     summary: Profil güncelle
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil güncellendi
 */
router.patch('/profile', authenticate, updateProfile);

/**
 * @swagger
 * /api/users/password:
 *   patch:
 *     summary: Şifre değiştir
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Şifre güncellendi
 */
router.patch('/password', authenticate, updatePassword);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getMyDocuments, getDocumentById, createDocument, deleteDocument } = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * /api/documents/my:
 *   get:
 *     summary: Kullanıcının dokümanları
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dokümanlar döner
 */
router.get('/my', authenticate, getMyDocuments);

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Yeni doküman oluştur
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isSensitive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Doküman oluşturuldu
 */
router.post('/', authenticate, createDocument);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Doküman detayı
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doküman döner
 */
router.get('/:id', authenticate, getDocumentById);

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Doküman sil
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doküman silindi
 */
router.delete('/:id', authenticate, deleteDocument);

module.exports = router;
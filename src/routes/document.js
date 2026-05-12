const express = require('express');
const router = express.Router();
const { getMyDocuments, getDocumentById } = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');

router.get('/my', authenticate, getMyDocuments);
router.get('/:id', authenticate, getDocumentById);

module.exports = router;
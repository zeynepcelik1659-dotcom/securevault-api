const Document = require('../models/Document');
const auditLogger = require('../utils/auditLogger');
const path = require('path');

const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ ownerId: req.user.id });

    await auditLogger({
      userId: req.user.id,
      action: 'DOCUMENT_ACCESSED',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(200).json({ documents });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!document) {
      return res.status(404).json({ message: 'Doküman bulunamadı' });
    }

    await auditLogger({
      userId: req.user.id,
      action: 'DOCUMENT_ACCESSED',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(200).json({ document });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const { title, content, isSensitive } = req.body;

    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (req.file) {
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const document = await Document.create({
      title,
      content: content || '',
      ownerId: req.user.id,
      isSensitive: isSensitive === 'true' || isSensitive === true,
      fileUrl,
      fileName,
      fileType
    });

    await auditLogger({
      userId: req.user.id,
      action: 'DOCUMENT_ACCESSED',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(201).json({ message: 'Doküman oluşturuldu', document });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!document) {
      return res.status(404).json({ message: 'Doküman bulunamadı' });
    }

    res.status(200).json({ message: 'Doküman silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = { getMyDocuments, getDocumentById, createDocument, deleteDocument };
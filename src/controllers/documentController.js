const Document = require('../models/Document');
const auditLogger = require('../utils/auditLogger');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    let filePublicId = null;

    if (req.file) {
      fileUrl = req.file.path;
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
      filePublicId = req.file.filename;
    }

    const document = await Document.create({
      title,
      content: content || '',
      ownerId: req.user.id,
      isSensitive: isSensitive === 'true' || isSensitive === true,
      fileUrl,
      fileName,
      fileType,
      filePublicId
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
    const document = await Document.findOne({
      _id: req.params.id,
      ownerId: req.user.id
    });

    if (!document) {
      return res.status(404).json({ message: 'Doküman bulunamadı' });
    }

    if (document.filePublicId) {
      try {
        const resourceType = document.fileType?.startsWith('image/') ? 'image' : 'raw';
        await cloudinary.uploader.destroy(document.filePublicId, { resource_type: resourceType });
      } catch (cloudErr) {
        console.error('Cloudinary silme hatası:', cloudErr.message);
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Doküman silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = { getMyDocuments, getDocumentById, createDocument, deleteDocument };
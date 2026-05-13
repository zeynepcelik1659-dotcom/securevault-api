const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { generalLimiter } = require('./middleware/rateLimiter');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const documentRoutes = require('./routes/document');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://securevault-ui.onrender.com'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'SecureVault API çalışıyor',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint bulunamadı' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Sunucu hatası', error: err.message });
});

module.exports = app;
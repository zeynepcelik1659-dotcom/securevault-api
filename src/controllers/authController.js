const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const auditLogger = require('../utils/auditLogger');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
};

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    await auditLogger({
      userId: user._id,
      action: 'REGISTER',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(201).json({ message: 'Kayıt başarılı', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      await auditLogger({
        action: 'LOGIN_FAILED',
        status: 'FAILED',
        ipAddress: req.ip,
        endpoint: req.originalUrl
      });
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await auditLogger({
        userId: user._id,
        action: 'LOGIN_FAILED',
        status: 'FAILED',
        ipAddress: req.ip,
        endpoint: req.originalUrl
      });
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await auditLogger({
      userId: user._id,
      action: 'LOGIN_SUCCESS',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Refresh Token
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token gerekli' });
    }

    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      isRevoked: false
    });

    if (!storedToken) {
      return res.status(401).json({ message: 'Geçersiz refresh token' });
    }

    if (storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Refresh token süresi dolmuş' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    const newAccessToken = generateAccessToken(user);

    await auditLogger({
      userId: user._id,
      action: 'TOKEN_REFRESHED',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { isRevoked: true }
    );

    await auditLogger({
      userId: req.user?.id,
      action: 'LOGOUT',
      status: 'SUCCESS',
      ipAddress: req.ip,
      endpoint: req.originalUrl
    });

    res.status(200).json({ message: 'Çıkış başarılı' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = { register, login, refresh, logout };
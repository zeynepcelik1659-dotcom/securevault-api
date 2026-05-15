const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const RefreshToken = require('../src/models/RefreshToken');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await User.deleteMany({ email: 'jest@test.com' });
  await RefreshToken.deleteMany({});
  await mongoose.connection.close();
});

describe('AUTH ENDPOINTLERİ', () => {

  describe('POST /api/auth/register', () => {
    it('Yeni kullanıcı kaydı başarılı olmalı', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Jest User', email: 'jest@test.com', password: 'Test1234!' });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Kayıt başarılı');
    });

    it('Aynı email ile tekrar kayıt olunamamalı', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Jest User', email: 'jest@test.com', password: 'Test1234!' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Bu email zaten kayıtlı');
    });
  });

  describe('POST /api/auth/login', () => {
    it('Doğru bilgilerle login başarılı olmalı', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'jest@test.com', password: 'Test1234!' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('Yanlış şifre ile login başarısız olmalı', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'jest@test.com', password: 'YanlisŞifre!' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Email veya şifre hatalı');
    });
  });

  describe('GET /api/users/me', () => {
    it('Token olmadan erişim reddedilmeli', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.statusCode).toBe(401);
    });

    it('Geçerli token ile kullanıcı bilgileri gelmeli', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'jest@test.com', password: 'Test1234!' });

      const token = loginRes.body.accessToken;

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user.email).toBe('jest@test.com');
    });
  });

  describe('GET /api/admin/dashboard', () => {
    it('Normal kullanıcı admin paneline erişememeli', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'jest@test.com', password: 'Test1234!' });

      const token = loginRes.body.accessToken;

      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/health', () => {
    it('Health check başarılı olmalı', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

});
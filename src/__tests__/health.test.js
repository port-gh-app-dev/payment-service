const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: 'payments-service',
    });
    expect(res.body.timestamp).toBeDefined();
  });
});

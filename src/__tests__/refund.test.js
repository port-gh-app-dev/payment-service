process.env.DEMO_MOCK_STRIPE = 'true';

const request = require('supertest');
const app = require('../app');

describe('POST /refund', () => {
  it('refunds a demo order when Stripe is mocked', async () => {
    const res = await request(app)
      .post('/refund')
      .send({
        userId: 'demo-user',
        orderId: 'ORD-demo-refundable',
        amount: 5,
        reason: 'requested_by_customer',
      });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      orderId: 'ORD-demo-refundable',
      amount: 5,
      currency: 'USD',
    });
    expect(res.body.refundId).toBeDefined();
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/refund').send({});
    expect(res.status).toBe(400);
  });

  it('returns 404 for unknown order', async () => {
    const res = await request(app)
      .post('/refund')
      .send({
        userId: 'demo-user',
        orderId: 'ORD-does-not-exist',
        amount: 1,
      });
    expect(res.status).toBe(404);
  });
});

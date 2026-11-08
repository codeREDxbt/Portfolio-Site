const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../server');

test('GET /api/health responds with success payload', async () => {
  const response = await request(app).get('/api/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'success');
  assert.equal(typeof response.body.timestamp, 'string');
});

test('GET /api/github-contributions rejects invalid username', async () => {
  const response = await request(app).get('/api/github-contributions?username=<script>');

  assert.equal(response.status, 400);
  assert.equal(response.body.status, 'error');
});

test('POST /api/visitor-increment rejects invalid method on GET', async () => {
  const response = await request(app).get('/api/visitor-increment');

  assert.equal(response.status, 404);
  assert.equal(response.body.status, 'error');
});

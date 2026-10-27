import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import app from '../server.js';

const baseUrl = 'http://localhost:5000';

test.after(async () => {
  try {
    await mongoose.disconnect();
  } catch {}
  setTimeout(() => process.exit(0), 100);
});

test('GET /health returns healthy status', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
  assert.equal(data.service, 'ArogyaBridge Backend');
});

test('GET /api/auth/nonce generates cryptographic challenge for valid wallet', async () => {
  const dummyWallet = '0x1111111111111111111111111111111111111111';
  const res = await fetch(`${baseUrl}/api/auth/nonce?address=${dummyWallet}`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.match(data.message, /Sign this message to authenticate with ArogyaBridge/);
  assert.match(data.message, /0x1111111111111111111111111111111111111111/);
});

test('GET /api/auth/nonce rejects invalid wallet addresses', async () => {
  const res = await fetch(`${baseUrl}/api/auth/nonce?address=invalid-address`);
  assert.equal(res.status, 400);
});

test('POST /api/chatbot validates empty message payload', async () => {
  const res = await fetch(`${baseUrl}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '' }),
  });
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.match(data.error, /valid message string is required/);
});

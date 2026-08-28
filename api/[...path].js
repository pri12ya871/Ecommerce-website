// Vercel serverless entry point for the Express API.
// Every /api/* request lands here; the app itself still owns the routing,
// so the same code serves local dev, Render and Vercel unchanged.
import { app, ready } from '../backend/server.js';

export default async function handler(req, res) {
  await ready;
  return app(req, res);
}

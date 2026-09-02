// Single serverless entry point for the Express API.
//
// vercel.json rewrites every /api/* request (and /send-text) onto this one
// function. A catch-all filename — api/[...path].js — looks like the tidier
// way to do that, but on this project only the first path segment reached
// the function: /api/products worked while /api/users/signin fell through to
// a platform 404. The explicit rewrite below is unambiguous.
//
// A rewrite can hand the function the destination path rather than the path
// the browser asked for, which would leave Express routing on "/api/index".
// The original is therefore passed through as __vpath and restored here
// before the app sees the request.
import { app, ready } from '../backend/server.js';

export default async function handler(req, res) {
  await ready;

  const url = new URL(req.url, 'http://localhost');
  const original = url.searchParams.get('__vpath');
  if (original) {
    url.searchParams.delete('__vpath');
    const query = url.searchParams.toString();
    req.url = query ? `${original}?${query}` : original;
  }

  return app(req, res);
}

/**
 * Auth API routes
 * Handles GitHub OAuth login, callback, logout, and session
 */
import type { APIRoute } from 'astro';
import { handleAuthRequest } from '@saastro/cms';

export const GET: APIRoute = async (context) => {
  return handleAuthRequest(context);
};

export const POST: APIRoute = async (context) => {
  return handleAuthRequest(context);
};

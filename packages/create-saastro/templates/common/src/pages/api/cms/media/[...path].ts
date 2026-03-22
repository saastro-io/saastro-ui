/**
 * Media API routes
 * Handles media upload, list, and delete operations
 */
import type { APIRoute } from 'astro';
import { handleMediaRequest } from '@saastro/cms';

export const GET: APIRoute = async (context) => {
  return handleMediaRequest(context);
};

export const POST: APIRoute = async (context) => {
  return handleMediaRequest(context);
};

export const DELETE: APIRoute = async (context) => {
  return handleMediaRequest(context);
};

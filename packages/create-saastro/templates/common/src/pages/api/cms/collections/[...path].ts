/**
 * Content API routes
 * Handles CRUD operations for content collections
 */
import type { APIRoute } from 'astro';
import { handleContentRequest } from '@saastro/cms';

export const GET: APIRoute = async (context) => {
  return handleContentRequest(context);
};

export const POST: APIRoute = async (context) => {
  return handleContentRequest(context);
};

export const PUT: APIRoute = async (context) => {
  return handleContentRequest(context);
};

export const DELETE: APIRoute = async (context) => {
  return handleContentRequest(context);
};

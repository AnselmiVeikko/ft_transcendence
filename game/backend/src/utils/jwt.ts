import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { join } from 'path';

interface JWTPayload {
  sub: string; // userId
  username: string;
  iss: string;
  aud: string;
  exp: number;
}

/**
 * Verify JWT token using HS256 secret
 * According to secure_game_flow.md:
 * - Signature must be valid (HS256)
 * - exp must not be expired
 * - iss must be "main-be"
 * - aud must be "game-be"
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    // HS256 uses symmetric key (secret), not RSA public key
    // Use the same secret that Main BE uses to sign tokens
    const secret = process.env.GAME_TOKEN_SECRET || "game-secret-change-this";

    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: 'main-be',
      audience: 'game-be'
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Sign JWT token for Game BE to authenticate to Main BE
 * Uses the same secret as verifyJWT (HS256 symmetric)
 * - issuer: 'game-be'
 * - audience: 'main-be'
 * - sub: 'game-service'
 * - exp: 5 minutes
 */
export function signServiceJWT(): string {
  const secret = process.env.GAME_TOKEN_SECRET!;
  
  const payload = {
    sub: 'game-service',
    iss: 'game-be',
    aud: 'main-be',
    exp: Math.floor(Date.now() / 1000) + (5 * 60), // 5 minutes
  };

  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
  });
}

/**
 * Extract matchId and token from WebSocket URL query params
 * Expected format: ws://host/ws?matchId=m456&token=JWT_TOKEN
 */
export function extractAuthParams(url: string): { matchId: string | null; token: string | null } {
  try {
    const urlObj = new URL(url, 'ws://localhost');
    const matchId = urlObj.searchParams.get('matchId');
    const token = urlObj.searchParams.get('token');
    return { matchId, token };
  } catch (error) {
    console.error('Failed to parse URL:', error);
    return { matchId: null, token: null };
  }
}


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
 * Verify JWT token using RS256 public key
 * According to secure_game_flow.md:
 * - Signature must be valid (RS256)
 * - exp must not be expired
 * - iss must be "main-be"
 * - aud must be "game-be"
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    // Get public key path from environment or use default
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || 
      join(process.cwd(), 'jwt_public.pem');
    
    let publicKey: string;
    try {
      publicKey = readFileSync(publicKeyPath, 'utf-8');
    } catch (error) {
      console.error(`Failed to read public key from ${publicKeyPath}:`, error);
      // For development, allow missing key file (will fail verification)
      return null;
    }

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
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


/**
 * Shared game and backend configuration.
 * Used by matchGameSession, gameManager, and any code that reports to Main BE.
 */

export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 600;

export function getNginxUrl(): string {
  return process.env.NGINX_URL || "https://nginx";
}

export function getGameServiceToken(): string {
  return process.env.GAME_SERVICE_TOKEN || "default";
}

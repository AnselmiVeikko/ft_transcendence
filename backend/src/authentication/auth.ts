import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

interface JWTPayload {
    userId: string;
    iat?:   number;
    exp?:   number;
}

export async function verifyAccess(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies?.accessJWT;
  if (!token) {
      return reply.status(401).send({ message: "Missing token "});
  }
  let payload: JWTPayload | undefined;
  try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JWTPayload;
  } catch (err) {
      return reply.status(401).send({ message: "Invalid token" });
  }
  return payload.userId;
}

export function setCookies(reply: FastifyReply, userId: string) {

    const accessJWT = jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "15m" }
    );

    const refreshJWT = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );
    reply
        .setCookie("accessJWT", accessJWT, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
            maxAge: 15 * 60 // 15 minutes
        })
        .setCookie("refreshJWT", refreshJWT, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 // 7 days
		})
		.setCookie("isLoggedIn", "true", {
			httpOnly: false,
			secure: true,
			sameSite: "none",
			path: "/",
			maxAge: 7 * 24 * 60 * 60
        });

    return reply;
}

export function clearCookies(reply: FastifyReply)
{
    reply.clearCookie("accessJWT", {
        path: "/",
    });
    reply.clearCookie("refreshJWT", {
        path: "/",
    });
	reply.clearCookie("isLoggedIn", {
        path: "/",
    });
}

export function genGameToken(matchId: string, userId: string, username: string) {
    // According to secure_game_flow.md: JWT payload should have sub, iss, aud
    const gameToken = jwt.sign(
        {
            //userId: userId,
            sub: userId,        // userId
            username: username,
            //matchId: matchId,
            iss: "main-be",     // issuer
            aud: "game-be",     // audience
        },
        process.env.GAME_TOKEN_SECRET!,
        { 
            algorithm: "HS256",
            expiresIn: "15m" 
        });

    return gameToken;
}

/**
 * Verify JWT token from Game BE for service-to-service authentication
 * Verifies tokens signed by Game BE (iss: 'game-be', aud: 'main-be')
 * Uses the same GAME_TOKEN_SECRET as genGameToken (HS256 symmetric)
 */
export function verifyGameServiceToken(token: string): boolean {
    try {
        const secret = process.env.GAME_TOKEN_SECRET!;
        jwt.verify(token, secret, {
            algorithms: ['HS256'],
            issuer: 'game-be',
            audience: 'main-be'
        });
        return true;
    } catch (error) {
        console.error('Game service token verification failed:', error);
        return false;
    }
}

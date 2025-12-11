import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

interface JWTPayLoad {
    userId: string;
    iat?:   number;
    exp?:   number;
}

export async function verifyAccess(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies?.accessJWT;
  if (!token) {
      return reply.status(401).send({ message: "Missing token "});
  }
  let payload: JWTPayLoad | undefined;
  try {
      payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "access-secret") as JWTPayLoad;
  } catch (err) {
      return reply.status(401).send({ message: "Invalid token" });
  }
  return payload.userId;
}


export async function refreshAccess(request: FastifyRequest, reply: FastifyReply){
     const token = request.cookies?.refreshJWT;
     if (!token) {
        return reply.status(401).send({ error: "Missing token" });
     }

     const user = request.cookies?.userId;
     try {
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refresh-secret") as JWTPayLoad;

        setCookies(reply, payload.userId);
        return reply.status(200).send({ message: "Token refreshed" });

     } catch (err) {
        return reply.status(401).send({ error: "Invalid token" });
     }
}

export function setCookies(reply: FastifyReply, userId: string) {

    const accessJWT = jwt.sign(
        { userId },
        process.env.JWT_ACCESS_SECRET || "access-secret",
        { expiresIn: "15m" }
    );

    const refreshJWT = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET || "refresh-secret",
        { expiresIn: "7d" }
    );
    reply
        .setCookie("accessJWT", accessJWT, {
            httpOnly: true,
            secure: false, //TODO: change to true when https connection is established
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60 // 15 minutes
        })
        .setCookie("refreshJWT", refreshJWT, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

    return reply;
}

export function clearCookies(reply: FastifyReply)
{
    reply.clearCookie("accessJWT", {
        path: "/",
    });
    reply.clearCookie("refreshJWT" {
        path: "/auth/refresh",
    });
}

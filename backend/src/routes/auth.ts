import type { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

/**
 * @brief Verifies the authentication token in a cookie
 * @param Fastifyrequest type annotation for request
 * @param FastifyReply type annotation for reply
 * @return Error if token is missing/invalid, nothing if everything works
 */
export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies?.auth_token;
    if (!token) {
        return reply.status(401).send({ error: "Missing token "});
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        (request as any).user = payload;
    } catch (err) {
        return reply.status(401).send({ error: "Invalid token" });
    }
}
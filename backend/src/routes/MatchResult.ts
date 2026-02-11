import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import prisma from "../plugins/prisma";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/UserResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { FinishMatchBodySchema, FinishMatchResponseSchema } from "../schemas/GameSchema";
import { error } from "node:console";

type FinishMatchRequest = FastifyRequest<{ Body: { matchId: string; winnerId: string; score: Record<string, number>; } }>;


export default async function matchResult(app: FastifyInstance) {
    app.post("/api/game/matchResult", {
        schema: {
            body: FinishMatchBodySchema,
            response: {
                200: FinishMatchResponseSchema,
                default: ErrorResponseSchema,
            },
        },
    }, async (request: FinishMatchRequest, reply: FastifyReply) => {
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return reply.status(500).send(errorResponse(400, "No authentication provided"));
        }
        const token = authHeader.slice(7);
        const secret = process.env.GAME_TOKEN_SECRET || "";
        if (!secret) {
            app.log.error("GAME_TOKEN_SECRET not set in environment ");
            return reply.status(500).send(errorResponse(500, "Server misconfiguration"));
        }

        const { matchId, winnerId } = request.body;
        if (!matchId)
            return reply.status(400).send(errorResponse(400, "No match id provided"));
        if (!winnerId)
            return reply.status(400).send(errorResponse(400, "No winner id provided"));
        
        try {
            jwt.verify(token, secret);
        } catch (err) {
            return reply.status(401).send(errorResponse(401, "Invalid or expired gameToken"));
        }

        const match = await prisma.game_match.findFirst({ where: { matchId } });
        if (!match)
            return reply.status(400).send(errorResponse(400, "Invalid match id"));

        await prisma.game_match.update({
            where: { matchId },
            data: { status: "FINISHED" },
        });

        return reply.status(200).send({ success: true });
    });
}

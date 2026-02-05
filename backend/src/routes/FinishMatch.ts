import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import prisma from "../plugins/prisma";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/UserResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { FinishMatchBodySchema, FinishMatchResponseSchema } from "../schemas/GameSchema";

type FinishMatchRequest = FastifyRequest<{ Body: { matchId: string; gameToken: string; } }>;


export default async function finishMatchRoute(app: FastifyInstance) {
    app.post("/api/game/finish", {
        schema: {
            body: FinishMatchBodySchema,
            response: {
                200: FinishMatchResponseSchema,
                default: ErrorResponseSchema,
            },
        },
    }, async (request: FinishMatchRequest, reply: FastifyReply) => {
        const secret = process.env.GAME_TOKEN_SECRET || "game-secret-change-this";
        if (!secret) {
            app.log.error("GAME_TOKEN_SECRET not set in environment ");
            return reply.status(500).send(errorResponse(500, "Server misconfiguration"));
        }

        const { matchId, gameToken } = request.body;
        if (!matchId)
            return reply.status(400).send(errorResponse(400, "No match id provided"));
        if (!gameToken)
            return reply.status(400).send(errorResponse(400, "No gameToken provided"));

        try {
            jwt.verify(gameToken, secret);
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

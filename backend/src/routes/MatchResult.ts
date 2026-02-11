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

        const { matchId, winnerId } = request.body;
        if (!matchId)
            return reply.status(400).send(errorResponse(400, "No match id provided"));
        if (!winnerId)
            return reply.status(400).send(errorResponse(400, "No winner id provided"));

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

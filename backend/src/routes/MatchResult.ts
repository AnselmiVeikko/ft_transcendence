import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Static } from "@sinclair/typebox";
import prisma from "../plugins/prisma";
import { errorResponse } from "../utils/UserResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import {
    MatchResultBodySchema,
    MatchResultParamsSchema,
    MatchResultResponseSchema,
} from "../schemas/GameSchema";

type MatchResultRequest = FastifyRequest<{
    Params: Static<typeof MatchResultParamsSchema>;
    Body: Static<typeof MatchResultBodySchema>;
}>;

function verifyGameServiceToken(request: FastifyRequest): boolean {
    const expected = process.env.GAME_SERVICE_TOKEN;
    // If no token is configured, allow (dev / local).
    if (!expected) return true;

    const header = request.headers.authorization;
    if (!header) return false;
    const [kind, token] = header.split(" ");
    if (kind !== "Bearer" || !token) return false;
    return token === expected;
}

export default async function matchResult(app: FastifyInstance) {
    // Called by Game BE when a match ends.
    // IMPORTANT: Game BE currently posts to /matches/:matchId/result (no /api prefix).
    app.post("/matches/:matchId/result", {
        schema: {
            params: MatchResultParamsSchema,
            body: MatchResultBodySchema,
            response: {
                200: MatchResultResponseSchema,
                default: ErrorResponseSchema,
            },
        },
    }, async (request: MatchResultRequest, reply: FastifyReply) => {
        try {
            if (!verifyGameServiceToken(request)) {
                return reply.status(403).send(errorResponse(403, "Forbidden"));
            }

            const { matchId } = request.params;
            if (!matchId) {
                return reply.status(400).send(errorResponse(400, "No match id provided"));
            }

            const match = await prisma.game_match.findUnique({ where: { matchId } });
            if (!match) {
                return reply.status(404).send(errorResponse(404, "Match not found"));
            }

            // Mark match finished so players can re-queue.
            // Idempotent: updating FINISHED to FINISHED is fine.
            await prisma.game_match.update({
                where: { matchId },
                data: { status: "FINISHED" },
            });

            // NOTE: We currently don't persist winnerId/score in DB schema.
            // This endpoint exists to unblock matchmaking by finalizing the match.
            app.log.info({ matchId, winnerId: request.body.winnerId }, "Match result received");

            return reply.status(200).send({ message: "Match result recorded" });
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send(errorResponse(500, "Internal server error"));
        }
    });
}


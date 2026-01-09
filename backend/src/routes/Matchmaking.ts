import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { verifyAccess } from "../utils/auth";
import { errorResponse } from "../utils/UserResponses";
import { MatchCreatedResponseSchema, MatchFoundResponseSchema } from "../schemas/GameSchema";
import prisma from "../plugins/prisma";
import { MatchCreated, MatchFound } from "../utils/GameResponses";

export default async function MatchmakingRequest(app: FastifyInstance) {
    app.post( "/api/game/matchmaking", {
        schema: {
            response: {
                 200: MatchFoundResponseSchema || MatchCreatedResponseSchema,
                default: ErrorResponseSchema,
            },
        },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const userId = await verifyAccess(request, reply);
            if (!userId)
                return ;

            const user = await prisma.user_info.findUnique({
                where: { userId: userId }
            });

            if (!user) {
                return reply.status(401).send(errorResponse(400, "User profile not found"));
            }

            const availableMatch = await prisma.game_match.findFirst({
                where: {
                    status:  "MATCHMAKING",
                    playerTwoId: null,
                }
            });

            if (availableMatch) {
                const updatedMatch = await prisma.game_match.update({
                    where: { matchId: availableMatch.matchId },
                    data: {
                        status: "STARTING",
                        playerTwoId: userId,
                    }
                });

                return reply.status(200).send(MatchFound(updatedMatch));
            }
            else {
                const newMatch = await prisma.game_match.create({ data: { playerOneId: userId } });

                return reply.status(200).send(MatchCreated(newMatch));
            }
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send(errorResponse(500, "Internal server error during matchmaking"));
        }

    }
)
}
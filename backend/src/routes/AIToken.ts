import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyAccess, genGameToken } from "../utils/auth";
import { errorResponse } from "../utils/UserResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { AITokenResponseSchema } from "../schemas/GameSchema";
import prisma from "../plugins/prisma";
import { aiTokenResponse } from "../utils/GameResponses";

type AITokenRequest = FastifyRequest<{ Body: { matchId: string } }>;

export default async function aiToken(app: FastifyInstance) {
    app.post( "/api/game/aiToken", {
            schema: {
                response: {
                    200: AITokenResponseSchema,
                    default: ErrorResponseSchema,
                },
            },
        },

        async (request: AITokenRequest, reply: FastifyReply) => {
            try {
                const userId = await verifyAccess(request, reply);
                if (!userId) {
                    return;
                }

                const { matchId } = request.body;
                if (!matchId) {
                    return reply.status(400).send(errorResponse(400, "Match ID is required"));
                }

                const user = await prisma.user_info.findUnique({
                    where: { userId: userId },
                });

                if (!user) {
                    return reply.status(401).send(errorResponse(401, "User profile not found"));
                }

                const gameToken = genGameToken(matchId, userId, user.userName);

                return reply.status(200).send(aiTokenResponse(gameToken));
            } catch (error: any) {
                app.log.error(error);
                return reply.status(500).send(errorResponse(500, "Internal server error"));
            }
        });
}

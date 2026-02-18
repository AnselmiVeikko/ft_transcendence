import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyAccess } from "../utils/auth";
import { genGameToken } from "../utils/auth";
import { errorResponse } from "../utils/UserResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import prisma from "../plugins/prisma";

type AITokenRequest = FastifyRequest<{ Body: { matchId: string } }>;

export default async function aiToken(app: FastifyInstance) {
    app.post("/api/game/aiToken", {
        schema: {
            response: {
                200: {
                    type: "object",
                    properties: {
                        success: { type: "boolean" },
                        data: {
                            type: "object",
                            properties: {
                                gameToken: { type: "string" },
                            },
                        },
                    },
                },
                default: ErrorResponseSchema,
            },
        },
    }, async (request: AITokenRequest, reply: FastifyReply) => {
        try {
            // Verify user is authenticated
            const userId = await verifyAccess(request, reply);
            if (!userId) return; // verifyAccess already sent error response

            const { matchId } = request.body;
            if (!matchId) {
                return reply.status(400).send(errorResponse(400, "Match ID is required"));
            }

            // Get user info from database (same as matchmaking)
            const user = await prisma.user_info.findUnique({
                where: { userId: userId }
            });

            if (!user) {
                return reply.status(401).send(errorResponse(401, "User profile not found"));
            }

            // Generate game token (same as matchmaking)
            const gameToken = genGameToken(matchId, userId, user.userName);

            return reply.status(200).send({
                success: true,
                data: {
                    gameToken,
                },
            });
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send(errorResponse(500, "Internal server error"));
        }
    });
}

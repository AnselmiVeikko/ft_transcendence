import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import jwt from "jsonwebtoken";
import { prisma } from "../plugins/prisma";
import { verifyAccess } from "../utils/auth";
import { errorResponse } from "../utils/UserResponses";
import { gameTokenCreated } from "../utils/GameResponses";
import { GameTokenResponseSchema, GameTokenBodySchema } from "../schemas/GameSchema";
import { ErrorResponseSchema } from "../schemas/UserSchema";

type GameTokenRequest = FastifyRequest<{ 
    Body: Static<typeof GameTokenBodySchema> 
}>;

export default async function gameTokenRoute(app: FastifyInstance) {
    app.post("/api/game/token", {
        schema: {
            body: GameTokenBodySchema,
            response: {
                200: GameTokenResponseSchema,
                default: ErrorResponseSchema,
            },
        },
    }, async (request: GameTokenRequest, reply: FastifyReply) => {
        try {
            const userId = await verifyAccess(request, reply);
            if (!userId) {
                return;
            }

            const { matchId } = request.body;

            const match = await prisma.game_match.findUnique({
                where: { matchId },
            });

            if (!match) {
                return reply.status(404).send(errorResponse(404, "Match not found"));
            }

            const isPlayerOne = match.playerOneId === userId;
            const isPlayerTwo = match.playerTwoId === userId;

            if (!isPlayerOne && !isPlayerTwo) {
                return reply.status(403).send(
                    errorResponse(403, "You are not authorized to join this match")
                );
            }

            const user = await prisma.user_info.findUnique({
                where: { userId },
            });

            if (!user) {
                return reply.status(404).send(errorResponse(404, "User not found"));
            }

            const gameToken = jwt.sign(
                {
                    userId: userId,
                    username: user.userName,
                    matchId: matchId,
                },
                process.env.GAME_TOKEN_SECRET || "game-secret-change-this",
                { expiresIn: "15m" }
            );

            return reply.status(200).send(gameTokenCreated(
                {
                    gameToken,
                    matchId,
                    wsUrl: process.env.GAME_WS_URL || "ws://localhost:4000/game",
                },
                {
                    userId: userId,
                    username: user.userName,
                }
            ));

        } catch (error) {
            app.log.error(error);
            return reply.status(500).send(errorResponse(500, "Failed to generate game token"));
        }
    });
}

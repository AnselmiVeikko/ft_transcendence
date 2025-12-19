import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { verifyAccess } from "../utils/auth";
import { errorResponse } from "../utils/UserResponses";
import { MatchmakingResponseSchema } from "../schemas/GameSchema";
import prisma from "../plugins/prisma";

export default async function matchmakingRequest(app: FastifyInstance) {
    app.post( "/api/game/matchmaking", {
        schema: {
            response: {
                200: MatchmakingResponseSchema,
                default: ErrorResponseSchema,
            },
        },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = verifyAccess(request, reply);
        if (!userId)
            return ;

        const user = await prisma.user_info.findUnique({
            where: { userId: userId }
        });

        if (!user) {
            return reply.status(200).send(errorResponse(400, "User profile not found"));
        }

        const updated = await prisma.game_match.updateMany({
            where: {
                status:  "MATCHMAKING",
                playerTwoId: null,
            },
            data: {
                status: "IN_PROGRESS",
                playerTwoId: userId,
            },
        });

        if (updated.count === 0){
            await prisma.game_match.create({ playerOneId: userId});
        }

    }
)
}
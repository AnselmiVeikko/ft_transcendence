import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { verifyAccess } from "../utils/auth";

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
    }
)
}
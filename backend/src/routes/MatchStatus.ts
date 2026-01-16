import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { MatchStatusQuerySchema, MatchStatusResponseSchema } from "../schemas/GameSchema";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { Static } from "@sinclair/typebox";
import { verifyAccess } from "../utils/auth";
import { errorResponse } from "../utils/UserResponses";
import prisma from "../plugins/prisma"
import { MatchStatusResponse } from "../utils/GameResponses";


type MatchStatusRequest= FastifyRequest<{ Body: Static<typeof MatchStatusQuerySchema> }>;

export default async function MatchStatus(app: FastifyInstance) {
    app.get( "/api/game/matchstatus", {
        schema: {
            body: MatchStatusQuerySchema,
            response: {
                200: MatchStatusResponseSchema,
                default: ErrorResponseSchema,
            },
        },
    },

    async(request: MatchStatusRequest, reply: FastifyReply) => {
        try {
            const userId = await verifyAccess(request, reply);
            if (!userId)
                return ;

            const matchId = request.body.matchId;
            if (!matchId)
                return reply.status(400).send(errorResponse(400, "No match id provided"));

            const match = await prisma.game_match.findFirst({
                where: {matchId: matchId}
            });
            if (!match)
                return reply.status(400).send(errorResponse(400, "Invalid match id"));

            return reply.status(200).send(MatchStatusResponse(match.status))
            
        } catch (error) {
            app.log.error(error);
            return reply.status(500).send(errorResponse(500, "Internal server error"));
        }
    }
)
}
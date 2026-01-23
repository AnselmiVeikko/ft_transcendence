import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { DeleteMatchQuerySchema, DeleteMatchResponseSchema } from "../schemas/GameSchema";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { verifyAccess } from "../utils/auth";
import { Static } from "@sinclair/typebox";
import { errorResponse } from "../utils/UserResponses";
import prisma from "../plugins/prisma";
import { matchDeleted } from "../utils/GameResponses";

type DeleteMatchRequest = FastifyRequest<{ Querystring: Static<typeof DeleteMatchQuerySchema> }>;

export default async function deleteMatch(app: FastifyInstance) {
    app.delete( "/api/game/deleteMatch", {
        schema: {
            querystring: DeleteMatchQuerySchema,
            response: {
                200: DeleteMatchResponseSchema,
                default: ErrorResponseSchema,
            }
        },
    },
    
    async (request: DeleteMatchRequest, reply: FastifyReply) => {
        try {
            const userId = await verifyAccess(request, reply);
            if (!userId) {
                return ;
            }

            const matchId = request.query.matchId;

            await prisma.game_match.delete( { 
                where: {matchId: matchId},
            });

            return reply.status(200).send(matchDeleted(matchId));

        } catch(err) {
            app.log.error(err);
            return reply.status(500).send(errorResponse(500, "Internal server error"));
        }
    });
}
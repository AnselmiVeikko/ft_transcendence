import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { DeleteMatchBodySchema, DeleteMatchResponseSchema } from "../schemas/GameSchema";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { verifyAccess } from "../utils/auth";
import { Static } from "@sinclair/typebox";
import { errorResponse } from "../utils/UserResponses";
import prisma from "../plugins/prisma";
import { matchDeleted } from "../utils/GameResponses";
import { Prisma } from ".prisma/client/default";

type DeleteMatchRequest = FastifyRequest<{ Body: Static<typeof DeleteMatchBodySchema> }>;

export default async function deleteMatch(app: FastifyInstance) {
	app.post( "/api/game/deleteMatch", {
		schema: {
			body: DeleteMatchBodySchema,
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

			const matchId = request.body.matchId;

			await prisma.game_match.delete( {
				where: {matchId: matchId},
			});

			return reply.status(200).send(matchDeleted(matchId));

		} catch(error: any) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					return reply.status(404).send(errorResponse(404, "Match not found"));
				}
			}

			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

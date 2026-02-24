import { prisma } from "../plugins/prisma";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LogoutResponseSchema, ErrorResponseSchema } from "../schemas/UserSchema";
import { logoutSuccess, errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../utils/auth";
import { clearCookies } from "../utils/auth";

export default async function logoutRoutes(app: FastifyInstance) {
	app.post( "/api/user/logout", {
		schema: {
				response: {
					200: LogoutResponseSchema,
					default: ErrorResponseSchema,
				},
			},
	},
	async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId)
				return;

			const user = await prisma.user_info.findUnique({ where: { userId }});
			if (!user) {
				return reply.status(401).send(errorResponse(401, "User does not exist"));
			}

			clearCookies(reply);

			await prisma.user_info.update({ where: { userId: user.userId }, data: { status: 'OFFLINE' } });

			return reply.status(200).send(logoutSuccess());

		} catch(error) {
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

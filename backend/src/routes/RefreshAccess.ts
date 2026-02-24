import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { errorResponse } from "../utils/UserResponses";
import jwt from "jsonwebtoken";
import { setCookies } from "../utils/auth";
import { refreshAccessResponseSchema } from "../schemas/UserSchema";
import { accessRefreshed } from "../utils/UserResponses";

interface JWTPayload {
	userId: string;
	iat?:   number;
	exp?:   number;
}

export default async function refreshAccess(app: FastifyInstance) {
	app.post( "/api/user/refreshAccess", {
		schema: {  response: {
					200: refreshAccessResponseSchema,
					default: ErrorResponseSchema,
				}
			}
	},
	async (request: FastifyRequest, reply: FastifyReply) => {
		const token = request.cookies?.refreshJWT;
		if (!token) {
			return reply.status(401).send(errorResponse(401, "Missing token" ));
		}

		const userId = request.cookies?.userId;
		try {
			const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "refresh-secret") as JWTPayload;

			setCookies(reply, payload.userId);
			return reply.status(200).send(accessRefreshed());

		} catch (err) {
			app.log.error(err);
			return reply.status(401).send(errorResponse(401, "Invalid token" ));
		}
	});
}

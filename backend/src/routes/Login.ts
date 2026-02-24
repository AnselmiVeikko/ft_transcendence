import  bcrypt  from "bcrypt";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";
import { prisma } from "../plugins/prisma";
import { loginSuccess, errorResponse } from "../utils/UserResponses";
import { LoginBodySchema, LoginResponseSchema, ErrorResponseSchema } from "../schemas/UserSchema";
import { setCookies } from "../utils/auth";

type LoginRequest = FastifyRequest<{ Body: Static<typeof LoginBodySchema> }>;

export default async function loginRoutes(app: FastifyInstance) {
	app.post( "/api/user/login", {
		schema: {
				body: LoginBodySchema,
				response: {
					200: LoginResponseSchema,
					default: ErrorResponseSchema,
				},
			},
	},
	async (request: LoginRequest, reply: FastifyReply) => {
		try {
			const { email, password } = request.body;

			const user = await prisma.user_info.findUnique({ where: { email }});
			if (!user) {
				return reply.status(401).send(errorResponse(401, "User does not exist"));
			}

			//Check the crypted password
			const passCheck = await bcrypt.compare(password, user.password);

			if (!passCheck) {
				return reply.status(401).send(errorResponse(401, "Invalid credentials."));
			}

			setCookies(reply, user.userId);

			await prisma.user_info.update({ where: { userId: user.userId }, data: { status: 'ONLINE' } });

			return reply.status(200).send(loginSuccess());

		} catch(error) {

			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

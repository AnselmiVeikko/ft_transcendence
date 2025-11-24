import bcrypt  from "bcrypt";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from '../plugins/prisma';
import { Static } from "@sinclair/typebox";
import { RegistrationSuccess } from "../utils/responses";
import { RegisterBodySchema, RegisterResponseSchema, ErrorResponseSchema } from "../schemas/user";

type RegisterRequest = FastifyRequest<{ Body: Static<typeof RegisterBodySchema> }>;

export default async function registrationRoutes(app: FastifyInstance) {
	app.post( "/user/registration", {
		schema: {
			body: RegisterBodySchema,
			response: {
				201: RegisterResponseSchema,
				400: ErrorResponseSchema,
				401: ErrorResponseSchema,
			},
		},
	},
	async (request: RegisterRequest, reply: FastifyReply) => {
	const { username, email, password } = request.body;

		const existingUser = await prisma.user_info.findUnique({ where: { email } });
		if (existingUser) {
			return reply.status(400).send({ error: "Email already registered." });
		}

		//Encrypt the password
		const cryptedPass = await bcrypt.hash(password, 10);

		const user = await prisma.user_info.create({
			data: { username, email, cryptedPass },
		});

		return reply.status(201).send(RegistrationSuccess(user));
	});
}

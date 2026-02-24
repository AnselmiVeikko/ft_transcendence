import bcrypt  from "bcrypt";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from '../plugins/prisma';
import { Prisma } from "@prisma/client";
import { Static } from "@sinclair/typebox";
import { errorResponse, registrationSuccess } from "../utils/UserResponses";
import { RegisterBodySchema, RegisterResponseSchema, ErrorResponseSchema } from "../schemas/UserSchema";

type RegisterRequest = FastifyRequest<{ Body: Static<typeof RegisterBodySchema> }>;

export default async function registrationRoutes(app: FastifyInstance) {
	app.post( "/api/user/registration", {
		schema: {
			body: RegisterBodySchema,
			response: {
				201: RegisterResponseSchema,
				default: ErrorResponseSchema
			},
		},
	},
	async (request: RegisterRequest, reply: FastifyReply) => {
		try {
			const { userName, email, password } = request.body;

			const existingUser = await prisma.user_info.findFirst({
				where: {
				OR: [{ userName }, { email }],
				},
			});

			if (existingUser) {
				if (existingUser.userName === userName) {
					return reply.status(400).send(errorResponse(400, "Username already registered."));
				}
				if (existingUser.email === email) {
					return reply.status(400).send(errorResponse(400, "Email already registered."));
				}
			}

			//Encrypt the password
			const hashedPassword = await bcrypt.hash(password, 10);

			const user = await prisma.user_info.create({
				data: { userName,
						email,
						password: hashedPassword },
			});

			return reply.status(201).send(registrationSuccess());

		} catch(error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					return reply.status(400).send({ message: "Username or email already exists." });
				}
			}
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

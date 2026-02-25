import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../plugins/prisma";
import { Prisma } from "@prisma/client";
import { Static } from "@sinclair/typebox";
import { ProfileUpdateSchema, ProfileUpdateResponseSchema } from "../schemas/ProfileSchema";
import { profileUpdate } from "../utils/ProfileResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../authentication/auth";

type ProfileUpdate = FastifyRequest<{ Body: Static<typeof ProfileUpdateSchema> }>;

// if only username and email then delete the second one.
export default async function profileUpdateRoutes(app: FastifyInstance) {
	app.put("/api/user/profile/update", {
		schema: {
			body: ProfileUpdateSchema,
			response: {
				200: ProfileUpdateResponseSchema,
				default: ErrorResponseSchema
			},
		},
	},

	async (request: ProfileUpdate, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}

			const { userName, email } = request.body;

			if (!userName && !email) {
				return reply.status(400).send(errorResponse(400, "Nothing to update"));
			}

			if (userName !== undefined && userName.trim() === "") {
				return reply.status(400).send(errorResponse(400, "userName cannot be empty"));
			}
			if (email !== undefined && email.trim() === "") {
				return reply.status(400).send(errorResponse(400, "Email cannot be empty"));
			}
			const isExists = await prisma.user_info.findUnique({ where: { userId } });
			if (!isExists) {
				return reply.status(404).send(errorResponse(404, "User not found"));
			}

			const newUserName = userName?.trim();
			if (newUserName && newUserName !== isExists.userName) {
				const taken = await prisma.user_info.findUnique({
					where: { userName: newUserName },
				});
				if (taken) {
					return reply.status(409).send(errorResponse(409, "Username already taken"));
				}
			}

			const data: Prisma.user_infoUpdateInput = {};
			if (newUserName && newUserName !== isExists.userName) {
				data.userName = newUserName;
			}

			const newEmail = email?.trim();
			if (newEmail && newEmail !== isExists.email) {
				const taken = await prisma.user_info.findUnique({
					where: { email: newEmail },
				});
				if (taken) {
				return reply.status(409).send(errorResponse(409, "Email already taken"));
				}
			}

			if (newEmail && newEmail !== isExists.email) {
				data.email = newEmail;
			}

			const updatedData = await prisma.user_info.update({
				where: { userId },
				data,
				select: {
					userId: true,
					userName: true,
					email: true,
				},
			});

			return reply.status(200).send(profileUpdate(updatedData));
		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

/*
import { request } from "http";
import bcrypt from "bcrypt";
import { clearCookies } from "../utils/auth";

export default async function profileUpdateRoutes(app: FastifyInstance) {
	app.put("/api/user/profile/update", {
		schema: {
			body: ProfileUpdateSchema,
			response: {
				200: ProfileUpdateResponseSchema,
				default: ErrorResponseSchema
			},
		},
	},

	async (request: ProfileUpdate, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}

			const { userName, password } = request.body;

			if (!userName && ! password) {
				return reply.status(400).send(errorResponse(400, "Nothing to update"));
			}

			if (userName !== undefined && userName.trim() === "") {
				return reply.status(400).send(errorResponse(400, "userName cannot be empty"));
			}
			if (password !== undefined && password.trim() === "") {
				return reply.status(400).send(errorResponse(400, "password cannot be empty"));
			}
			const isExists = await prisma.user_info.findUnique({ where: { userId } });
			if (!isExists) {
				return reply.status(404).send(errorResponse(404, "User not found"));
			}
			const newUserName = userName?.trim();
			if (newUserName && newUserName !== isExists.userName) {
			  const taken = await prisma.user_info.findUnique({
				where: { userName: newUserName },
				});
				if (taken) {
				return reply.status(409).send(errorResponse(409, "Username already taken"));
				}
			}

			const data: Prisma.user_infoUpdateInput = {};
			if (newUserName && newUserName !== isExists.userName) {
				data.userName = newUserName;
			}
			if (password) {
				const hashed = await bcrypt.hash(password, 10);
				data.password = hashed;

				clearCookies(reply); // is it right way of logging out?
				await prisma.user_info.update({ where: { userId: userId }, data: { status: 'OFFLINE' } }); // is it right way of logging out?
			}
			if (Object.keys(data).length === 0) {
				return reply.status(400).send(errorResponse(400, "No changes detected"));
			}

			const updatedData = await prisma.user_info.update({
				where: { userId },
				data,
				select: {
					userId: true,
					userName: true,
				},
			});

			return reply.status(200).send(profileUpdate(updatedData));
		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}
*/

import { FastifyInstance, FastifyRequest, FastifyReply  } from "fastify";
import { prisma } from "../plugins/prisma";
import { Static } from "@sinclair/typebox";
import { ProfileSelfQuerySchema, ProfileSelfResponseSchema, ErrorResponseSchema } from "../schemas/UserSchema";
import { profileSelf, getAvatarUrl, errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../utils/auth";

type ProfileSelfRequest = FastifyRequest<{ Querystring: Static<typeof ProfileSelfQuerySchema> }>;

export default async function profileRoutes(app: FastifyInstance) {
	app.get("/api/user/profile/self", {
		schema: {
			response: {
				200: ProfileSelfResponseSchema,
				default: ErrorResponseSchema
			}
		}
	},
	async (request: ProfileSelfRequest, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}

			const userProfile = await prisma.user_info.findUnique({
				where: { userId: userId }
			});

			if (!userProfile) {
				return reply.status(400).send(errorResponse(400, "User profile not found"));
			}

			const avatarUrl = getAvatarUrl(userProfile.avatarName);

			return reply.status(200).send(profileSelf(userProfile, avatarUrl));

		} catch (error) {
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

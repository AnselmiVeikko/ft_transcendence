import { FastifyInstance, FastifyRequest, FastifyReply  } from "fastify";
import { prisma } from "../plugins/prisma";
import { Static } from "@sinclair/typebox";
import { ProfileSelfQuerySchema, ProfileSelfResponseSchema, ErrorResponseSchema } from "../schemas/UserSchema";
import { ProfileAllfQuerySchema, ProfileAllResponseSchema } from "../schemas/UserSchema";
import { profileSelf, profileAll, getAvatarUrl, errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../authentication/auth";

type ProfileSelfRequest = FastifyRequest<{ Querystring: Static<typeof ProfileSelfQuerySchema> }>;
type ProfileAllRequest = FastifyRequest<{ Querystring: Static<typeof ProfileAllfQuerySchema> }>;

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
	});

	app.get(
		"/api/user/profile/all",
		{
		  schema: {
			querystring: ProfileAllfQuerySchema,
			response: {
			  200: ProfileAllResponseSchema,
			},
		  },
		},
		async (request: ProfileAllRequest, reply: FastifyReply) => {

			const pageNo = Number(request.query.pageNo)?? 1;
			const limit = Number(request.query.limit)?? 1;
			const skip = (pageNo - 1) * limit;
			const totalUser = await prisma.user_info.count();

			const users = await prisma.user_info.findMany({
				skip,
				take: limit,
				select: {
					userId: true,
					userName: true,
					email: true,
					avatarName: true,
				},
			});

			const usersWithAvatar = users.map(user => {
				const avatarUrl = getAvatarUrl(user.avatarName);

				return {
					userId: user.userId,
					userName: user.userName,
					email: user.email,
					avatarUrl,
				};
			});
			return reply.status(200).send(profileAll(usersWithAvatar, pageNo, limit, totalUser));
		}
	);
}


// export default async function profilePersonalRoutes(app: FastifyInstance) {
// 	app.get("/api/user/profilepersonal/:userId", async (request, reply) => {
// 		try {
// 			const{ userid } = request.params as {
// 				userid?: string;
// 			};

// 			if (!userid) {
// 				return reply.status(400).send(errorResponse(400,"No userid provided."));
// 			}

// 			const userIdNum = Number(userid);

// 			if (isNaN(userIdNum)) {
// 				return reply.status(400).send(errorResponse(400,"Invalid userid format"));
// 			}

// 			const userProfile = await prisma.user_info.findUnique({ where: { userId: userIdNum }});

// 			if (!userProfile) {
// 				return reply.status(404).send(errorResponse(404, "User profile not found"));
// 			}

// 			return reply.status(200).send({
// 				message: "Profile exists",
// 				data: {
// 					userid: userProfile.userId,
// 					username: userProfile.userName,
// 					email: userProfile.email,
// 					membersince: userProfile.createdAt,
// 				}
// 			})
// 		} catch (error) {
// 			app.log.error(error);
// 			return reply.status(500).send ({ message: "Internal server error" });
// 		}


// 	});

// }

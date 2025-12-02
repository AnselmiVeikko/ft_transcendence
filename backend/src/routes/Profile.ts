import { FastifyInstance, FastifyRequest, FastifyReply  } from "fastify";
import { prisma } from "../plugins/prisma";
import { Static } from "@sinclair/typebox";
import { ProfileSelfQuerySchema, ProfileSelfResponseSchema, ErrorResponseSchema } from "../schemas/UserSchema";
import { ProfileAllfQuerySchema, ProfileAllResponseSchema } from "../schemas/UserSchema";
import { ProfileSelf, ProfileAll, errorResponse } from "../utils/UserResponses";


type ProfileSelfRequest = FastifyRequest<{ Querystring: Static<typeof ProfileSelfQuerySchema> }>;
type ProfileAllRequest = FastifyRequest<{ Querystring: Static<typeof ProfileAllfQuerySchema> }>;

export default async function profileRoutes(app: FastifyInstance) {
	app.get("/api/user/profile/self", {
		schema: {
			querystring: ProfileSelfQuerySchema,
			response: {
				200: ProfileSelfResponseSchema,
				default: ErrorResponseSchema
			}
		}
	},
	async (request: ProfileSelfRequest, reply: FastifyReply) => {
		const { userId } = request.query;

		const userIdNum = Number(userId);

		if (isNaN(userIdNum)) {
			return reply.status(400).send(errorResponse(400, "Invalid userId format"));
		}

		const userProfile = await prisma.user_info.findUnique({
			where: { userId: userIdNum }
		});

		if (!userProfile) {
			return reply.status(400).send(errorResponse(400, "User profile not found"));
		}

		return reply.status(200).send(ProfileSelf(userProfile));
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
			const usersAll = await prisma.user_info.findMany({
				select: {
					userId: true,
					userName: true,
					email: true,
				},
			});
			return reply.status(200).send(ProfileAll(usersAll));
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

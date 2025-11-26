import { FastifyInstance, FastifyRequest, FastifyReply  } from "fastify";
import { prisma } from "../plugins/prisma";
import { Static } from "@sinclair/typebox";
import { ProfilePersonalQuerySchema, ProfilePersonalResponseSchema, ErrorResponseSchema } from "../schemas/user";
import { ProfilePersonal } from "../utils/responses";


type ProfilePersonalRequest = FastifyRequest<{ Querystring: Static<typeof ProfilePersonalQuerySchema> }>;

export default async function profileRoutes(app: FastifyInstance) {
	app.get("/api/user/profile", {
		schema: {
			querystring: ProfilePersonalQuerySchema,
			response: {
				200: ProfilePersonalResponseSchema,
				400: ErrorResponseSchema
			}
		}
	},
	async (request: ProfilePersonalRequest, reply: FastifyReply) => {
		const { userId } = request.query;

		const userIdNum = Number(userId);

		if (isNaN(userIdNum)) {
			return reply.status(400).send({ message: "Invalid userId format" });
		}

		const userProfile = await prisma.user_info.findUnique({
			where: { userId: userIdNum }
		});

		if (!userProfile) {
			return reply.status(400).send({ message: "User profile not found" });
		}

		return reply.status(200).send(ProfilePersonal(userProfile));

		// return reply.status(200).send({
		// 	message: "Profile retrieved successfully",
		// 	user: {
		// 		userId: userProfile.userId,
		// 		userName: userProfile.userName,
		// 		email: userProfile.email,
		// 		createdAt: userProfile.createdAt.toISOString()
		// 	}
		// });
	});
}

// export default async function profilePersonalRoutes(app: FastifyInstance) {
// 	app.get("/api/user/profilepersonal/:userId", async (request, reply) => {
// 		try {
// 			const{ userid } = request.params as {
// 				userid?: string;
// 			};

// 			if (!userid) {
// 				return reply.status(400).send({message: "No userid provided."});
// 			}

// 			const userIdNum = Number(userid);

// 			if (isNaN(userIdNum)) {
// 				return reply.status(400).send({message: "Invalid userid format"});
// 			}

// 			const userProfile = await prisma.user_info.findUnique({ where: { userId: userIdNum }});

// 			if (!userProfile) {
// 				return reply.status(404).send({message: "User profile not found"});
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

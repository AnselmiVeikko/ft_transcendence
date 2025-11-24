import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";

export default async function profileRoutes(app: FastifyInstance) {
	app.get("/api/user/profile/:userid", async (request, reply) => {
		try {
			const{ userid } = request.params as {
				userid?: string;
			};

			if (!userid) {
				return reply.status(400).send({message: "No userid provided."});
			}

			const userIdNum = Number(userid);

			if (isNaN(userIdNum)) {
				return reply.status(400).send({message: "Invalid userid format"});
			}

			const userProfile = await prisma.user_info.findUnique({ where: { userId: userIdNum }});

			if (!userProfile) {
				return reply.status(404).send({message: "User profile not found"});
			}

			return reply.status(200).send({
				message: "Profile exists",
				data: {
					userid: userProfile.userId,
					username: userProfile.userName,
					email: userProfile.email,
					membersince: userProfile.createdAt,
				}
			})
		} catch (error) {
			app.log.error(error);
			return reply.status(500).send ({ message: "Internal server error" });
		}


	});

}

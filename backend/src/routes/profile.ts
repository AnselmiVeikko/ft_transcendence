import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";

export default async function profileRoutes(app: FastifyInstance) {
	app.get("/api/user/profile", async (request, reply) => {
		const{ userid } = request.query as {
			userid?: number;
		};

		if (!userid) {
			return reply.status(400).send({message: "No userid given."});
		}

		const userProfile = await prisma.user_info.findFirst({ where: { userId: userid }});
		if (!userProfile) {
			return reply.status(401).send({message: "User profile not found"});
		}

		return reply.status(200).send({
			message: "Profile exixtes",
			userprofile: {
				username: userProfile.userName,
				email: userProfile.email,
				membersince: userProfile.createdAt,
			}
		})
	});

}

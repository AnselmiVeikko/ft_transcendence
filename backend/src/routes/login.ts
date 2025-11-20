import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export default async function loginRoutes(app: FastifyInstance) {
	app.post("/api/user/login", async (request, reply) => {
		const { username, password } = request.body as {
			username?: string;
			password?: string;
		};

		if (!username || !password) {
			return reply.status(400).send({ message: "Enter your username and password."});
		}

		const existingUser = await prisma.user_info.findUnique({ where: { userName: username }});
		if (!existingUser) {
			return reply.status(401).send({ message: "User does not exist"});
		}

		//Compare the crypted password
		const passCheck = await bcrypt.compare(password, existingUser.password);

		if (!passCheck) {
			return reply.status(401).send({ message: "Invalid Password."});
		}

		return reply.status(200).send({
			message: "Login successful!",
			// Do frontend need this??? *****
			user: {
				userId: existingUser.userId,
				userName: existingUser.userName,
			},

		});
	});
}

import { FastifyInstance } from "fastify";
import { prisma } from '../plugins/prisma';
import bcrypt from "bcrypt";

export default async function registrationRoutes(app: FastifyInstance) {
	app.post("/api/user/registration", async (request, reply) => {
		const { username, email, password } = request.body as {
			username?: string;
			email?: string;
			password?: string;
		};

		if (!username || !email || !password) {
			return reply.status(400).send({ message: "User information missing." });
		}

		const isUsernameDup = await prisma.user_info.findUnique({ where: { username } });
		if (isUsernameDup) {
			return reply.status(400).send({ message: "Username " + username + " is already taken." });
		}

		const isEmailDup = await prisma.user_info.findUnique({ where: { email } });
		if (isEmailDup) {
			return reply.status(400).send({ message: "Email " + email + " already exists." });
		}

		//Encrypt the password
		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await prisma.user_info.create({
			data: { username,
					email,
					password: hashedPassword },
		});

		return reply.status(201).send({
			message: "User registered successfully!",
			// Do frontend need this??? *****
			user: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	});
}

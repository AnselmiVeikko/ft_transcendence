import { FastifyInstance } from "fastify";
import { prisma } from '../plugins/prisma';
import bcrypt from "bcrypt";

export default async function registrationRoutes(app: FastifyInstance) {
	app.post("/user/registration", async (request, reply) => {
		const { username, email, password } = request.body as {
			username?: string;
			email?: string;
			password?: string;
		};

		if (!username || !email || !password) {
			return reply.status(400).send({ error: "All fields are required." });
		}

		const existingUser = await prisma.user_info.findUnique({ where: { email } });
		if (existingUser) {
			return reply.status(400).send({ error: "Email already registered." });
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
			user: {
				id: newUser.id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	});
}

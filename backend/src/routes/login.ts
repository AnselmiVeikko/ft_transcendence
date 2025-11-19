import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export default async function loginRoutes(app: FastifyInstance) {
    app.post("/user/login", async (request, reply) => {
        const { username, password } = request.body as {
            username?: string;
            password?: string;
        };
    
    if (!username || !password) {
        return reply.status(400).send({ error: "All fields are required."});
    }

    const existingUser = await prisma.user_info.findUnique({ where: { username }});
    if (!existingUser) {
        return reply.status(401).send({ error: "User does not exist"});
    }

    //Check the crypted password
    const passCheck = await bcrypt.compare(password, existingUser.password);

    if (!passCheck) {
        return reply.status(401).send({ error: "Invalid credentials."});
    }

    return reply.status(200).send({
        user: "Login succesful",

    });
    });
}


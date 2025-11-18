import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken";

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

    // const token = jwt.sign(
    //     { userId: existingUser.id, username: existingUser.username },
    //     ProcessingInstruction.env.JWT_SECRET || "dev-secret",
    //     { expiresIn: "7d" }
    // )

    return reply.status(200).send({
        user: "Login succesful",
        // token,
        // user: { id: existingUser.id, username: existingUser.username }
    });
    });
}

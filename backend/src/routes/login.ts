import  bcrypt  from "bcrypt";
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";
import { prisma } from "../plugins/prisma";
import { loginSuccess } from "../utils/responses";
import { LoginBodySchema, LoginResponseSchema, ErrorResponseSchema } from "../schemas/user";
import { setCookies } from "../utils/auth";

type LoginRequest = FastifyRequest<{ Body: Static<typeof LoginBodySchema> }>;

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

    		//Compare the crypted password
    		const passCheck = await bcrypt.compare(password, user.password);

        if (!passCheck) {
            return reply.status(401).send({ error: "Invalid credentials."});
        }

    setCookies(reply, user.userId, user.username);
    return reply.status(200).send(loginSuccess(user));
    });
}

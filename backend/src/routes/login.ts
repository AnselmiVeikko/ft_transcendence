import  bcrypt  from "bcrypt";
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@sinclair/typebox";
import { prisma } from "../plugins/prisma";
import loginSuccess from "../utils/responses";
import LoginBodySchema, LoginResponseSchema, ErrorResponseSchema from "../schemas/user"

type LoginRequest = FastifyRequest<{ Body: Static<typeof LoginBodySchema> }>;

dotenv.config();

export default async function loginRoutes(app: FastifyInstance) {
    app.post( "/user/login", {
        schema: {
               body: LoginBodySchema,
               response: {
                   200: LoginResponseSchema,
                   400: ErrorResponseSchema,
                   401: ErrorResponseSchema,
               },
           },
    },
    async (request: LoginRequest, reply: FastifyReply) => {
    const { username, password } = request.body;
    
        const user = await prisma.user_info.findUnique({ where: { username }});
        if (!user) { 
            return reply.status(401).send({ error: "User does not exist"});
        }

        //Check the crypted password
        const passCheck = await bcrypt.compare(password, user.password);

        if (!passCheck) {
            return reply.status(401).send({ error: "Invalid credentials."});
        }

        const token = jwt.sign({
            userId: user.id, username: user.username },
            process.env.JWT_SECRET || "dev-secret",
            { expiresIn: "7d" }
        )

    reply.setCookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 //7 (days), 24 (hours), 60 (minutes), 60 (seconds) = 7 days in seconds
        })
        .status(200)
        .send({ message:"Login succesful", user: { id: existingUser.id, username: existingUser.username } });
    });
}

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

    setCookies(reply, user.userId, user.username);
    return reply.status(200).send(loginSuccess(user));
    });
}

import  bcrypt  from "bcrypt";
import  jwt  from "jsonwebtoken";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../plugins/prisma";
import { loginSuccess } from "../utils/responses";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"; //Tool to enforce strict types
import { LoginBodySchema, LoginResponseSchema, ErrorResponseSchema } from "../schemas/user"

export default async function loginRoutes(app: FastifyInstance) {
    app.withTypeProvider<TypeBoxTypeProvider>().post(
        "/user/login",
        {
            schema: {
                body: LoginBodySchema,
                response: {
                    200: LoginResponseSchema,
                    400: ErrorResponseSchema,
                    401: ErrorResponseSchema,
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
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

    return reply.status(200).send(loginSuccess(user, token));
    });
}

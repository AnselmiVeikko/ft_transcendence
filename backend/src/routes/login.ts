import { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma";
import { bcrypt } from "bcrypt";
import { jwt } from "jsonwebtoken";

export default async function loginRoutes(app: FastifyInstance) {
    app.post("/user/login", async (request, reply) => {
        const { username, password } = request.body as { username?: string; password?: string; };
    
    if (!username || !password) {
        return reply.status(400).send({ error: "All fields are required."});
    }

    const existingUser = await prisma.user_info.findUnique({ where: { username }});
    if (!existingUser) {
        return reply.status(401).send({ error: "Invalid credentials."});
    }

    //Check the crypted password
    const passCheck = await bcrypt.compare(password, existingUser.password);

    if (!passCheck) {
        return reply.status(401).send({ error: "Invalid credentials."});
    }

    const token = jwt.sign(
        { userId: existingUser.id, username: existingUser.username },
        process.env.JWT_SECRET || "dev-secret",
        { expiresIn: "7d" }
    )

    reply.setCookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60
        })
        .status(200)
        .send({ message:"Login succesful", user: { id: existingUser.id, username: existingUser.username } });
    });
}
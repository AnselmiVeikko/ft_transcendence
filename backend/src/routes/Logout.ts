import { prisma } from "../plugins/prisma";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LogoutResponseSchema, ErrorResponseSchema } from "../schemas/UserSchema";
import { logoutSuccess, errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../utils/auth";
import { clearCookies } from "../utils/auth";

export default async function logoutRoutes(app: FastifyInstance) {
    app.post( "/api/user/logout", {
        schema: {
               response: {
                   200: LogoutResponseSchema,
                   default: ErrorResponseSchema,
               },
           },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = await verifyAccess(request, reply);
        if (!userId)
            return;

        const user = await prisma.user_info.findUnique({ where: { userId }}); //TODO: Wrap in try/catch
        if (!user) {
           return reply.status(401).send(errorResponse(401, "User does not exist"));
        }

        
        clearCookies(reply);
        
        const responseUser = {
            userId: user.userId,
            userName: user.userName,
        };

        await prisma.user_info.update({ where: { userId: user.userId }, data: { status: 'OFFLINE' } }); //TODO: Wrap in try/catch

        return reply.status(200).send(logoutSuccess(responseUser));
    });
}
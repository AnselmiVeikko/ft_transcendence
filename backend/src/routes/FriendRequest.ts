import { FastifyInstance, FastifyRequest, FastifyReply, FastifyError } from "fastify";
import { FRSendBodySchema, FRAcceptBodySchema, FRDeclineQuerySchema, FRDeleteQuerySchema} from "../schemas/FriendSchema";
import { FRSendResponseSchema, FRAcceptResponseSchema, FRDeclineResponseSchema, FRDeleteResponseSchema } from "../schemas/FriendSchema";
import { FRAcceptSuccess, FRDecclineSuccess, FRSendSuccess, FRDeleteSuccess } from "../utils/FriendResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { errorResponse } from "../utils/UserResponses";
import { Static } from "@fastify/type-provider-typebox";
import prisma from "../plugins/prisma";

import { verifyAccess } from "../utils/auth";

type FriendRequestSend = FastifyRequest<{ Body: Static<typeof FRSendBodySchema> }>;
type FriendRequestAccept = FastifyRequest<{ Body: Static<typeof FRAcceptBodySchema> }>;
type FriendRequestDecline = FastifyRequest<{ Querystring: Static<typeof FRDeclineQuerySchema> }>;
type FriendRequestDelete = FastifyRequest<{ Querystring: Static<typeof FRDeleteQuerySchema> }>;

export default async function FriendRequest(app: FastifyInstance) {

	app.post( "/api/friendrequest/send", {
		schema: {
			body: FRSendBodySchema,
			response: {
				201: FRSendResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},

	async (request: FriendRequestSend, reply: FastifyReply) => {
		try{
			const { receiverId } = request.body;

			const senderId = await verifyAccess(request, reply);
			if (!senderId) {
				return;
			}

			if (senderId === receiverId) {
				return reply.status(400).send(errorResponse(400, "Sending self friend request is not allowed"));
			}

			const sender = await prisma.user_info.findUnique({where: { userId: senderId as string}});
			if (!sender) {
				return reply.status(401).send(errorResponse(401, "Sender does not exists"));
			}

			const receiver = await prisma.user_info.findUnique({ where: { userId: receiverId as string}});
			if (!receiver) {
				return reply.status(401).send(errorResponse(401, "Receiver does not exists"));
			}

			const sentRequestExist = await prisma.friend_request.findUnique({
				where: { senderId_receiverId: {senderId: senderId as string, receiverId: receiverId as string}}});

			if (sentRequestExist) {
				return reply.status(400).send(errorResponse(400, "Friend request already exists"));
			}

			const revceivedRequestExist = await prisma.friend_request.findUnique({
				where: { senderId_receiverId: {senderId: receiverId as string, receiverId:  senderId as string}}});

			if (revceivedRequestExist) {
				return reply.status(400).send(errorResponse(400, "This user already sent you a request"));
			}

			const sendRequest = await prisma.friend_request.create({
				data: {
					senderId: senderId as string,
					receiverId: receiverId as string,
				}
			});
			return reply.status(201).send(FRSendSuccess(sendRequest));

		} catch (error) {
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});

	app.post( "/api/friendrequest/accept", {
		schema: {
			body: FRAcceptBodySchema,
			response: {
				200: FRAcceptResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},
	async (request: FriendRequestAccept, reply: FastifyReply) => {
		try{
			const { friendRId } = request.body;

			const receiverId = await verifyAccess(request, reply);
			if (!receiverId) {
				return;
			}

			const requestExist = await prisma.friend_request.findUnique({
				where: { friendRId: friendRId as string}});
			if (!requestExist) {
				return reply.status(404).send(errorResponse(404, "Friend request not found"));
			}

			if (requestExist.receiverId !== receiverId) {
				return reply.status(403).send(errorResponse(403, "You are not allowed to accept this request"))
			}

			if (requestExist.requestStatus === "ACCEPTED") {
				return reply.status(400).send(errorResponse(400, "Friend request already accepted"));
			}

			const acceptRequest = await prisma.friend_request.update({
				where: {
					friendRId: friendRId as string,
				},
				data: {
					requestStatus: "ACCEPTED",
					updatedAt: new Date(),
				},
			});

			return reply.status(200).send(FRAcceptSuccess(acceptRequest));
		} catch (error) {
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});

	app.delete( "/api/friendrequest/decline", {
		schema: {
			querystring: FRDeclineQuerySchema,
			response: {
				200: FRDeclineResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},
	async (request: FriendRequestDecline, reply: FastifyReply) => {
		try{
			const { friendRId } = request.query;

			const receiverId =  await verifyAccess(request, reply);
			if (!receiverId) {
				return;
			}

			const requestExist = await prisma.friend_request.findUnique({
				where: { friendRId: friendRId as string}});
			if (!requestExist) {
				return reply.status(404).send(errorResponse(404, "Friend request not found"));
			}

			if (requestExist.receiverId !== receiverId) {
				return reply.status(403).send(errorResponse(403, "You are not allowed to decline this request"))
			}

			if (requestExist.requestStatus === "ACCEPTED") {
				return reply.status(400).send(errorResponse(400, "Friend request already accepted"));
			}

			const declineRequest = await prisma.friend_request.delete({
				where: {
					friendRId: friendRId as string,
				},
			});

			return reply.status(200).send(FRDecclineSuccess(declineRequest));
		} catch (error) {
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});

	app.delete( "/api/friendrequest/delete", {
		schema: {
			querystring: FRDeleteQuerySchema,
			response: {
				200: FRDeleteResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},
	async (request: FriendRequestDelete, reply: FastifyReply) => {
		try{
			const { friendRId } = request.query;

			const deleteBy =  await verifyAccess(request, reply);
			if (!deleteBy) {
				return;
			}

			const requestExist = await prisma.friend_request.findUnique({
				where: { friendRId: friendRId as string}});
			if (!requestExist) {
				return reply.status(404).send(errorResponse(404, "Friend request not found"));
			}

			if (requestExist.senderId !== deleteBy && requestExist.receiverId !== deleteBy) {
				return reply.status(403).send(errorResponse(403, "You are not allowed to delete this request"))
			}

			if (requestExist.requestStatus !== "ACCEPTED") {
				return reply.status(400).send(errorResponse(400, "Not friend"));
			}

			const deleteRequest = await prisma.friend_request.delete({
				where: {
					friendRId: friendRId as string,
				},
			});

			return reply.status(200).send(FRDeleteSuccess(deleteRequest));
		} catch (error) {
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

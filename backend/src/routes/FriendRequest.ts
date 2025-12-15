import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { FRAcceptBodySchema, FRAcceptResponseSchema, FRDeclineBodySchema, FRDeclineResponseSchema, FRSendBodySchema, FRSendResponseSchema } from "../schemas/FriendSchema";
import { Static } from "@fastify/type-provider-typebox";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { request } from "http";
import { errorResponse } from "../utils/UserResponses";
import prisma from "../plugins/prisma";
import { FRAcceptSuccess, FRDecclineSuccess, FRSendSuccess } from "../utils/FriendResponses";

type FriendRequestSend = FastifyRequest<{ Body: Static<typeof FRSendBodySchema> }>;
type FriendRequestAccept = FastifyRequest<{ Body: Static<typeof FRAcceptBodySchema> }>;
type FriendRequestDecline = FastifyRequest<{ Body: Static<typeof FRDeclineBodySchema> }>;

export default async function FriendRequest(app: FastifyInstance) {

	app.post( "/api/friendrequest/send", {
		schema: {
			body: FRSendBodySchema,
			response: {
				200: FRSendResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},
	async (request: FriendRequestSend, reply: FastifyReply) => {
		try{

			const {senderId, receiverId} = request.body;

			// add validation : senderID == userID (from cookie) ************

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

			// What to do when request status is "DECLINED" ???????????
			const requestExist = await prisma.friend_request.findUnique({
				where: { senderId_receiverId: {senderId: senderId as string, receiverId: receiverId as string}}});
			if (requestExist) {
				return reply.status(400).send(errorResponse(400, "Friend request already exists"));
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

			const {senderId, receiverId} = request.body;

			// add validation : receiverId == userID (from cookie) ***********

			const requestExist = await prisma.friend_request.findUnique({
				where: { senderId_receiverId: {senderId: senderId as string, receiverId: receiverId as string}}});
			if (!requestExist) {
				return reply.status(404).send(errorResponse(404, "Friend request not found"));
			}

			if (requestExist.requestStatus === "ACCEPTED") {
				return reply.status(400).send(errorResponse(400, "Friend request already accepted"));
			}

			// What to do when request status is "DECLINED" ??????????
			if (requestExist.requestStatus === "DECLINED") {
				return reply.status(400).send(errorResponse(400, "Friend request declined, make new request"));
			}

			const acceptRequest = await prisma.friend_request.update({
				where: { senderId_receiverId: {
					senderId: senderId as string,
					receiverId: receiverId as string,
					},
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

	app.post( "/api/friendrequest/decline", {
		schema: {
			body: FRDeclineBodySchema,
			response: {
				200: FRDeclineResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},
	async (request: FriendRequestDecline, reply: FastifyReply) => {
		try{

			const {senderId, receiverId} = request.body;

			// add validation : receiverId == userID (from cookie) ***********

			const requestExist = await prisma.friend_request.findUnique({
				where: { senderId_receiverId: {senderId: senderId as string, receiverId: receiverId as string}}});
			if (!requestExist) {
				return reply.status(404).send(errorResponse(404, "Friend request not found"));
			}

			if (requestExist.requestStatus === "ACCEPTED") {
				return reply.status(400).send(errorResponse(400, "Friend request already accepted"));
			}

			if (requestExist.requestStatus === "DECLINED") {
				return reply.status(400).send(errorResponse(400, "Friend request already declined"));
			}

			const declineRequest = await prisma.friend_request.update({
				where: { senderId_receiverId: {
					senderId: senderId as string,
					receiverId: receiverId as string,
					},
				},
				data: {
					requestStatus: "DECLINED",
					updatedAt: new Date(),
				},
			});

			return reply.status(200).send(FRDecclineSuccess(declineRequest));
		} catch (error) {
			app.log.error(error);
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}



// api/friend/reject

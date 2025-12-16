import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import { FLCurrentQuerySchema, FLPendingQuerySchema, FLSuggestionQuerySchema } from "../schemas/FriendSchema";
import { FLCurrentResponseSchema, FLPendingResponseSchema, FLSuggestionResponseSchema } from "../schemas/FriendSchema";
import { CurrentList, PendingList, SuggestionList } from "../utils/FriendResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../utils/auth";
import prisma from "../plugins/prisma";


// Friend List **
type FriendCurrentList = FastifyRequest<{ Querystring: Static<typeof FLCurrentQuerySchema> }>;
type FriendPendingList = FastifyRequest<{ Querystring: Static<typeof FLPendingQuerySchema> }>;
type FriendSuggestion = FastifyRequest<{ Querystring: Static<typeof FLSuggestionQuerySchema>}>;

export default async function FriendList(app: FastifyInstance) {
	app.get( "/api/friendlist/current", {
		schema: {
			querystring: FLCurrentQuerySchema,
			response: {
				200: FLCurrentResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},

	async (request: FriendCurrentList, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}
			const relationList = await prisma.friend_request.findMany({
				where: {
					requestStatus: "ACCEPTED",
					OR: [
						{ senderId: userId },
						{ receiverId: userId }
					]
				},
				include: {
					sender: true,
					receiver: true,
				},
			});

			const friendsList = relationList.map(rel => {
				const friend = rel.senderId === userId? rel.receiver : rel.sender;

				return {
					friendRId: rel.friendRId,
					userId: friend.userId,
					userName: friend.userName,
				};
			});

			return reply.status(200).send(CurrentList(friendsList));

		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Intenal server error"));
		}

	});

	app.get( "/api/friendlist/pending", {
		schema: {
			querystring: FLPendingQuerySchema,
			response: {
				200: FLPendingResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},

	async (request: FriendPendingList, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}
			const relationList = await prisma.friend_request.findMany({
				where: {
					requestStatus: "PENDING",
					receiverId: userId,
				},
				include: {
					sender: true,
				}
			});

			const pendingList = relationList.map(rel => ({
				friendRId: rel.friendRId,
				userId: rel.sender.userId,
				userName: rel.sender.userName,
			}));

			return reply.status(200).send(PendingList(pendingList));

		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Intenal server error"));
		}

	});

	app.get( "/api/friendlist/suggestion", {
		schema: {
			querystring: FLSuggestionQuerySchema,
			response: {
				200: FLSuggestionResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},

	async (request: FriendSuggestion, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}
			const relationList = await prisma.friend_request.findMany({
				where: {
					requestStatus: { in: ["PENDING", "ACCEPTED"] },
					OR: [
						{ senderId: userId },
						{ receiverId: userId },
					]
				},
			});

			const ignoreList = new Set<string>();
			ignoreList.add(userId);

			relationList.forEach(rel => {
				ignoreList.add(rel.senderId);
				ignoreList.add(rel.receiverId);
			})

			const suggestionList = await prisma.user_info.findMany({
				where: {
					userId: { notIn: Array.from(ignoreList)},
				},
				select: {
					userId: true,
					userName: true,
				},
			});

			return reply.status(200).send(SuggestionList(suggestionList));

		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Intenal server error"));
		}
	});
}



// Find/ Search not friend/not friend? **

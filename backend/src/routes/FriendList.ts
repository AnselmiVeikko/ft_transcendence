import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import { FLCurrentQuerySchema, FLPendingQuerySchema, FLSuggestionQuerySchema } from "../schemas/FriendSchema";
import { FLCurrentResponseSchema, FLPendingResponseSchema, FLSuggestionResponseSchema } from "../schemas/FriendSchema";
import { currentList, pendingList, suggestionList } from "../utils/FriendResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../utils/auth";
import prisma from "../plugins/prisma";


type FriendCurrentList = FastifyRequest<{ Querystring: Static<typeof FLCurrentQuerySchema> }>;
type FriendPendingList = FastifyRequest<{ Querystring: Static<typeof FLPendingQuerySchema> }>;
type FriendSuggestion = FastifyRequest<{ Querystring: Static<typeof FLSuggestionQuerySchema>}>;

export default async function friendList(app: FastifyInstance) {
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

			const pageNo = request.query.pageNo? Math.max(1, Number(request.query.pageNo)) : 1;
			const limit = request.query.limit? Math.max(1, Number(request.query.limit))	: 10;
			const skip = (pageNo - 1) * limit;
			const totalFriend = await prisma.friend_request.count({
				where: {
					requestStatus: "ACCEPTED",
					OR: [ { senderId: userId }, {receiverId: userId } ],
				},
			});

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
				skip,
				take: limit,
				orderBy: {
					updatedAt: "desc",
				}
			});

			const friendsList = relationList.map((rel: any) => {
				const friend = rel.senderId === userId? rel.receiver : rel.sender;

				return {
					friendRId: rel.friendRId,
					userId: friend.userId,
					userName: friend.userName,
				};
			});

			return reply.status(200).send(currentList(friendsList, pageNo, limit, totalFriend));
		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Internal server error"));
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

			const pendingRequests = relationList.map((rel: any) => ({
				friendRId: rel.friendRId,
				userId: rel.sender.userId,
				userName: rel.sender.userName,
			}));

			return reply.status(200).send(pendingList(pendingRequests));

		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Internal server error"));
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

			relationList.forEach((rel: { senderId: string; receiverId: string; }) => {
				ignoreList.add(rel.senderId);
				ignoreList.add(rel.receiverId);
			})

			const suggestions = await prisma.user_info.findMany({
				where: {
					userId: { notIn: Array.from(ignoreList)},
				},
				select: {
					userId: true,
					userName: true,
				},
			});

			return reply.status(200).send(suggestionList(suggestions));

		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

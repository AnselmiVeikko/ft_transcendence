import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Static, StaticAny } from "@fastify/type-provider-typebox";
import { Prisma } from "@prisma/client";
import { FLCurrentQuerySchema, FLSearchQuerySchema, FLPendingQuerySchema, FLSuggestionQuerySchema } from "../schemas/FriendSchema";
import { FLCurrentResponseSchema, FLSearchResponseSchema, FLPendingResponseSchema, FLSuggestionResponseSchema } from "../schemas/FriendSchema";
import { currentList, searchList, pendingList, suggestionList } from "../utils/FriendResponses";
import { ErrorResponseSchema } from "../schemas/UserSchema";
import { getAvatarUrl, errorResponse } from "../utils/UserResponses";
import { verifyAccess } from "../utils/auth";
import prisma from "../plugins/prisma";


type FriendCurrentList = FastifyRequest<{ Querystring: Static<typeof FLCurrentQuerySchema> }>;
type FriendSearchList = FastifyRequest<{ Querystring: Static<typeof FLSearchQuerySchema> }>;
type FriendPendingList = FastifyRequest<{ Querystring: Static<typeof FLPendingQuerySchema> }>;
type FriendSuggestion = FastifyRequest<{ Querystring: Static<typeof FLSuggestionQuerySchema>}>;

export default async function friendList(app: FastifyInstance) {
	app.get( "/api/friendlist/search", {
		schema: {
			querystring: FLSearchQuerySchema,
			response: {
				200: FLSearchResponseSchema,
				default: ErrorResponseSchema,
			},
		},
	},

	async (request: FriendSearchList, reply: FastifyReply) => {
		try {
			const userId = await verifyAccess(request, reply);
			if (!userId) {
				return;
			}

			const { keyWord, onlineStatus = "ALL" } = request.query;
			const pageNo = request.query.pageNo? Math.max(1, Number(request.query.pageNo)) : 1;
			const limit = request.query.limit? Math.max(1, Number(request.query.limit))	: 10;
			const skip = (pageNo - 1) * limit;

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

			let friendsList = relationList.map(rel => {
				const friend = rel.senderId === userId? rel.receiver : rel.sender;
				const avatarUrl = getAvatarUrl(friend.avatarName);
				return {
					friendRId: rel.friendRId,
					userId: friend.userId,
					userName: friend.userName,
					status: friend.status,
					avatarUrl,
				};
			});

			if (keyWord && keyWord.trim() !== "") {
				friendsList = friendsList.filter( friend =>
					friend.userName.toLowerCase().includes(keyWord.toLocaleLowerCase())
				);
			}

			if (onlineStatus !== "ALL") {
				friendsList = friendsList.filter (
					friend => friend.status === onlineStatus);
			}

			const totalFriend = friendsList.length;
			const totalPage = Math.ceil(totalFriend / limit);

			const start = (pageNo - 1) * limit;
			const pagedFriends = friendsList.slice(start, start + limit);

			return reply.status(200).send(searchList(pagedFriends, pageNo, limit, totalFriend, totalPage));
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
					sender: {
						select: {
							userId: true,
							userName: true,
							avatarName: true,
						},
					  },
				}
			});

			const pendingRequests = relationList.map((rel: any) => ({
				friendRId: rel.friendRId,
				userId: rel.sender.userId,
				userName: rel.sender.userName,
				avatarUrl: getAvatarUrl(rel.sender.avatarName),
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
					avatarName: true,
				},
			});

			const suggestionsWithAvatar = suggestions.map(user => ({
				userId: user.userId,
				userName: user.userName,
				avatarUrl: getAvatarUrl(user.avatarName),
			  }));

			return reply.status(200).send(suggestionList(suggestionsWithAvatar));

		} catch(error) {
			return reply.status(500).send(errorResponse(500, "Internal server error"));
		}
	});
}

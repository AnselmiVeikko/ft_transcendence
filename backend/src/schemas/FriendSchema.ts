import { Type } from "@sinclair/typebox";
import { syncBuiltinESMExports } from "module";

// Friend List Schemas

export const FLCurrentQuerySchema = Type.Object({
	// userId will retrieve from cookies
	pageNo: Type.Optional(
		Type.String({ pattern: "^[0-9]+$" })
	),
	limit: Type.Optional(
		Type.String({ pattern: "^[0-9]+$" })
	),
})

export const FLCurrentResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Array(
		Type.Object({
			friendRId: Type.String(),
			userId: Type.String(),
			userName: Type.String(),
			avatarUrl: Type.String(),
		}),
	),

	pagination: Type.Object({
		pageNo:     Type.Number(),
		limit:      Type.Number(),
		totalFriend:  Type.Number(),
		totalPage:  Type.Number(),
	})
})

export const FLSearchQuerySchema = Type.Object({
	// userId will retrieve from cookies
	keyWord: Type.Optional(Type.String()),
	onlineStatus: Type.Optional(
		Type.Union([
			Type.Literal("ONLINE"),
			Type.Literal("OFFLINE"),
			Type.Literal("ALL"),
			// add inactive later
		])
	),
	pageNo: Type.Optional(
		Type.String({ pattern: "^[0-9]+$" })),
	limit: Type.Optional(
		Type.String({ pattern: "^[0-9]+$" })),
})

export const FLSearchResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Array(
		Type.Object({
			friendRId: Type.String(),
			userId: Type.String(),
			userName: Type.String(),
			status: Type.String(),
			avatarUrl: Type.String(),
		}),
	),

	pagination: Type.Object({
		pageNo:     Type.Number(),
		limit:      Type.Number(),
		totalFriend:  Type.Number(),
		totalPage:  Type.Number(),
	})
})


export const FLPendingQuerySchema = Type.Object({
	// userId will retrieve from cookies
})

export const FLPendingResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Array(
		Type.Object({
			friendRId: Type.String(),
			userId: Type.String(),
			userName: Type.String(),
			avatarUrl: Type.String(),
		}),
	),
})

export const FLSuggestionQuerySchema = Type.Object({
	// userId will retrieve from cookies
})

export const FLSuggestionResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Array(
		Type.Object({
			userId: Type.String(),
			userName: Type.String(),
			avatarUrl: Type.String(),
		}),
	),
})

// Friend Request Schemas

export const FRSendBodySchema = Type.Object({
	receiverId: Type.String(),
})

export const FRSendResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		friendRId: Type.String(),
		senderId: Type.String(),
		receiverId: Type.String(),
	}),
})

export const FRAcceptBodySchema = Type.Object({
	friendRId: Type.String(),
})

export const FRAcceptResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		friendRId: Type.String(),
		senderId: Type.String(),
		receiverId: Type.String(),
	})
})

export const FRDeclineQuerySchema = Type.Object({
	friendRId: Type.String(),
})

export const FRDeclineResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		friendRId: Type.String(),
		senderId: Type.String(),
		receiverId: Type.String(),
	})
})

export const FRDeleteQuerySchema = Type.Object({
	friendRId: Type.String(),
})

export const FRDeleteResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		friendRId: Type.String(),
		senderId: Type.String(),
		receiverId: Type.String(),
	})
})

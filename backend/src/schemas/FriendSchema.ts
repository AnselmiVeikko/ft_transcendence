import { Type } from "@sinclair/typebox";
import { syncBuiltinESMExports } from "module";

// Friend List Schemas

export const FLCurrentQuerySchema = Type.Object({
	// userId will retrieve from cookies
})

export const FLCurrentResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Array(
		Type.Object({
			friendRId: Type.String(),
			userId: Type.String(),
			userName: Type.String(),
			//avatar:
		}),
	),
})

export const FLPendingQuerySchema = Type.Object({
	// userId will retrieve from cookies
})

export const FLPendingResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Array(
		Type.Object({
			userId: Type.String(),
			userName: Type.String(),
			//avatar:
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
			//avatar:
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
		senderId: Type.String(),
		receiverId: Type.String(),
	}),
})

export const FRAcceptBodySchema = Type.Object({
	friendRId: Type.String(),
	senderId: Type.String(),
})

export const FRAcceptResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		friendRId: Type.String(),
		senderId: Type.String(),
		receiverId: Type.String(),
	})
})

export const FRDeclineBodySchema = Type.Object({
	friendRId: Type.String(),
	senderId: Type.String(),
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
	})
})

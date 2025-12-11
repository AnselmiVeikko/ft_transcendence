import { Type } from "@sinclair/typebox";

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

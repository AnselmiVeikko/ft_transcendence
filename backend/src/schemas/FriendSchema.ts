import { Type } from "@sinclair/typebox";

export const FRSendBodySchema = Type.Object({
	senderId: Type.String(),
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
	senderId: Type.String(),
	receiverId: Type.String(),
})

export const FRAcceptResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		senderId: Type.String(),
		receiverId: Type.String(),
	})
})

export const FRDeclineBodySchema = Type.Object({
	senderId: Type.String(),
	receiverId: Type.String(),
})

export const FRDeclineResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		senderId: Type.String(),
		receiverId: Type.String(),
	})
})

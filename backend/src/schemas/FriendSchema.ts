import { Type } from "@sinclair/typebox";

export const FRSendBodySchema = Type.Object({
	senderId: Type.Number(),
	receiverId: Type.Number(),
	requestStatus: Type.Number(),
})

export const FRSendResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		senderId: Type.Number(),
		receiverId: Type.Number(),
	}),
})

export const FRAcceptBodySchema = Type.Object({
	senderId: Type.Number(),
	receiverId: Type.Number(),
	requestStatus: Type.Number(),
})

export const FRAcceptResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		senderId: Type.Number(),
		receiverId: Type.Number(),
	})
})

export const FRDeclineBodySchema = Type.Object({
	senderId: Type.Number(),
	receiverId: Type.Number(),
	requestStatus: Type.Number(),
})

export const FRDeclineResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		senderId: Type.Number(),
		receiverId: Type.Number(),
	})
})

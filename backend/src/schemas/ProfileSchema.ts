import { Type } from "@sinclair/typebox";

export const ProfileUpdateSchema = Type.Object({
	userName: Type.Optional(Type.String()),
	email: Type.Optional(Type.String()),
})

export const ProfileUpdateResponseSchema = Type.Object({
	message: Type.String(),
	data: Type.Object({
		userId: Type.String(),
		userName: Type.String(),
		email: Type.String(),
	}),
})

import { Type, Static } from "@sinclair/typebox";

export const LoginBodySchema = Type.Object({
    username: Type.String(),
    password: Type.String(),
});

export const LoginResponseSchema = Type.Object({
    message: Type.String(),
    token: Type.String(),
    user: Type.Object({
        id: Type.Number(),
        username: Type.String(),
    }),
});

export const RegisterBodySchema = Type.Object({
    username: Type.String(),
    email: Type.String(),
    password: Type.String(),
});

export const RegisterResponseSchema = Type.Object({
    message: Type.String(),
    user: Type.Object({
        id: Type.Number(),
        username: Type.String(),
        email: Type.String(),
    }),
});

export const ErrorResponseSchema = Type.Object({
    statusCode: Type.Number(),
    error: Type.String(),
    message: Type.String(),
});
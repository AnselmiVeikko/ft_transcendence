import { Type, Static } from "@sinclair/typebox";

export const LoginBodySchema = Type.Object({
    userName: Type.String(),
    password: Type.String(),
});

export const LoginResponseSchema = Type.Object({
    message: Type.String(),
    //token: Type.String(),
    user: Type.Object({
        userId: Type.Number(),
        userName: Type.String(),
    }),
});

export const RegisterBodySchema = Type.Object({
    userName: Type.String(),
    email: Type.String(),
    password: Type.String(),
});

export const RegisterResponseSchema = Type.Object({
    message: Type.String(),
    user: Type.Object({
        userId: Type.Number(),
        userName: Type.String(),
    }),
});

export const ErrorResponseSchema = Type.Object({
    //statusCode: Type.Number(),
    //error: Type.String(),
    message: Type.String(),
});

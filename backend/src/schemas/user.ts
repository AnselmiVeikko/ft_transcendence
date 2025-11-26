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


// Registration body and response schema
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

// Profile body and response schema
export const ProfilePersonalQuerySchema = Type.Object({
    userId: Type.String(),
});

export const ProfilePersonalResponseSchema = Type.Object({
    message: Type.String(),
    //token: Type.String(),
    userProfile: Type.Object({
        userId: Type.Number(),
        userName: Type.String(),
        email: Type.String(),
    }),
});


// Error Response
export const ErrorResponseSchema = Type.Object({
    //statusCode: Type.Number(),
    //error: Type.String(),
    message: Type.String(),
});

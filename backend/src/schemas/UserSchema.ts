import { Type, Static } from "@sinclair/typebox";

//Login and logout schemas
export const LoginBodySchema = Type.Object({
    email: Type.String(),
    password: Type.String(),
});

export const LoginResponseSchema = Type.Object({
    message: Type.String(),
});

export const LogoutResponseSchema = Type.Object({
    message: Type.String(),
});

// Registration body and response schema
export const RegisterBodySchema = Type.Object({
    userName: Type.String(),
    email: Type.String(),
    password: Type.String(),
});

export const RegisterResponseSchema = Type.Object({
    message: Type.String(),
});

export const refreshAccessResponseSchema = Type.Object({
    message: Type.String(),
});

// SELF Profile Query and response schema
export const ProfileSelfQuerySchema = Type.Object({
});

export const ProfileSelfResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        userId:     Type.String(),
        userName:   Type.String(),
        email:      Type.String(),
        avatarUrl:  Type.String(),
    }),
});

export const ProfileAvatarResponseSchema = Type.Object({
    message: Type.String(),
});

// Error Response
export const ErrorResponseSchema = Type.Object({
    statusCode: Type.Number(),
    error: Type.String(),
    message: Type.String(),
});

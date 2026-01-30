import { Type, Static } from "@sinclair/typebox";

//login and logout schemas
export const LoginBodySchema = Type.Object({
    userName: Type.String(),
    password: Type.String(),
});

export const LoginResponseSchema = Type.Object({
    message: Type.String(),
    //token: Type.String(),
    data: Type.Object({
        userId: Type.String(),
        userName: Type.String(),
    }),
});

export const LogoutResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({

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
    data: Type.Object({
        userId:     Type.String(),
        userName:   Type.String(),
    }),
});

export const refreshAccessResponseSchema = Type.Object({
    message: Type.String(),
});

// SELF Profile Query and response schema
export const ProfileSelfQuerySchema = Type.Object({
    //userId: Type.String(),
});

export const ProfileSelfResponseSchema = Type.Object({
    message: Type.String(),
    //token: Type.String(),
    data: Type.Object({
        userId:     Type.String(),
        userName:   Type.String(),
        email:      Type.String(),
        avatarUrl:  Type.String(),
    }),
});

// ALL Profile query and response schema
export const ProfileAllfQuerySchema = Type.Object({
    // Pagination
    pageNo: Type.String(),
    limit:  Type.String(),
});

export const ProfileAllResponseSchema = Type.Object({
    message: Type.String(),
    //token: Type.String(),
    data: Type.Array(
        Type.Object({
            userId:     Type.String(),
            userName:   Type.String(),
            email:      Type.String(),
            avatarUrl:  Type.String(),
        }),
    ),

    pagination: Type.Object({
        pageNo:     Type.Number(),
        limit:      Type.Number(),
        totalUser:  Type.Number(),
        totalPage:  Type.Number(),
    })

});

// AVATAR SCHEMA

//export const ProfileAvatarSchema = Type.Object({
//    file: Type.String(),
//});

export const ProfileAvatarResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        userId:     Type.String(),
        userName:   Type.String(),
        avatarName: Type.Union([Type.String(), Type.Null()]),
    }),
});


// Error Response
export const ErrorResponseSchema = Type.Object({
    statusCode: Type.Number(),
    error: Type.String(),
    message: Type.String(),
});

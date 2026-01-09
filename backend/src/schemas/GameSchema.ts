import { Type } from "@sinclair/typebox"

export const MatchFoundResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        matchId: Type.String(),
        playerOneId: Type.String(),
        playerTwoId: Type.String(),
    }),
});

export const MatchCreatedResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        matchId: Type.String(),
        playerOneId: Type.String(),
    }),
});
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

export const GameTokenBodySchema = Type.Object({
    matchId: Type.String(),
});

export const GameTokenResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        gameToken: Type.String(),
        matchId: Type.String(),
        wsUrl: Type.String(),
        player: Type.Object({
            userId: Type.String(),
            username: Type.String(),
        }),
    }),
});
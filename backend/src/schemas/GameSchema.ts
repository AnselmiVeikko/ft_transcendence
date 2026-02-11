import { Type } from "@sinclair/typebox"


export const MatchmakingResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        matchId: Type.String(),
        gameToken: Type.String(),
        player: Type.Object({
            userId: Type.String(),
            username: Type.String(),
        }),
    }),
});

export const MatchStatusQuerySchema = Type.Object({
    matchId: Type.String(),
});


export const MatchStatusResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        matchStatus: Type.String(),
    }),
});

export const DeleteMatchBodySchema = Type.Object({
    matchId: Type.String(),
});

export const DeleteMatchResponseSchema = Type.Object({
    message: Type.String(),
});

export const MatchResultParamsSchema = Type.Object({
    matchId: Type.String(),
});

export const MatchResultBodySchema = Type.Object({
    winnerId: Type.String(),
    score: Type.Record(Type.String(), Type.Number()),
});

export const MatchResultResponseSchema = Type.Object({
    message: Type.String(),
});
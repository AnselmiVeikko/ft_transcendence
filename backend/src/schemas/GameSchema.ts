import { Type } from "@sinclair/typebox"
import { genGameToken } from "../authentication/auth";


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
})

export const FinishMatchBodySchema = Type.Object({
    matchId: Type.String(),
    winnerId: Type.String(),
})

export const FinishMatchResponseSchema = Type.Object({
})

export const AITokenBodySchema = Type.Object({
    matchId: Type.String(),
})

export const AITokenResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        gameToken: Type.String(),
    }),
})
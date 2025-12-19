import { Type } from "@sinclair/typebox"

export const MatchmakingResponseSchema = Type.Object({
    message: Type.String(),
    data: Type.Object({
        matchId: Type.String(),
        playerOneId: Type.String(),
        playerTwoId: Type.String(),
    }),
});